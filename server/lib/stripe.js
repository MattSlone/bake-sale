// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('sk_test_51KMDSaL7rHJy0SQF5Djaz08o3ohWMz4GHR6ULmdWnfAKPKBGGw6ng0aY0J7sAdyE38oPl3kSXy5ZFLja6ZaiXQUy005Glqz45I');
const endpointSecret = 'whsec_a0b9ca1aee5f89621e7798cb21daa56f9156be5a779e9e394d0d199e58d434ee'
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
      amount: totalAmount,
      currency: 'usd',
      payment_method_types: ['card'],
      transfer_group: orderId
    });
    return paymentIntent
  }

  async createTransfer(amount, stripeAccountId, chargeId)
  {
    try {
      const transfer = await stripe.transfers.create({
        amount: amount,
        currency: 'usd',
        destination: stripeAccountId,
        source_transaction: chargeId
      });
      return transfer.id
    } catch (err) {
      console.log(err)
    }
  }

  handleWebhooks(req, res, next) {
    let event = req.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(err)
      }
    }
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        return [event.type, paymentIntent]
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
        return [false, []]
    }
  }
}
