export const configuration = () => ({
  prefix: 'api',
  environment: process.env['NODE_ENV'],
  host: process.env['HOST'] ?? '0.0.0.0',
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  apiUrl: process.env['API_URL'],
  api: {
    cookie: {
      name: process.env['API_COOKIE_NAME'],
      secret: process.env['API_COOKIE_SECRET'] ?? 'secret',
      options: {
        // Only set cookie domain if it is a valid registrable domain. Avoid 'localhost' or IPs.
        ...(() => {
          const dom = (process.env['API_COOKIE_DOMAIN'] ?? '').trim()
          if (!dom || dom === 'localhost' || dom === '127.0.0.1' || dom === '[::1]') {
            return {}
          }
          return { domain: dom }
        })(),
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax',
        path: '/',
      },
    },
    cors: {
      origin: (process.env['ALLOWED_ORIGINS'] ?? '').split(','),
    },
  },
  siteUrl: process.env['SITE_URL'] ?? process.env['API_URL']?.replace('/api', ''),
  app: {
    email: process.env['APP_EMAIL'],
    supportEmail: process.env['APP_SUPPORT_EMAIL'],
    adminEmails: process.env['APP_ADMIN_EMAILS'],
    name: process.env['APP_NAME'],
  },
  smtp: {
    host: process.env['SMTP_HOST'],
    port: process.env['SMTP_PORT'],
    user: process.env['SMTP_USER'],
    pass: process.env['SMTP_PASS'],
  },
})
