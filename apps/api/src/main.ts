import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestled-template/api/config'
import cookieParser from 'cookie-parser'
import { graphqlUploadExpress } from 'graphql-upload-minimal'
import * as express from 'express'
import * as path from 'path'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableShutdownHooks()

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // Allow fields without decorators (for generated DTOs)
      forbidNonWhitelisted: false,
      transform: true,
      skipMissingProperties: false, // Validate even if properties are present but empty
      forbidUnknownValues: false,
    })
  )

  const configService = app.get(ConfigService)

  // Get individual properties with fallbacks
  const prefix = configService.prefix || 'api'
  const port = configService.port || 3000
  const host = configService.host || 'localhost'

  app.setGlobalPrefix(prefix)

  // Use the apiCorsOrigins getter and handle as arrayq
  const origins = configService.apiCorsOrigins.length
    ? configService.apiCorsOrigins
    : ['http://localhost:4200']

  // Add this logging
  console.log('🔍 CORS Debug Info:')
  console.log('- ALLOWED_ORIGINS env var:', process.env['ALLOWED_ORIGINS'])
  console.log('- configService.apiCorsOrigins:', configService.apiCorsOrigins)
  console.log('- Final origins array:', origins)
  console.log('- Origins length:', origins.length)

  console.log('🍪 Cookie Debug Info:')
  console.log('- API_COOKIE_NAME:', process.env['API_COOKIE_NAME'])
  console.log('- API_COOKIE_DOMAIN:', process.env['API_COOKIE_DOMAIN'])
  console.log('- NODE_ENV:', process.env['NODE_ENV'])
  console.log('- Cookie config:', configService.cookie)

  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (origins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
  })
  app.use(cookieParser(configService.cookie.secret || 'secret'))

  // Serve uploaded files from local storage
  const uploadsPath = configService.config.get<string>('LOCAL_STORAGE_PATH') || './uploads'
  app.use('/uploads', express.static(path.resolve(uploadsPath)))
  Logger.log(`📁 Serving static files from: ${path.resolve(uploadsPath)}`)

  // Configure graphql-upload middleware to handle multipart requests
  app.use('/graphql', graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))

  await app.listen(port, host, () => {
    Logger.log(`Listening at http://${host}:${port}/${prefix}`)
    Logger.log(`Listening at http://${host}:${port}/graphql`)
  })
}

bootstrap().catch(error => {
  Logger.error('Failed to start the application', error)
  process.exit(1)
})

// Graceful shutdown for local dev restarts
process.once('SIGINT', async () => {
  try {
    await (global as any).prisma?.$disconnect?.()
  } finally {
    process.exit(0)
  }
})
process.once('SIGTERM', async () => {
  try {
    await (global as any).prisma?.$disconnect?.()
  } finally {
    process.exit(0)
  }
})
