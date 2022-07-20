'use strict'

const { query } = require('express');
const db = require('../models/index')
const { Op, fn, col} = require("sequelize");
const GMaps = require('../lib/gmaps');
const shop = require('../routes/shop');
const fsAsync = require('fs').promises
const fs = require("fs")
const validator = require('validator')

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
                weight: req.body.product.weight,
                personalizationPrompt: req.body.product.personalizationPrompt,
                Varieties: varieties,
                Addons: req.body.product.addons,
                ShopId: req.body.shopId,
                Form: {
                    name: req.body.product.formName,
                    Fields: req.body.product.fields
                },
              }, {
                include: [
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
            await this.updateProductIngredients(req.user.id, product, req.body.product.ingredients)
            return product
        }
        catch (err) {
            console.log(err)
        }
    }

    async getLocalShopIds(user) {
        try {
            const shops = await db.Shop.findAll({
                include: {
                    model: db.PickupAddress,
                    attributes: ['lat', 'lng', 'radius']
                }
            })
            const shopIds = await Promise.all(
                shops.map(async shop => {
                    const distance = await GMaps.haversine_distance(
                        { lat: user.lat, lng: user.lng },
                        { lat: shop.PickupAddress.lat, lng: shop.PickupAddress.lng }
                    )
                    if (distance < shop.PickupAddress.radius) {
                        return shop.id
                    }
                    return false
                }).filter(shop => shop !== false))
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
            const shop = await db.Shop.findByPk(product.ShopId, {
                include: {
                    model: db.PickupAddress,
                    attributes: ['lat', 'lng']
                }
            })
            if (product.custom) {
                quantity = 1
            }
            const variation = await db.Variety.findOne({ 
                where: {
                    ProductId: product.id,
                    quantity: quantity 
                }
            })
            const distance_meters = GMaps.haversine_distance(
                { lat: user.lat, lng: user.lng },
                { lat: shop.PickupAddress.lat, lng: shop.PickupAddress.lng }
            )
            const miles = GMaps.convertMetersToMiles(distance_meters)
            const fulfillmentPrice = variation.delivery * miles
            return fulfillmentPrice
        } catch (err) {
            console.log(err)
        }
    }

    async list(req, res, next) {
        try {
            const user = req.user ? await db.User.findByPk(req.user.id) : {}
            const shopIds = (user.id && !req.query.shop) ? await this.getLocalShopIds(user) : []
            const where = {
                ...(req.query.shop && {ShopId: req.query.shop}),
                ...(req.query.products && {id: req.query.products}),
                ...((user.id && !req.query.shop && req.query.delivers) && {ShopId: shopIds}),
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
            const user = req.user ? await db.User.findByPk(req.user.id) : {}
            const shopIds = (user.id && !req.query.shop) ? await this.getLocalShopIds(user) : []
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

    async updateProductIngredients(userId, product, ingredients) {
        const updateUserIngredients = (await Promise.all(ingredients.map(async newIngredient => {
            const ingredient = await db.Ingredient.findOne({
                where: { 
                    name: newIngredient.name
                },
                include: { model: db.Product, include: { model: db.Shop, include: {
                  model: db.User,
                  where: {
                      id: userId
                  },
                  required: true
                }}}
            })
            return ingredient ? ingredient : false
        }))).filter(ingredient => ingredient)
        let newIngredients = ingredients.filter(ingredient => {
            return !updateUserIngredients.map(ingredient => ingredient.name)
                .includes(ingredient.name)
        })
        newIngredients = await db.Ingredient.bulkCreate(newIngredients, { returning: true })
        await product.addIngredients(newIngredients.concat(updateUserIngredients))
        const deletedIngredients = await db.Ingredient.findAll({
            where: {
                name: {[Op.notIn]:newIngredients.concat(updateUserIngredients)
                    .map(ingredient => ingredient.name)}
            },
            include: {
                model: db.Product,
                where: { id: product.id }
            }
        })
        await product.removeIngredients(deletedIngredients)
    }

    async addImages(req, res, next) {
        try {
            const productImages = await db.ProductImage.bulkCreate(
                req.files.map(file => {
                    return {
                        name: file.originalname,
                        path: file.path,
                        ProductId: req.body.productId[0]
                    }
                }),
                {
                    returning: true
                }
            )
            const product = await db.Product.findOne({
                where: { id: req.body.productId },
                include: { model: db.Shop, include: {
                    model: db.User,
                    where: {
                        id: req.user.id
                    },
                    required: true
                }}
            })
            await product.setProductImages(productImages)
            await this.deleteImages()
        } catch (err) {
          console.log(err)
          req.flash('error', err)
          res.redirect('/api/product/error')
        }
    }

    async deleteImages() {
        try {
            const imagesToDelete = await db.ProductImage.findAll({ where: { ProductId: null } })
            await db.ProductImage.destroy({ where: { ProductId: null } })
            for (let image of imagesToDelete) {
              if (fs.existsSync(image.path)) {
                await fsAsync.unlink(image.path)
              }
            }
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
            include: [db.Variety, db.Addon, db.Ingredient, db.ProductImage]
          }
        )
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
        await this.updateProductIngredients(req.user.id, product, req.body.product.ingredients)
        product = await db.Product.findByPk(req.body.product.id, 
          {
            include: [db.Variety, db.Addon, db.Ingredient, db.ProductImage]
          }
        )
        return product
      }
      catch (err) {
          console.log(err)
      }
    }

    async updateInventoryOnSuccessfulOrder(productId, varietyId, quantity) {
      const product = await db.Product.findByPk(productId, {
        include: {
          model: db.Variety,
          where: { id: varietyId },
          limit: 1,
          required: true
        }
      })
      console.log('RIGHT HERREEEEE: ', product)
      product.inventory = product.inventory - product.Varieties[0].quantity * quantity
      await product.save()
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

    static async validateCreateOrEditProduct(req, res, next) {
      try {
        for (const field of [
          { name: 'Title', value: req.body.product.name, custom: true },
          { name: 'Description', value:req.body.product.description, custom: true },
          { name: 'Category', value: req.body.product.category, custom: true },
          { name: 'Processing Time', value: req.body.product.processingTime, custom: true },
          { name: 'Weight', value: req.body.product.weight, custom: false },
          { name: 'Inventory', value: req.body.product.inventory, custom: false }
        ]) {
          if (
            !field.value && 
            (!req.body.product.custom || (req.body.product.custom && field.custom))
          ) {
            console.log(`${field.name} is required.`)
            req.flash('error', `${field.name} is required.`)
            res.redirect('/api/product/error')
            return
          }
        }
        if (!validator.isByteLength(req.body.product.name, { max: 140 })) {
          req.flash('error', "Product names may have a maximum of 140 characters.")
          res.redirect('/api/product/error')
          return
        }
        if (!validator.isByteLength(req.body.product.description, { max: 2000 })) {
          req.flash('error', "Descriptions may have a maximum of 2000 characters.")
          res.redirect('/api/product/error')
          return
        }
        if (!req.body.product.custom && req.body.product.ingredients.length <= 0) {
          req.flash('error', "Products must have at least one ingredient.")
          res.redirect('/api/product/error')
          return
        }
        if (!req.body.product.custom && Number(req.body.product.inventory).toFixed(0) <= 0) {
          req.flash('error', "Inventory must be greater than 0.")
          res.redirect('/api/product/error')
          return
        }
        if (req.body.product.varieties.length <= 0
          || req.body.product.varieties.length > (req.body.product.custom ? 1 : 5)
        ) {
          const error = `Products must have at least one variety, \
            and a maximum of ${req.body.product.custom ? '1' : '5'}.`
          "Inventory must be greater than 0."
          req.flash('error', error)
          res.redirect('/api/product/error')
          return
        }
        if (!req.body.product.custom) {
          const validVarieties = await ProductController.validateVarieties(req.body.product.varieties)
          if (!validVarieties.success) {
            console.log(validVarieties.error)
            req.flash('error', validVarieties.error)
            res.redirect('/api/product/error')
            return
          }
        }
        if (!req.body.product.custom && req.body.product.addons.length > 5) {
          req.flash('error', "Products may have a maximum of 5 addons.")
          res.redirect('/api/product/error')
          return
        }
        if (!req.body.product.custom
          && !validator.isByteLength(req.body.product.personalizationPrompt, { max: 140 })
        ) {
          req.flash('error', "Personalization prompt may be a max of 140 characters.")
          res.redirect('/api/product/error')
          return
        }
        next()
      } catch (err) {
        req.flash('error', err)
        res.redirect('/api/product/error')
        return
      }
    }

    static async validateVarieties(varieties) {
      try {
        let rtn = { error: '', success: false }
        for (let variety of varieties) {
          for (const field of [
            { name: 'Quantity', value: variety.quantity },
            { name: 'Price', value:variety.price },
          ]) {
            if (!field.value) {
              rtn.error = `${field.name} is required for each product variation.`
              return rtn
            }
          }
          if (Number(variety.quantity).toFixed(0) < 1) {
            rtn.error = "Quantity must be greater than 0."
            return rtn
          } else if (Number(variety.quantity).toFixed(0) < 1) {
            rtn.error = "Product price must be at least $1.00"
            return rtn
          }
          rtn.success = true
          return rtn
        }
      } catch (err) {
        return { error: err, success: false}
      }
    }
}
