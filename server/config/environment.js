require('dotenv').config()

module.exports = {
  port: process.env.PORT,
  expressPort: process.env.EXPRESS_PORT,
  stripeWebhookPort: process.env.STRIPE_WEBHOOK_PORT,
  db: {
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  },
  stripe: {
    api_key: process.env.STRIPE_API_KEY,
    webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
  },
  nodeEnv: process.env.NODE_ENV,
  baseUrl: process.env.BASE_URL,
  email: process.env.EMAIL,
  emailPass: process.env.EMAIL_PASS,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  gmapsKey: process.env.GMAPS_KEY,
  positionStackAPIKey: process.env.POSITION_STACK_API_KEY,
  recaptchaSecret: process.env.RECAPTCHA_SECRET
}