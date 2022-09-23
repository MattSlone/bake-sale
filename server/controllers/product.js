'use strict'

const db = require('../models/index')
const { Op, fn, col} = require("sequelize");
const GMaps = require('../lib/gmaps');
const fsAsync = require('fs').promises
const fs = require("fs")
const validator = require('validator');
const { sequelize } = require('../models/index');

module.exports = class ProductController {
  async create (req, res, next) {
    try {
      const varieties = req.body.product?.custom ? { quantity: 1 } : req.body.product.varieties
      const product = await db.Product.create({
        name: req.body.product.name,
        published: false,
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
                  db.Constraint
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

  async getProductPrice(req) {
    const variation = await db.Variety.findOne({
      where: {
        ProductId: req.body.product.id,
        quantity: req.body.variation,
        deleted: false
      }
    })
    const productPrice = await this.calculateProductPrice(req, req.body, variation)
    const fulfillmentPrice = await this.calculateFulfillmentPrice(req, req.body, variation)
    const secondaryFulfillmentPrice = await this.calculateSecondaryFulfillmentPrice(req, req.body, variation)
    return {
      productPrice: productPrice,
      fulfillmentPrice: fulfillmentPrice,
      secondaryFulfillmentPrice: secondaryFulfillmentPrice
    }
  }

  async calculateSecondaryFulfillmentPrice(req, item, selectedVariation) {
    try {
      let secondaryFulfillmentPrice = 0.0
      if (item.fulfillment == 'delivery') {
        if (selectedVariation.deliveryFeeType == 'mile') {
          const shop = await db.Shop.findByPk(item.product.ShopId, {
            include: {
              model: db.PickupAddress,
              attributes: ['lat', 'lng']
            }
          })
          
          const shopLatLng = { lat: shop.PickupAddress.lat, lng: shop.PickupAddress.lng }
          let userLatLng = shopLatLng
          if (req.user) {
            userLatLng = { lat: req.user.lat, lng: req.user.lng }
          }
          const distance = GMaps.haversine_distance(
            userLatLng,
            shopLatLng
          )
          secondaryFulfillmentPrice = Number(selectedVariation.secondaryDelivery) * (distance * 0.000621371)
        } else {
          secondaryFulfillmentPrice = Number(selectedVariation.secondaryDelivery)
        }
      } else if(item.fulfillment == 'shipping') {
        secondaryFulfillmentPrice = Number(selectedVariation.secondaryShipping)
      }
      return secondaryFulfillmentPrice
    } catch (err) {
      console.log(err)
    }
  }
  
  async calculateAddonsPrice(item) {
    let addonsTotal = 0.0
    const addons = Object.entries(item.addons).map(addon => {
      return {
        id: addon[0],
        checked: addon[1]
      }
    })
    for (const addon of addons) {
      if(addon.checked) {
        let addonInstance = await db.Addon.findByPk(addon.id,
          {
            attributes: ['price', 'secondaryPrice', 'ProductId'],
            where: { deleted: false }
          }
        )
        if (addonInstance.ProductId != item.product.id) {
          throw Error('ERROR: addon doesn\'t exist for this product. Handle accordingly')
        }
        addonsTotal += Number(addonInstance.price)
        addonsTotal += Number(addonInstance.secondaryPrice) * Number(item.variation-1)
      }
    }
    console.log('ADDONS COST: ', addonsTotal)
    return addonsTotal
  }
  
  async calculateFulfillmentPrice(req, item, selectedVariation) {
    let fulfillmentPrice = 0.0
    if (item.fulfillment == 'delivery') {
      if (selectedVariation.deliveryFeeType == 'mile') {
        const shop = await db.Shop.findByPk(item.product.ShopId, {
          include: {
            model: db.PickupAddress,
            attributes: ['lat', 'lng']
          }
        })
        const shopLatLng = { lat: shop.PickupAddress.lat, lng: shop.PickupAddress.lng }
          let userLatLng = shopLatLng
          if (req.user) {
            userLatLng = { lat: req.user.lat, lng: req.user.lng }
          }
          const distance = GMaps.haversine_distance(
            userLatLng,
            shopLatLng
          )
        fulfillmentPrice = Number(selectedVariation.delivery) * (distance * 0.000621371)
      } else {
        fulfillmentPrice = Number(selectedVariation.delivery)
      }
    } else if(item.fulfillment == 'shipping') {
      fulfillmentPrice = Number(selectedVariation.shipping)
    }
    console.log('FULFILLMENT PRICE: ', fulfillmentPrice)
    return fulfillmentPrice
  }

  async calculateProductPrice(req, item, selectedVariation) {
    try {
      let total = 0
      if (item.product.custom) {
        const quote = await db.Quote.findOne({ where: { UserId: req.user.id, ProductId: item.product.id } })
        total = Number(quote.price)
      } else {
        total = Number(selectedVariation.price)
      }
      const addonsPrice = await this.calculateAddonsPrice(item)
      total += addonsPrice
      console.log('per product price: ', Number(total).toFixed(2))
      return total
    } catch (err) {
      console.log(err)
    }
  }

  async getLocalShopIds(user = null, miles = null, fulfillmentType = 'delivery') {
    try {
      const shops = await db.Shop.findAll({
        include: {
          model: db.PickupAddress,
          attributes: ['lat', 'lng', 'radius']
        },
        where: {
          ...fulfillmentType === 'pickup'
            && { allowPickups: true }
        }
      })
      const shopIds = await Promise.all(
        shops.map(async shop => {
          const distance = user ? await GMaps.haversine_distance(
            { lat: user.lat, lng: user.lng },
            { lat: shop.PickupAddress.lat, lng: shop.PickupAddress.lng }
          ) : GMaps.convertMilesToMeters(2892) // farthest distance across the US
          const filterMeters = miles ? GMaps.convertMilesToMeters(miles) : distance
          if (
            ((fulfillmentType === 'delivery' && distance < shop.PickupAddress.radius)
              || (true)
            ) && distance <= filterMeters
           ) {
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
              quantity: quantity ,
              deleted: false
            }
          })
          const distance_meters = GMaps.haversine_distance(
              { lat: user.lat, lng: user.lng },
              { lat: shop.PickupAddress.lat, lng: shop.PickupAddress.lng }
          )
          const miles = GMaps.convertMetersToMiles(distance_meters)
          const fulfillmentPrice = variation.delivery * miles
          return {
            cost: fulfillmentPrice,
            miles: miles
          }
      } catch (err) {
          console.log(err)
          throw Error(err)
      }
  }

  async buildWhereClause(req) {
    const user = req.user ? await db.User.findByPk(req.user.id) : null
    const ownShop = req.query.shop && user ? await db.Shop.findOne({ where: { id: req.query.shop, UserId: user.id } }) : false
    const shop = req.query.shopName ? await db.Shop.findOne({ where: { 
      uri: req.query.shopName
    }}) : false
    const shopIds = (!req.query.shop && !req.query.shopName)
      ? await this.getLocalShopIds(user, req.query.distance, req.query.fulfillment)
      : []
    const where = {
      /*** for shop owner: ***/
      // show their own products
      ...(req.query.shop && ownShop && { ShopId: req.query.shop }),
      /*** for buyers: ***/
      // only products that have inventory
      ...(!req.query.shop && {
        inventory: { [Op.gt]: 0 },
        published: true
      }),
      // shop page
      ...(req.query.shopName && shop && {
        inventory: { [Op.gt]: 0 },
        published: true,
        ShopId: shop.id
      }),
      // matches search string
      ...(req.query.search && { name: { [Op.like]: `%${req.query.search}%` } }),
      // specific category
      ...(req.query.category && { category: req.query.category }),
      /*** for both: ***/
      // if specific product(s)
      ...(req.query.products && { id: req.query.products }),
      /*** fulfillment filters ***/
      // Filter shop ids on fulfillment and distance
      ...((!req.query.shop && !req.query.shopName)
        && {
          ShopId: shopIds
        }
      ),
    }
    console.log(where)
    return where
  }

  async sortByPopular(id) {
    const numOrders = await db.Orders.count({
      where: {
        ProductId: id,
        OrderStatusId: 2 // completed
      }
    })
    return numOrders
  }

  async list(req, res, next) {
    try {
      const ownShop = req.query.shop && req.isAuthenticated() ? await db.Shop.findOne({ where: { id: req.query.shop, UserId: req.user.id } }) : false
      const shopPage = req.query.shopName ? await db.Shop.findOne({ where: { 
        uri: req.query.shopName
      }}) : false
      const where = await this.buildWhereClause(req)
      let offset = Number(req.query.lastId) ? Number(req.query.lastId) : 0
      const limit = 6
      const products = await db.Product.findAll({
          where: where,
          offset: offset,
          limit: (ownShop || shopPage) ? 100 : limit,
          attributes: [
            'id', 'name', 'published', 'category', 'custom', 'description',
            'processingTime', 'automaticRenewal', 'inventory', 'personalizationPrompt',
            'weight', 'ShopId',
            [sequelize.literal('(SELECT COUNT(*) FROM Orders WHERE Orders.ProductId = Product.id AND OrderStatusId = 2)'), 'OrderCount']
          ],
          include: [
              { model: db.Ingredient, as: 'ingredients' },
              {
                model: db.Variety,
                where: {
                  deleted: false,
                  ...req.query.fulfillment === 'delivery' &&
                    { delivery: { [Op.gt]: 0 } },
                  ...req.query.fulfillment === 'shipping' &&
                    { shipping: { [Op.gt]: 0 } }
                }
              },
              {
                model: db.Addon,
                where: { deleted: false },
                required: false
              },
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
              },
              {
                model: db.Shop,
                attributes: ['id', 'name', 'uri', 'allowPickups']
              }
          ],
          order: [[sequelize.literal('OrderCount'), 'DESC']]
      });
      return products
    }
    
    catch(err) {
      console.log('ERROR:', err)
      throw Error(err)
    }
  }

  async count(req, res, next) {
    try {
      const where = await this.buildWhereClause(req)
      const count = await db.Product.count({
        distinct: true,
        col: 'id',
        where: where,
        include: [
          {
            model: db.Variety,
            where: {
              deleted: false,
              ...req.query.fulfillment === 'delivery' &&
                { delivery: { [Op.gt]: 0 } },
              ...req.query.fulfillment === 'shipping' &&
                { shipping: { [Op.gt]: 0 } }
            }
          },
        ]
      });
      return count
    }
    catch(err) {
      console.log('ERROR:', err)
      return err
    }
  }

  async togglePublish(req, res) {
    try {
      const activeShopStatus = await db.ShopStatus.findOne({ where: { status: 'active' } })
      const product = await db.Product.findOne({
        where: { 
          id: req.query.productId
        },
        include: {
          model: db.Shop,
          where: {
            ShopStatusId: activeShopStatus.id
          },
          required: true,
          include: {
            model: db.User,
            where: {
              id: req.user.id
            },
            required: true
          }
        }
      })
      if (product) {
        product.published = !product.published
        await product.save()
      }
    } catch (err) {
      console.log(err)
      throw Error(err)
    }
  }

  async updateProductIngredients(userId, product, ingredients) {
      const updateUserIngredients = (await Promise.all(ingredients.map(async newIngredient => {
          const ingredient = await db.Ingredient.findOne({
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
                  where: {
                      id: userId
                  },
                  required: true
                }
              }
            }
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
              as: 'products',
              where: { id: product.id }
          }
      })
      await product.removeIngredients(deletedIngredients)
  }

  async upsertFieldAssociation(field, model, data, hasMany = false) {
    let associatedInstances = await Promise.all([].concat(data).map(async values => {
      console.log(values)
      const [instance, created] = await model.upsert(hasMany ? {...values} : {
        ...values,
        FieldId: field.id
      }, {
        include: hasMany ? [db.Field] : []
      });
      return instance
    }))
    return associatedInstances
  }

  async updateCustomProductFields(product, fields) {
    const updateCustomFields = (await Promise.all(fields.map(async newField => {
      const field = await db.Field.findOne({
        where: {
            name: newField.name,
            deleted: false
        },
        include: [
          {
            model: db.Form,
            include: {
              model: db.Product,
              where: {
                id: product.id
              },
              required: true
            }
          },
          db.Option,
          db.Constraint
        ]
      })
      if (field) {
        field.name = newField.name
        field.prompt = newField.prompt
        await field.save()
        let constraints = await this.upsertFieldAssociation(field, db.Constraint, newField.Constraints)
        await field.setConstraints(constraints.map(constraint => constraint.id))
        let options = await this.upsertFieldAssociation(field, db.Option, newField.Options)
        await field.setOptions(options.map(option => option.id))
      }
      return field ? field : false
    }))).filter(field => field)
    await db.Constraint.destroy({
      where: { FieldId: null }
    })
    await db.Option.destroy({
      where: { FieldId: null }
    })
    let newFields = fields.filter(field => {
      return !updateCustomFields.map(field => field.name).includes(field.name) && !field.deleted
    }).map(field => {
      return {
        ...field,
        FormId: product.Form.id
      }
    })
    await sequelize.transaction(async () => {
      for (let field of newFields) {
        await db.Field.create(field, {
          include: [db.Option, db.Constraint]
        })
      }
    })
    const deletedFields = await db.Field.findAll({
      where: {
        name: {[Op.notIn]:newFields.concat(updateCustomFields).map(field => field.name)},
        FormId: (product.Form ? product.Form.id : null)
      }
    })
    for (let field of deletedFields) {
      field.deleted = true
      await field.save()
    }
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
          include: [db.Variety, db.Addon, { model: db.Ingredient, as: 'ingredients' }, db.ProductImage, db.Form]
        }
      )
      let newVarieties = await this.upsertAssociation(product, db.Variety, req.body.product.varieties)
      let allVarieties = await db.Variety.findAll({
        where: { ProductId: product.id }
      })
      const deletedVarieties = allVarieties.filter(
        variety => !newVarieties.map(
          newVariety => newVariety.id
        ).includes(variety.id)
      )
      for (let variety of deletedVarieties) {
        variety.deleted = true
        await variety.save()
      }

      let newAddons = await this.upsertAssociation(product, db.Addon, req.body.product.addons)
      let allAddons = await db.Addon.findAll({
        where: { ProductId: product.id }
      })
      const deletedAddons = allAddons.filter(
        addon => !newAddons.map(
          newAddon => newAddon.id
        ).includes(addon.id)
      )
      for (let addon of deletedAddons) {
        addon.deleted = true
        await addon.save()
      }

      await this.updateProductIngredients(req.user.id, product, req.body.product.ingredients)
      if (product.custom) {
        await this.updateCustomProductFields(product, req.body.product.fields)
      }
      product = await db.Product.findByPk(req.body.product.id, 
        {
          include: [
            { model: db.Variety, where: { deleted: false } },
            { model: db.Addon, where: { deleted: false }, required: false },
            { model: db.Ingredient, as: 'ingredients' },
            db.ProductImage]
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
    if (!product.custom) {
      product.inventory = product.inventory - product.Varieties[0].quantity * quantity
      await product.save()
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
        const validVarieties = await ProductController.validateVarieties(req.body.product.varieties, req.user.id)
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

  static async validateVarieties(varieties, userId) {
    try {
      let rtn = { error: '', success: false }
      const shop = await db.Shop.findOne({
        where: { UserId: userId }
      })
      const deliverySchedule = await db.DeliverySchedule.findOne({
        where: { ShopId: shop.id } ,
        attributes: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      })
      const deliveryDays = Object.keys(deliverySchedule.dataValues).filter(day => deliverySchedule.dataValues[day])
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
        console.log(deliveryDays)
        if (variety.delivery && variety.delivery > 0 && deliveryDays.length < 1) {
          rtn.error = "You cannot offer delivery without setting a delivery schedule for you shop."
          return rtn
        }
        rtn.success = true
        return rtn
      }
    } catch (err) {
      return { error: err.message, success: false}
    }
  }
}
