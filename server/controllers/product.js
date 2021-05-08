'use strict'

const db = require('../models/index')

module.exports = class ProductController {
    async create (req, res, next) {
        try {
            const product = await db.Product.create({
                name: req.body.name,
                category: req.body.category,
                description: req.body.description,
                automaticRenewal: req.body.automaticRenewal,
                stock: req.body.stock,
                price: req.body.price
            });
            return product
        }
        catch (err) {
            return next(err)
        }
    }
}
