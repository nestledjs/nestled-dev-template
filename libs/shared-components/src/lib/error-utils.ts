import {
  isNetworkError as sharedIsNetworkError,
  isViteCacheError as sharedIsViteCacheError,
} from '@nestled-template/shared/utils'

/**
 * These wrap the shared implementations rather than re-exporting them, so that the emitted
 * declaration carries a LOCAL signature.
 *
 * A bare `export { x } from '@nestled-template/shared/utils'` makes the generated
 * `error-utils.d.ts` point outside the published package -- the workspace alias does not exist
 * for a consumer installing from npm, and the relative form resolves above the package root.
 * 1.0.16 shipped exactly that and broke consumers at module load. The runtime implementation
 * stays single-sourced; only the type surface is restated here.
 */

/**
 * Detects if an error is caused by Vite development cache issues.
 * This typically happens when the browser cache gets out of sync with the Vite dev server.
 */
export function isViteCacheError(error: Error | unknown): boolean {
  return sharedIsViteCacheError(error)
}

/** Detects if an error is network-related (for API/Apollo errors). */
export function isNetworkError(error: Error | unknown): boolean {
  return sharedIsNetworkError(error)
}
