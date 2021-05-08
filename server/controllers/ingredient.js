'use strict'

const db = require('../models/index')

module.exports = class IngredientController {
    async create (req, res, next) {
        try {

            let ingredientsList = []
            req.body.ingredients.forEach((name) => {
                ingredientsList.push({
                    name: name,
                    allergen: false
                })
            })

            console.log('body', req.body)

            const ingredients = await db.Ingredient.bulkCreate(ingredientsList, { returning: true });
            return ingredients
        }
        catch (err) {
            return next(err)
        }
    }
}
