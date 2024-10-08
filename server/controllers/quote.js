'use strict'

const db = require('../models/index'),
  Email = require('email-templates'),
  nodemailer = require('nodemailer'),
  env = require('../config/environment')
const ProductController = require('./product')

module.exports = class QuoteController {
  async create (req, res, next) {
    try {
      // handle deleted and multiselect fields
      let values = await Promise.all(req.body.values.map(async fieldValue => {
        const field = await db.Field.findByPk(fieldValue.FieldId)
        if (field.deleted) {
          return false
        }
        if(Array.isArray(fieldValue.value)) {
          // multiselect field
          return fieldValue.value.map(value => {
            return { FieldId: fieldValue.FieldId, value: value }
          })
        }
        return fieldValue
      }))
      values = values.filter(value => value).flat()
      const requestedStatus = await db.QuoteStatus.findOne({ where: { status: 'requested' } })
      const quote = await db.Quote.create({
        status: req.body.status,
        ProductId: req.body.productId,
        fulfillment: req.body.fulfillment,
        Values: values,
        UserId: req.user.id,
        QuoteStatusId: requestedStatus.id
      }, {
        include: [
          db.Product,
          db.Value
        ]
      })
      await this.sendQuoteRequestEmail(quote)
      return quote
    }
    catch (err) {
      return next(err)
    }
  }

  async sendQuoteRequestEmail(quote) {
    const product = await db.Product.findOne({
      where: { id: quote.ProductId },
      include: [
        {
          model: db.Shop,
          include: [ db.User ]
        }
      ]
    })
    const user = await db.User.findByPk(quote.UserId)
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net',
        port: 465,
        secure: true,
        secureConnection: false,
        requireTLS: true,
        tls: {
          ciphers: 'SSLv3'
        },
        debug: true,
        auth: {
          user: env.email,
          pass: env.emailPass
        }
      });
      const email = new Email({
        message: {
          from: env.email
        },
        // uncomment below to send emails in development/test env:
        send: true,
        transport: transporter
      });
      
      await email.send({
        template: 'newQuoteRequest',
        message: {
          to: product.Shop.User.username
        },
        locals: {
          name: product.Shop.User.firstName,
          productName: product.name,
          id: quote.id,
          baseUrl: env.baseUrl,
          port: env.port
        }
      })

      await email.send({
        template: 'requestConfirmation',
        message: {
          to: user.username
        },
        locals: {
          name: user.firstName,
          productName: product.name,
          baseUrl: env.baseUrl,
          port: env.port
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  async list(req, res, next) {
    try {
      let quotes = [];
      if (!(req.query.forShop || req.query.forUser)) {
        return quotes
      }
      const shop = await db.Shop.findOne({ where: { UserId: req.user.id } })
      if (req.query.forShop) {
        if (!shop) {
          return quotes
        }
        if (req.query.id) {
          const quote = await db.Quote.findOne({
             where: { id: req.query.id },
             include: {
              model: db.Product,
              include: {
                model: db.Shop,
                where: {
                  id: shop.id
                },
                required: true
              }
             }
          })
          if (!quote) {
            return quotes
          }
        }
      }
      if (req.query.forUser && req.query.product) {
        const quote = db.Quote.findOne({ where: { ProductId: req.query.product, UserId: req.user.id } })
        if (!quote) {
          return quotes
        }
      }
      const products = shop ? await db.Product.findAll({ where: { ShopId: shop.id } }) : []
      const productIds = products.map(product => product.id)
      const where = {
        ...(!req.query.id && productIds && {ProductId: productIds}),
        ...(req.query.id && { id: req.query.id }),
        ...(req.query.product && {ProductId: req.query.product})
      }
      quotes = await db.Quote.findAll({
        where: where,
        include: [
          {
            model: db.Product,
            include: {
              model: db.Variety
            }
          },
          {
            model: db.Value,
            include: {
              model: db.Field
            }
          },
          {
            model: db.User,
            attributes: [
              'firstName',
              'lastName',
              'username'
            ]
          },
        ]
      });
      return quotes
    }
    catch(err) {
        console.log(err)
        return err
    }
  }

  /**
   * Updates instance of Quote. Only updates instance if UserId matches the logged in user
   * @param {*} req Request object
   * @param {*} res 
   * @param {*} next 
   * @returns {void} void
   */
  async update (req, res, next) {
    try {
      let quote = await db.Quote.update(req.body.quote,
        {
          where: {
            id: req.body.quote.id
          }
        }
      );
      return quote
    }
    catch (err) {
        return next(err)
    }
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  async updatePrice(req, res, next) {
    try {
      const requestedStatus = await db.QuoteStatus.findOne({ where: { status: 'requested' } })
      const quotedStatus = await db.QuoteStatus.findOne({ where: { status: 'quoted' } })
      let quote = await db.Quote.findByPk(req.body.QuoteId, {
        include: {
          model: db.Product,
          include: {
            model: db.Shop
          }
        }
      })
      if (quote.Product.Shop.UserId === req.user.id && quote.QuoteStatusId === requestedStatus.id) {
        quote.price = req.body.price
        console.log(req.body.price, quote.price)
        quote.QuoteStatusId = quotedStatus.id
        await quote.save()
        this.sendQuotedEmail(quote)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async sendQuotedEmail (quote) {
    const user = await db.User.findByPk(quote.UserId)
    const product = await db.Product.findByPk(quote.ProductId)
    const item = {
      ...quote,
      product: product
    }
    // TODO need to cleanup calculate methods to not require req object
    const placeHolderReq = {
      user: user
    }
    const selectedVariation = await db.Variety.findOne({ where: { ProductId: quote.ProductId } })
    const fulfillmentPrice = await (new ProductController).calculateFulfillmentPrice(req, item, selectedVariation )
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net',
        port: 465,
        secure: true,
        secureConnection: false,
        requireTLS: true,
        tls: {
          ciphers: 'SSLv3'
        },
        debug: true,
        auth: {
          user: env.email,
          pass: env.emailPass
        }
      });
      const email = new Email({
        message: {
          from: env.email
        },
        // uncomment below to send emails in development/test env:
        send: true,
        transport: transporter
      });
      
      await email.send({
        template: 'quoted',
        message: {
          to: user.email
        },
        locals: {
          name: user.firstName,
          price: Number(quote.price).toFixed(2),
          fulfillmentType: quote.fulfillment,
          fulfillmentPrice: fulfillmentPrice,
          productName: product.name,
          id: quote.id,
          baseUrl: env.baseUrl,
          port: env.port
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  async upsertAssociation(quote, model, data, hasMany = false) {
    let associatedInstances = await Promise.all(data.map(async values => {
      const [instance, created] = await model.upsert(hasMany ? {...values} : {
        ...values,
        QuoteId: quote.id
      }, {
        include: hasMany ? [db.Quote] : []
      });
      return instance
    }))

    return associatedInstances
  }
}
