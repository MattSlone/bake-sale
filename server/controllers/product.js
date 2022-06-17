'use strict'

const { query } = require('express');
const db = require('../models/index')
const { Op, fn, col } = require("sequelize");
const GMaps = require('../lib/gmaps');
const shop = require('../routes/shop');

module.exports = class ProductController {
    async create (req, res, next) {
        try {
            const varieties = req.body.product?.custom ? { quantity: 1 } : req.body.product.varieties
            const product = await db.Product.create({
                name: req.body.product.name,
                category: req.body.product.category,
                custom: req.body.product.custom,
                processingTime: req.body.product.processingTime,
                description: req.body.product.description,
                automaticRenewal: req.body.product.automaticRenewal,
                inventory: req.body.product.inventory,
                personalizationPrompt: req.body.product.personalizationPrompt,
                Varieties: varieties,
                Addons: req.body.product.addons,
                Ingredients: req.body.product.ingredients,
                ShopId: req.body.shopId,
                Form: {
                    name: req.body.product.formName,
                    Fields: req.body.product.fields
                },
              }, {
                include: [
                    db.Ingredient,
                    db.Variety,
                    db.Addon,
                    {
                        association: db.Product.Form,
                        include: [ 
                            {
                                association: db.Form.Field,
                                include: [ 
                                    db.Option,
                                    db.Constraint,
                                    db.Value,
                                    db.ParagraphValue
                                ]
                            }
                        ]
                    }
                ]
            });
            return product
        }
        catch (err) {
            return next(err)
        }
    }

    async getLocalShopIds(user) {
        try { 
            const latLng = await GMaps.getLatLng(user)
            console.log('LATLG: ', latLng)
            const shops = await db.Shop.findAll()
            const shopIds = latLng?.lat ? (await Promise.all(
                shops.map(async shop => (await GMaps.haversine_distance(latLng, { lat: shop.lat, lng: shop.lng }) < shop.radius) ? shop.id : false)))
                    .filter(shop => shop !== false) : []
            return shopIds
        } catch (err) {
            console.log(err)
        }
    }

    async getDeliveryByTheMileCost(user, productId, quantity) {
        try {
            const product = await db.Product.findOne({
                where: { id: productId }
            })
            const shop = await db.Shop.findByPk(product.ShopId)
            if (product.custom) {
                quantity = 1
            }
            const variation = await db.Variety.findOne({ 
                where: {
                    ProductId: product.id,
                    quantity: quantity 
                }
            })
            const latLng = await GMaps.getLatLng(user)
            const distance_meters = GMaps.haversine_distance(latLng, { lat: shop.lat, lng: shop.lng })
            const miles = GMaps.convertMetersToMiles(distance_meters)
            const fulfillmentPrice = variation.delivery * miles
            return fulfillmentPrice
        } catch (err) {
            console.log(err)
        }
    }

    async list(req, res, next) {
        try {
            console.log("QUERY PARAMS: ", req.query)
            const user = req.user ? await db.User.findByPk(req.user.id) : {}
            const shopIds = (user.id && !req.query.shop) ? await this.getLocalShopIds(user) : []
            console.log('SHOP IDS: ', shopIds)
            const where = {
                ...(req.query.shop && {ShopId: req.query.shop}),
                ...(req.query.products && {id: req.query.products}),
                ...((user.id && !req.query.shop) && {ShopId: shopIds}),
                ...(req.query.category && { category: req.query.category }),
                ...(req.query.search && { name: { [Op.like]: `%${req.query.search}%` } })
            }
            let offset = Number(req.query.lastId) ? Number(req.query.lastId) : 0
            let limit = 6
            const products = await db.Product.findAll({
                where: where,
                offset: offset,
                limit: limit,
                include: [
                    db.Ingredient,
                    db.Variety,
                    db.Addon,
                    db.ProductImage,
                    {
                        association: db.Product.Form,
                        include: [ 
                            {
                                association: db.Form.Field,
                                include: [ 
                                    db.Option,
                                    db.Constraint,
                                    db.ParagraphValue,
                                    {
                                        association: db.Field.Value,
                                        include: [
                                            db.Quote
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            return products
        }
        catch(err) {
            console.log('ERROR:', err)
            return err
        }
    }

    async count(req, res, next) {
        try {
            console.log("QUERY PARAMS: ", req.query)
            const user = req.user ? await db.User.findByPk(req.user.id) : {}
            const shopIds = (user.id && !req.query.shop) ? await this.getLocalShopIds(user) : []
            console.log('SHOP IDS: ', shopIds)
            const where = {
                ...(req.query.shop && {ShopId: req.query.shop}),
                ...(req.query.products && {id: req.query.products}),
                ...((user.id && !req.query.shop) && {ShopId: shopIds}),
                ...(req.query.category && { category: req.query.category }),
                ...(req.query.search && { name: { [Op.like]: `%${req.query.search}%` } })
            }
            const count = await db.Product.count({ where: where });
            return count
        }
        catch(err) {
            console.log('ERROR:', err)
            return err
        }
    }

    async addImages(req, res, next) {
        try {
            await db.ProductImage.bulkCreate(
                req.files.map(file => {
                    return {
                        name: file.originalname,
                        path: file.path,
                        ProductId: req.body.productId
                    }
                })
            )
        } catch (err) {
            console.log(err)
        }
    }

    async update (req, res, next) {
        try {
            let product = await db.Product.update(req.body.product,
                {
                    where: {id: req.body.product.id},
                }
            );
            product = await db.Product.findByPk(req.body.product.id, 
                {
                    include: [db.Variety, db.Addon, db.Ingredient]
                }
            );
            let varieties = await this.upsertAssociation(product, db.Variety, req.body.product.varieties)
            await product.setVarieties(varieties.map(variety => variety.id))
            await db.Variety.destroy({
                where: { ProductId: null }
            })
            let addons = await this.upsertAssociation(product, db.Addon, req.body.product.addons)
            await product.setAddons(addons.map(addon => addon.id))
            await db.Addon.destroy({
                where: { ProductId: null }
            })

            let ingredients = await this.upsertAssociation(product, db.Ingredient, req.body.product.ingredients, true)
            await product.setIngredients(ingredients.map(ingredient => ingredient.id))

            product = await db.Product.findByPk(req.body.product.id, 
                {
                    include: [db.Variety, db.Addon, db.Ingredient]
                }
            );

            return product
        }
        catch (err) {
            return next(err)
        }
      }

      async upsertAssociation(product, model, data, hasMany = false) {
        let associatedInstances = await Promise.all(data.map(async values => {
            const [instance, created] = await model.upsert(hasMany ? {...values} : {
                ...values,
                ProductId: product.id
            }, {
                include: hasMany ? [db.Product] : []
            });

            return instance
        }))

        return associatedInstances
      }
}
