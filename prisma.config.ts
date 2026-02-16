import 'dotenv/config'
import * as path from 'node:path'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: path.join('libs', 'api', 'prisma', 'src', 'lib', 'schemas'),
  migrations: {
    path: path.join('libs', 'api', 'prisma', 'src', 'lib', 'migrations'),
    seed: 'tsx libs/api/prisma/src/lib/seed/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
