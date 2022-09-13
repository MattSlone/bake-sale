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

            const ingredients = await db.Ingredient.bulkCreate(ingredientsList, { returning: true });
            return ingredients
        }
        catch (err) {
            return next(err)
        }
    }

    async update(req, res) {
        for (let newIngredient of req.body.ingredients) {
            const ingredients = await db.Ingredient.findAll({
                where: { 
                    name: newIngredient.name
                },
                include: {
                    model: db.Product,
                    as: 'products',
                    include: {
                        model: db.Shop,
                        include: {
                            model: db.User,
                            required: true,
                            where: {
                                id: req.user.id
                            }
                        }
                    }
                }
            })
            for (let ingredient of ingredients) {
                ingredient.allergen = newIngredient.allergen
                await ingredient.save()
            }
        }    
    }
  
  async list(req) {
    try {
      const where = req.query.search ? { name: { [Op.like]: `%${req.query.search}%` } } : null
      const include = {
        model: db.Product,
        as: 'products',
        ...req.query.productId && { where: { id: req.body.productId } }
      }
      let ingredients = await db.Ingredient.findAll({
        where: where,
        include: include,
        attributes: ['name', 'allergen']
      })
      ingredients = await Promise.all(ingredients.map(async ingredient => {
        const validProducts = await Promise.all(ingredient.products.map(async product => {
          const validShop = await db.Shop.findOne({
            where: { id: product.ShopId },
            include: {
              model: db.User,
              where: { id: req.user.id }
            }
          })
          return !!validShop
        }))
        return validProducts.some(product => !!product) ? ingredient : false
      }))
      return ingredients.filter(ingredient => !!ingredient)
    } catch (err) {
      req.flash('error', err.message)
      return false
    }
  }
}
