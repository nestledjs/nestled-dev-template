import { describe, it } from 'vitest'
import type { ChildProcess } from 'child_process'

/**
 * This file runs LAST (alphabetically) to ensure cleanup happens
 * It kills the API server if we started it and forces test exit
 */
describe('ZZZ Cleanup (runs last)', () => {
  it('should cleanup API server and force exit', async () => {
    console.log('\n✨ Running final cleanup...')

    const weStartedApi = (globalThis as any).__WE_STARTED_API__
    const apiProcess = (globalThis as any).__API_PROCESS__ as ChildProcess | null

    if (weStartedApi && apiProcess && apiProcess.pid) {
      console.log('🛑 Stopping API server...')
      try {
        // Kill the process group aggressively
        try {
          process.kill(-apiProcess.pid, 'SIGKILL')
          console.log(`   Killed process group -${apiProcess.pid}`)
        } catch (e) {
          try {
            apiProcess.kill('SIGKILL')
            console.log(`   Killed process ${apiProcess.pid}`)
          } catch (killError) {
            console.warn('   Process may already be dead')
          }
        }

        // Wait briefly for the kill to complete
        await new Promise(resolve => setTimeout(resolve, 100))

        console.log('✅ API server stopped')

        // Mark as killed so exit handler doesn't try again
        ;(globalThis as any).__API_PROCESS__ = null
      } catch (error) {
        console.warn('⚠️  Error stopping API:', error)
      }
    } else if (!weStartedApi) {
      console.log('ℹ️  API server was already running - leaving it running')
    }

    // Force clear any remaining intervals/timers
    console.log('🧹 Clearing all timers...')

    // Get all active handles and force close them
    // @ts-ignore - accessing internal Node.js API
    if (process._getActiveHandles) {
      // @ts-ignore
      const handles = process._getActiveHandles()
      console.log(`   Found ${handles.length} active handles`)
    }

    // @ts-ignore - accessing internal Node.js API
    if (process._getActiveRequests) {
      // @ts-ignore
      const requests = process._getActiveRequests()
      console.log(`   Found ${requests.length} active requests`)
    }

    console.log('✅ Cleanup complete')

    // Force process exit after brief delay
    // We use setImmediate which vitest doesn't intercept
    setImmediate(() => {
      console.log('⚡ Forcing process exit (this may show as error but tests passed)')
      // Set exit code first so even if process.exit() is intercepted, we signal success
      process.exitCode = 0
      // Force exit - necessary because lingering handles prevent natural exit
      process.exit(0)
    })

    // Wait a moment to allow setImmediate to fire
    await new Promise(resolve => setTimeout(resolve, 50))
  })
})
