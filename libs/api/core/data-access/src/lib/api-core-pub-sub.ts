import { Logger } from '@nestjs/common'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { PubSub } from 'graphql-subscriptions'
import Redis, { RedisOptions } from 'ioredis'

// Railway provides REDIS_URL (private) and REDIS_PASSWORD separately
// Also support REDIS_TLS_URL for Heroku-style configs
const REDIS_URL = process.env['REDIS_TLS_URL'] ?? process.env['REDIS_URL'] ?? ''
const REDIS_PASSWORD = process.env['REDIS_PASSWORD'] ?? ''

// Check if we have a valid Redis URL (proper protocol, not localhost)
const hasValidRedisUrl =
  typeof REDIS_URL === 'string' &&
  (REDIS_URL.startsWith('redis://') || REDIS_URL.startsWith('rediss://')) &&
  !REDIS_URL.includes('localhost') &&
  REDIS_URL.trim().length > 0
const secure = REDIS_URL ? /rediss:/.test(REDIS_URL) : false

if (hasValidRedisUrl) {
  // Use non-greedy quantifier to prevent ReDoS vulnerability
  Logger.log(`Redis: Connecting to ${REDIS_URL.replace(/\/\/[^@]*@/, '//<redacted>@')} (password: ${REDIS_PASSWORD ? 'provided' : 'none'})`)
} else {
  Logger.warn('Redis: No valid URL. Using in-memory PubSub (subscriptions will not work across instances).')
}

const dateReviver = (_key: unknown, value: string | Date): Date => {
  const isISO8601Z = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/
  if (typeof value === 'string' && isISO8601Z.test(value)) {
    const tempDateNumber = Date.parse(value)
    if (!isNaN(tempDateNumber)) {
      return new Date(tempDateNumber)
    }
  }
  if (typeof value !== 'string') return value
  return new Date(value)
}

function createPubSub(): RedisPubSub | PubSub {
  // Fallback to in-memory PubSub for local dev or when Redis is not configured
  if (!hasValidRedisUrl) {
    return new PubSub()
  }

  const options: RedisOptions = {
    // Railway provides password separately, not embedded in URL
    ...(REDIS_PASSWORD && { password: REDIS_PASSWORD }),
    // TLS for secure connections (rediss://)
    ...(secure && {
      tls: {
        rejectUnauthorized: false,
      },
    }),
    // Retry strategy to prevent infinite loops
    retryStrategy: (times: number) => {
      if (times > 3) {
        Logger.error(`Redis: Failed to connect after ${times} attempts, giving up`)
        return null // Stop retrying
      }
      const delay = Math.min(times * 1000, 3000)
      Logger.warn(`Redis: Connection attempt ${times}, retrying in ${delay}ms...`)
      return delay
    },
    maxRetriesPerRequest: 3,
    // Lazy connect prevents startup crash if Redis is temporarily unavailable
    lazyConnect: true,
  }

  const publisher = new Redis(REDIS_URL, options)
  const subscriber = new Redis(REDIS_URL, options)

  // Log connection events
  publisher.on('connect', () => Logger.log('Redis publisher: connected'))
  publisher.on('error', (err) => Logger.error(`Redis publisher error: ${err.message}`))
  publisher.on('close', () => Logger.warn('Redis publisher: connection closed'))

  subscriber.on('connect', () => Logger.log('Redis subscriber: connected'))
  subscriber.on('error', (err) => Logger.error(`Redis subscriber error: ${err.message}`))
  subscriber.on('close', () => Logger.warn('Redis subscriber: connection closed'))

  return new RedisPubSub({
    publisher,
    subscriber,
    reviver: dateReviver,
  })
}

export const apiCorePubSub = createPubSub()
