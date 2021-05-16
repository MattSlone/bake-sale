'use strict'

const db = require('../models/index')

module.exports = class ProductController {
    async create (req, res, next) {
        try {

            let ingredients = []
            req.body.product.ingredients.forEach((name) => {
                ingredients.push({
                    name: name,
                    allergen: false
                })
            })

            const product = await db.Product.create({
                name: req.body.product.name,
                category: req.body.product.category,
                description: req.body.product.description,
                automaticRenewal: req.body.product.automaticRenewal,
                inventory: req.body.product.inventory,
                price: req.body.product.price,
                Ingredients: ingredients,
                ShopId: req.body.shopId
              }, {
                include: [db.Ingredient]
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
                }
            });
            
            return products
        }
        catch(err) {
            return err
        }
    }
}
