// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('sk_test_51KMDSaL7rHJy0SQF5Djaz08o3ohWMz4GHR6ULmdWnfAKPKBGGw6ng0aY0J7sAdyE38oPl3kSXy5ZFLja6ZaiXQUy005Glqz45I');
const db = require('../models/index')

module.exports = class StripeAPI {
  async createAccount () {
    try {
      const account = await stripe.accounts.create({type: 'standard'});
      return account;
    } catch (err) {
      return err
    }    
  }

  async createAccountLink (account) {
    try {
      const accountLink = await stripe.accountLinks.create({
        account: account,
        refresh_url: 'http://localhost:3000/dashboard/shop/create/stripe/reauth',
        return_url: 'http://localhost:3000/dashboard/shop/create/stripe/return',
        type: 'account_onboarding',
      });
      return accountLink
    } catch (err) {
      return err
    }
  }

  async checkDetailsSubmitted (id) {
    try {
      const account = await stripe.accounts.retrieve(id)
      return account.details_submitted
    } catch (err) {
      return err
    }
  }

  async createPaymentIntent(orderId, totalAmount)
  {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000,
      currency: 'usd',
      payment_method_types: ['card'],
      transfer_group: orderId
    });
    return paymentIntent
  }

  async createTransfer(amount, stripeAccountId, orderId)
  {
    try {
      const transfer = await stripe.transfers.create({
        amount: 100,
        currency: 'usd',
        destination: stripeAccountId,
        transfer_group: orderId
      });
      console.log(transfer)
      return transfer.id
    } catch (err) {
      console.log(err)
    }
  }
}
