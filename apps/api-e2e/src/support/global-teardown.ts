import { killPort } from '@nx/node/utils'
import { execSync } from 'child_process'

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  console.log(globalThis.__TEARDOWN_MESSAGE__)
  
  // Clean up test database
  if (process.env.NODE_ENV === 'test') {
    try {
      console.log('Cleaning up test database...')
      // Reset database state for next test run
      execSync('pnpm prisma migrate reset --force --skip-seed', { stdio: 'inherit' })
      console.log('Test database cleanup complete')
    } catch (error) {
      console.error('Test database cleanup failed:', error)
      // Don't throw - we want tests to complete even if cleanup fails
    }
  }
  
  const port = process.env.PORT ? Number(process.env.PORT) : 3000
  await killPort(port)
}
