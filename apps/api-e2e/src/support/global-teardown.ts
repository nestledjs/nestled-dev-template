import type { ChildProcess } from 'node:child_process'

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  console.log(globalThis.__TEARDOWN_MESSAGE__ || '\n✨ Tearing down E2E tests...\n')

  // If we started the API server, stop it
  const weStartedApi = (globalThis as any).__WE_STARTED_API__
  const apiProcess = (globalThis as any).__API_PROCESS__ as ChildProcess | null

  if (weStartedApi && apiProcess?.pid) {
    console.log('🛑 Stopping API server aggressively...')
    try {
      // Skip gentle SIGTERM - go straight to SIGKILL for faster cleanup
      try {
        process.kill(-apiProcess.pid, 'SIGKILL')
        console.log(`   Killed process group -${apiProcess.pid}`)
      } catch {
        try {
          apiProcess.kill('SIGKILL')
          console.log(`   Killed process ${apiProcess.pid}`)
        } catch {
          console.log('   Process may already be dead')
        }
      }

      // Brief wait for kill to complete
      await new Promise(resolve => setTimeout(resolve, 100))

      console.log('✅ API server stopped')
    } catch (error) {
      console.warn('⚠️  Error stopping API server:', error)
      // Don't throw - we want tests to complete even if cleanup fails
    }
  } else if (!weStartedApi) {
    console.log('ℹ️  API server was already running - leaving it running')
  }

  console.log('✅ E2E test teardown complete')

  // Force exit after a brief delay if event loop is still active
  // This handles the case where there are lingering handles
  // DO NOT unref() - we WANT this to keep the process alive long enough to exit
  setTimeout(() => {
    console.log('⚡ Forcing process exit to clear remaining handles')
    process.exit(0)
  }, 500)
}
