import { waitForPortOpen } from '@nx/node/utils'
import { execSync } from 'child_process'

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\n🚀 Setting up E2E tests...\n')

  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://justinhandley@localhost:5432/nestled_template_test'

  console.log(`📊 Using test database: ${process.env.DATABASE_URL}`)

  // Use the workspace root which should be the current working directory
  const projectRoot = process.cwd()

  // Ensure database schema is up to date
  console.log('🔄 Syncing database schema...')
  try {
    execSync('pnpm prisma db push --skip-generate', {
      cwd: projectRoot,
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'inherit'
    })
    console.log('✅ Database schema synced')
  } catch (error) {
    console.error('❌ Failed to sync database schema')
    throw error
  }

  // Seed database with required data (permissions, countries, etc.)
  console.log('🌱 Seeding test database...')
  try {
    execSync('pnpm prisma:seed', {
      cwd: projectRoot,
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'inherit'
    })
    console.log('✅ Database seeded')
  } catch (error) {
    console.error('❌ Failed to seed database')
    throw error
  }

  // Wait for API to be ready
  const host = process.env.HOST ?? 'localhost'
  const port = process.env.PORT ? Number(process.env.PORT) : 3000
  console.log(`⏳ Waiting for API to be ready at ${host}:${port}...`)

  try {
    await waitForPortOpen(port, { host, timeout: 5000 })
    console.log('✅ API is ready!')
  } catch (error) {
    console.error(`❌ API is not running on ${host}:${port}`)
    console.error('Please start the API server with: pnpm nx serve api')
    throw error
  }

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\n✨ Tearing down E2E tests...\n'
}
