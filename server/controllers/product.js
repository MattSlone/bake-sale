'use strict'

const db = require('../models/index')

module.exports = class ProductController {
    async create (req, res, next) {
        try {

            const product = await db.Product.create({
                name: req.body.product.name,
                category: req.body.product.category,
                custom: req.body.product.custom,
                processingTime: req.body.product.processingTime,
                description: req.body.product.description,
                automaticRenewal: req.body.product.automaticRenewal,
                inventory: req.body.product.inventory,
                personalizationPrompt: req.body.product.personalizationPrompt,
                Varieties: req.body.product.varieties,
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

    async list(req, res, next) {
        try {
            const products = db.Product.findAll({
                where: {
                    ShopId: req.query.shop
                },
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
            return products
        }
        catch(err) {
            return err
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
