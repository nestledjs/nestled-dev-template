import * as Joi from 'joi'

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  HOST: Joi.string().alphanum().default('localhost'),
  PORT: Joi.number().default(3000),
  WEB_PORT: Joi.number().default(4200),
  WEB_URL: Joi.string().default(
    `http://${process.env['HOST'] || 'localhost'}:${process.env['WEB_PORT']}`,
  ),
  // Important: Do NOT default to 'localhost' — setting domain=localhost breaks cookies in browsers
  // Leave empty by default so the cookie domain is omitted for local development
  API_COOKIE_DOMAIN: Joi.string().allow('').default(''),
  API_COOKIE_NAME: Joi.string().default('__session_biz'),
  API_URL: Joi.string().default(
    `http://${process.env['HOST'] || 'localhost'}:${process.env['PORT']}/api`,
  ),
  APP_NAME: Joi.string().required(),
  APP_EMAIL: Joi.string().email().required(),
  APP_SUPPORT_EMAIL: Joi.string().email().required(),
  APP_ADMIN_EMAILS: Joi.string().required(),
  SITE_URL: Joi.string().uri().required(),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.string().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
})
