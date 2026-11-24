import { type ReactNode, useLayoutEffect } from 'react'
import {
  clearActiveOrganizationForSessionChange,
  isLeavingForSessionChange,
} from '@nestled-template/shared/apollo'
import type { AppSessionVerdict } from './session-context'

// The last user this document rendered signed in. Browser only, and module-level on purpose: it
// lives exactly as long as the document (and the Apollo cache, which holds that user's data), and a
// signed-out verdict in between, or the root ErrorBoundary replacing App, does not reset it.
let lastSignedInUserId: string | undefined
// Set with the one reload this document makes; nothing clears it.
let reloading = false
// Only while a document load for another session is already on its way (`isLeavingForSessionChange`).
let leavingTimer: ReturnType<typeof setTimeout> | undefined

/** How long a document load already on its way has before this document is loaded instead. */
export const LEAVING_GRACE_MS = 10_000

/** For specs: forget the document's user, as a document load does. */
export function __resetSessionUserGuard(): void {
  lastSignedInUserId = undefined
  reloading = false
  clearTimeout(leavingTimer)
  leavingTimer = undefined
}

function reloadDocumentOnce(): void {
  if (reloading) return
  reloading = true
  // The stored organization is the previous user's too.
  clearActiveOrganizationForSessionChange()
  globalThis.location.reload()
}

function belongsToAnotherUser(userId: string | undefined): boolean {
  return (
    globalThis.window !== undefined &&
    userId !== undefined &&
    lastSignedInUserId !== undefined &&
    lastSignedInUserId !== userId
  )
}

/**
 * Wraps the whole page (root.tsx Layout). When the server judges this document signed in as another
 * user than it last rendered (another tab signed in as someone else, so the cookie changed under
 * this one), the Apollo cache and every mounted component still hold the previous user's data.
 * Nothing of it may render for the new session: `children` are not rendered, and the document is
 * loaded again, once, which starts clean. The new document's first user is its own, so it cannot
 * loop. The same user changes nothing, and a signed-out or unknown verdict is ignored.
 *
 * A document already leaving for another session (a sign-in, an emulation starting or ending) is
 * not loaded a second time: that would replace the navigation on its way. Only if that navigation
 * never happens (the user stopped it) is the document loaded after `LEAVING_GRACE_MS`, so the page
 * cannot stay blank.
 */
export function SessionUserGuard({
  session,
  children,
}: Readonly<{ session: AppSessionVerdict | undefined; children: ReactNode }>) {
  const userId = session?.kind === 'signed-in' ? session.user.id : undefined
  const blocked = reloading || belongsToAnotherUser(userId)
  useLayoutEffect(() => {
    if (userId === undefined || reloading) return
    if (!belongsToAnotherUser(userId)) {
      lastSignedInUserId = userId
      return
    }
    if (isLeavingForSessionChange()) {
      leavingTimer ??= setTimeout(reloadDocumentOnce, LEAVING_GRACE_MS)
    } else {
      reloadDocumentOnce()
    }
  }, [userId])
  return blocked ? null : children
}
