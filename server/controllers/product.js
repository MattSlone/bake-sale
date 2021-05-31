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
                processingTime: req.body.product.processingTime,
                description: req.body.product.description,
                automaticRenewal: req.body.product.automaticRenewal,
                inventory: req.body.product.inventory,
                personalizationPrompt: req.body.product.personalizationPrompt,
                Varieties: req.body.product.varieties,
                Addons: req.body.product.addons,
                Ingredients: ingredients,
                ShopId: req.body.shopId
              }, {
                include: [
                    db.Ingredient,
                    db.Variety,
                    db.Addon
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
                include: [db.Variety, db.Addon, db.Ingredient]
            });
            
            return products
        }
        catch(err) {
            return err
        }
    }

    async update (req, res, next) {
        try {

            let ingredients = []
            req.body.product.ingredients.forEach((name) => {
                ingredients.push({
                    name: name,
                    allergen: false
                })
            })

            const product = await db.Product.findByPk(req.body.id);
        
            if (product === null) {
                throw "Product not found!"
            }

            product.name = req.body.product.name,
            product.category = req.body.product.category,
            product.processingTime = req.body.product.processingTime,
            product.description = req.body.product.description,
            product.automaticRenewal = req.body.product.automaticRenewal,
            product.inventory = req.body.product.inventory,
            product.personalizationPrompt = req.body.product.personalizationPrompt,
            product.setVarieties(req.body.product.varieties)
            product.setAddons(req.body.product.addons)
            product.setIngredients(ingredients)
        
            await product.save();
            
            return product
        }
        catch (err) {
            return next(err)
        }
      }
}
