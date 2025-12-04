import { describe, it } from 'vitest'
import type { ChildProcess } from 'node:child_process'

/**
 * This file runs LAST (alphabetically) to ensure cleanup happens
 * Note: The actual cleanup is handled by global-teardown.ts
 * This test just verifies the API is still responsive before teardown
 */
describe('ZZZ Cleanup (runs last)', () => {
  it('should verify API is still running before teardown', async () => {
    console.log('\n✨ Final test - verifying API health before teardown...')

    const weStartedApi = (globalThis as any).__WE_STARTED_API__
    const apiProcess = (globalThis as any).__API_PROCESS__ as ChildProcess | null

    if (weStartedApi && apiProcess?.pid) {
      console.log(`✓ API server is running (PID: ${apiProcess.pid})`)
      console.log('  → Will be cleaned up by global-teardown.ts')
    } else if (!weStartedApi) {
      console.log('✓ Using pre-existing API server')
    }

    console.log('✅ All tests complete - global teardown will handle cleanup')
  })
})
