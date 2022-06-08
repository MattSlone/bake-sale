'use strict'

const db = require('../models/index'),
  Email = require('email-templates'),
  nodemailer = require('nodemailer')

module.exports = class QuoteController {
  async create (req, res, next) {
    try {
      const requestedStatus = await db.QuoteStatus.findOne({ where: { status: 'requested' } })
      const quote = await db.Quote.create({
        status: req.body.status,
        ProductId: req.body.productId,
        Values: req.body.values,
        UserId: req.user.id,
        QuoteStatusId: requestedStatus.id
      }, {
        include: [
          db.Product,
          db.Value
        ]
      })
      return quote
    }
    catch (err) {
      return next(err)
    }
  }

  async list(req, res, next) {
    try {
      const shop = await db.Shop.findOne({ where: { UserId: req.user.id } })
      const products = await db.Product.findAll({ where: { ShopId: shop.id } })
      const productIds = products.map(product => product.id)
      const where = {
        ...(productIds && {ProductId: productIds}),
        ...(req.query.product && {ProductId: req.query.product})
      }
      const quotes = await db.Quote.findAll({
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
          }
        ]
      });
      return quotes
    }
    catch(err) {
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
      let quote = await db.Quote.findByPk(req.body.QuoteId)
      const variety = await db.Variety.findOne({ where: { ProductId: quote.ProductId} })
      if (quote.UserId === req.user.id && quote.QuoteStatusId === requestedStatus.id) {
        variety.price = req.body.price
        quote.QuoteStatusId = quotedStatus.id
        await quote.save()
        await variety.save()
        this.sendQuotedEmail(quote)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async sendQuotedEmail (quote) {
    const user = await db.User.findByPk(quote.UserId)
    const product = await db.Product.findByPk(quote.ProductId)
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, // use SSL
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS
        }
      });
      const email = new Email({
        message: {
          from: process.env.EMAIL
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
          productName: product.name,
          id: quote.id
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
