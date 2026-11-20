import { useEffect, useRef, useState } from 'react'
import { useRevalidator } from 'react-router'
import { ServiceUnavailable } from '@nestledjs/shared-components'
import { retryDelayMs } from '../api-availability'
import { RETRY_LABEL } from '../api-unavailable'

export const SESSION_UNKNOWN_TITLE = 'We couldn’t load your account'
export const SESSION_UNKNOWN_MESSAGE = 'You are still signed in. Retrying automatically.'

/**
 * Shown on a private page while the session verdict is `unknown` because the API answered with an
 * error or with no user (not an outage: the API is reachable, so there is nothing to probe). The
 * session is kept. It revalidates with backoff (2 s doubling to 30 s), which runs the session
 * middleware again, until the verdict is known; its button revalidates at once.
 */
export function SessionUnknownScreen() {
  const revalidator = useRevalidator()
  const revalidateRef = useRef(revalidator.revalidate)
  useEffect(() => {
    revalidateRef.current = revalidator.revalidate
  })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      setAttempt(current => current + 1)
      void revalidateRef.current()
    }, retryDelayMs(attempt))
    return () => clearTimeout(timer)
  }, [attempt])
  return (
    <ServiceUnavailable
      title={SESSION_UNKNOWN_TITLE}
      message={SESSION_UNKNOWN_MESSAGE}
      showRefreshButton={true}
      onRefresh={() => void revalidateRef.current()}
      refreshLabel={RETRY_LABEL}
    />
  )
}
