import { waitForPortOpen } from '@nx/node/utils'
import { execSync } from 'child_process'

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up E2E tests...\n')

  // Set up test database
  console.log('Setting up test database...')
  
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/nestled_template_test'
  
  try {
    // Reset database schema and seed with test data
    execSync('pnpm prisma migrate deploy', { stdio: 'inherit' })
    execSync('pnpm prisma generate', { stdio: 'inherit' })
    console.log('Database setup complete')
  } catch (error) {
    console.error('Database setup failed:', error)
    throw error
  }

  // Wait for API to be ready
  const host = process.env.HOST ?? 'localhost'
  const port = process.env.PORT ? Number(process.env.PORT) : 3000
  console.log(`Waiting for API to be ready at ${host}:${port}...`)
  await waitForPortOpen(port, { host })
  console.log('API is ready!')

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down E2E tests...\n'
}
