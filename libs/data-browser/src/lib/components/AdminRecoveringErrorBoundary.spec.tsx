import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminDataProvider } from '../context/AdminDataContext'
import {
  ADMIN_API_UNAVAILABLE_COPY,
  ADMIN_OFFLINE_MESSAGE,
  ADMIN_OFFLINE_TITLE,
  ADMIN_SERVER_DOWN_MESSAGE,
  ADMIN_SERVER_DOWN_TITLE,
  ADMIN_SERVER_TROUBLE_MESSAGE,
  ADMIN_SERVER_TROUBLE_TITLE,
  AdminApiUnavailable,
  AdminRouteErrorBoundary,
  normalizeAdminProbeResult,
  probeAdminConnectivity,
  resetAdminRecoveryBackoff,
} from './AdminRecoveringErrorBoundary'

const revalidate = vi.fn()

vi.mock('react-router', () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useRevalidator: () => ({ revalidate, state: 'idle' }),
}))

vi.mock('@nestledjs/shared-components', () => ({
  ErrorBoundary: ({ error }: any) => <div>Static boundary: {error.message}</div>,
  isNetworkError: (error: any) => /failed to fetch/i.test(error?.message ?? ''),
}))

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}

function setOnline(online: boolean) {
  Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => online })
}

describe('AdminRouteErrorBoundary', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    revalidate.mockReset()
    resetAdminRecoveryBackoff()
    setOnline(true)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    setOnline(true)
  })

  it('leaves a non-network error to the shared ErrorBoundary', () => {
    render(<AdminRouteErrorBoundary error={new Error('Boom')} />)
    expect(screen.getByText('Static boundary: Boom')).toBeInTheDocument()
  })

  it('shows the recovering panel for a network error', () => {
    render(<AdminRouteErrorBoundary error={new TypeError('Failed to fetch')} probe={vi.fn()} />)
    expect(screen.getByText(ADMIN_SERVER_TROUBLE_TITLE)).toBeInTheDocument()
    expect(screen.getByText(ADMIN_SERVER_TROUBLE_MESSAGE)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
  })

  it('probes with backoff and revalidates once the API answers', async () => {
    const probe = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false)
      .mockResolvedValue(true)
    render(<AdminRouteErrorBoundary error={new TypeError('Failed to fetch')} probe={probe} />)

    await advance(1999)
    expect(probe).not.toHaveBeenCalled()
    await advance(1)
    expect(probe).toHaveBeenCalledTimes(1)
    await advance(4000)
    expect(probe).toHaveBeenCalledTimes(2)
    expect(revalidate).not.toHaveBeenCalled()
    await advance(8000)
    expect(probe).toHaveBeenCalledTimes(3)
    expect(revalidate).toHaveBeenCalledTimes(1)
  })

  it('caps the backoff at 30 seconds', async () => {
    const probe = vi.fn().mockResolvedValue(false)
    render(<AdminApiUnavailable probe={probe} />)

    // 2 + 4 + 8 + 16 + 30 seconds
    await advance(60000)
    expect(probe).toHaveBeenCalledTimes(5)
    await advance(30000)
    expect(probe).toHaveBeenCalledTimes(6)
  })

  it('probes at once when the browser comes back online or the tab is shown', async () => {
    const probe = vi.fn().mockResolvedValue(false)
    render(<AdminApiUnavailable probe={probe} />)

    await act(async () => {
      globalThis.dispatchEvent(new Event('online'))
    })
    expect(probe).toHaveBeenCalledTimes(1)

    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(probe).toHaveBeenCalledTimes(2)
  })

  it('keeps a manual retry that probes at once', async () => {
    const probe = vi.fn().mockResolvedValue(true)
    const onRecover = vi.fn()
    render(<AdminApiUnavailable probe={probe} onRecover={onRecover} />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
    })
    expect(probe).toHaveBeenCalledTimes(1)
    expect(onRecover).toHaveBeenCalledTimes(1)
  })

  it('uses the probe from AdminDataProvider when the boundary has none', async () => {
    const probe = vi.fn().mockResolvedValue(true)
    render(
      <AdminDataProvider sdk={{}} databaseModels={[]} formTheme={{}} probe={probe}>
        <AdminRouteErrorBoundary error={new TypeError('Failed to fetch')} />
      </AdminDataProvider>,
    )

    await advance(2000)
    expect(probe).toHaveBeenCalledTimes(1)
    expect(revalidate).toHaveBeenCalledTimes(1)
  })

  it('without any probe, revalidates while online and waits while offline', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 404 }))
    vi.stubGlobal('fetch', fetchMock)
    setOnline(false)
    render(<AdminApiUnavailable />)
    expect(screen.getByText(ADMIN_OFFLINE_TITLE)).toBeInTheDocument()

    await advance(2000)
    expect(revalidate).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()

    setOnline(true)
    await act(async () => {
      globalThis.dispatchEvent(new Event('online'))
    })
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/favicon\.ico$/),
      expect.objectContaining({ method: 'HEAD' }),
    )
    expect(revalidate).toHaveBeenCalledTimes(1)
    expect(screen.getByText(ADMIN_SERVER_TROUBLE_TITLE)).toBeInTheDocument()
  })

  it('without any probe, shows offline when the web app origin does not answer either', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    render(<AdminApiUnavailable />)
    expect(screen.getByText(ADMIN_SERVER_TROUBLE_TITLE)).toBeInTheDocument()

    await advance(2000)
    expect(revalidate).not.toHaveBeenCalled()
    expect(screen.getByText(ADMIN_OFFLINE_TITLE)).toBeInTheDocument()
  })

  it('keeps the widened backoff when the route fails again and the boundary remounts', async () => {
    const probe = vi.fn().mockResolvedValue(true)
    const first = render(<AdminApiUnavailable probe={probe} />)
    await advance(2000)
    expect(revalidate).toHaveBeenCalledTimes(1)
    first.unmount()

    probe.mockClear()
    render(<AdminApiUnavailable probe={probe} />)
    // Starts at the second step (4 s), not back at 2 s.
    await advance(3999)
    expect(probe).not.toHaveBeenCalled()
    await advance(1)
    expect(probe).toHaveBeenCalledTimes(1)
    expect(revalidate).toHaveBeenCalledTimes(2)
  })

  it('stops probing once unmounted', async () => {
    const probe = vi.fn().mockResolvedValue(false)
    const view = render(<AdminApiUnavailable probe={probe} />)
    view.unmount()
    await advance(60000)
    expect(probe).not.toHaveBeenCalled()
  })

  describe('offline vs server trouble', () => {
    it('shows offline when the probe says so', async () => {
      const probe = vi.fn().mockResolvedValue({ reachable: false, reason: 'offline' })
      render(<AdminApiUnavailable probe={probe} />)
      await advance(2000)
      expect(screen.getByText(ADMIN_OFFLINE_TITLE)).toBeInTheDocument()
      expect(screen.getByText(ADMIN_OFFLINE_MESSAGE)).toBeInTheDocument()
      expect(screen.queryByText(ADMIN_SERVER_TROUBLE_TITLE)).not.toBeInTheDocument()
    })

    it('shows server trouble when the probe says so', async () => {
      const probe = vi.fn().mockResolvedValue({ reachable: false, reason: 'server' })
      render(<AdminApiUnavailable probe={probe} />)
      await advance(2000)
      expect(screen.getByText(ADMIN_SERVER_TROUBLE_TITLE)).toBeInTheDocument()
      expect(screen.getByText(ADMIN_SERVER_TROUBLE_MESSAGE)).toBeInTheDocument()
      expect(screen.queryByText(ADMIN_OFFLINE_TITLE)).not.toBeInTheDocument()
    })

    it('starts offline when the browser is offline, before any probe', () => {
      setOnline(false)
      render(<AdminApiUnavailable probe={vi.fn()} />)
      expect(screen.getByText(ADMIN_OFFLINE_TITLE)).toBeInTheDocument()
    })

    it('re-checks the reason on every retry', async () => {
      const probe = vi
        .fn()
        .mockResolvedValueOnce({ reachable: false, reason: 'offline' })
        .mockResolvedValueOnce({ reachable: false, reason: 'server' })
        .mockResolvedValueOnce({ reachable: false, reason: 'offline' })
      render(<AdminApiUnavailable probe={probe} />)

      await advance(2000)
      expect(screen.getByText(ADMIN_OFFLINE_TITLE)).toBeInTheDocument()
      await advance(4000)
      expect(screen.getByText(ADMIN_SERVER_TROUBLE_TITLE)).toBeInTheDocument()
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
      })
      expect(probe).toHaveBeenCalledTimes(3)
      expect(screen.getByText(ADMIN_OFFLINE_TITLE)).toBeInTheDocument()
    })

    it('switches at once on the offline and online events', async () => {
      // A probe that never settles, so only the events change the reason.
      const probe = vi.fn(() => new Promise<boolean>(() => undefined))
      render(<AdminApiUnavailable probe={probe} />)
      expect(screen.getByText(ADMIN_SERVER_TROUBLE_TITLE)).toBeInTheDocument()

      setOnline(false)
      await act(async () => {
        globalThis.dispatchEvent(new Event('offline'))
      })
      expect(screen.getByText(ADMIN_OFFLINE_TITLE)).toBeInTheDocument()

      setOnline(true)
      await act(async () => {
        globalThis.dispatchEvent(new Event('online'))
      })
      expect(screen.getByText(ADMIN_SERVER_TROUBLE_TITLE)).toBeInTheDocument()
      expect(probe).toHaveBeenCalledTimes(1)
    })

    it('lets the probe triggered by the online event correct the reason', async () => {
      const probe = vi.fn().mockResolvedValue({ reachable: false, reason: 'offline' })
      setOnline(false)
      render(<AdminApiUnavailable probe={probe} />)
      setOnline(true)
      await act(async () => {
        globalThis.dispatchEvent(new Event('online'))
      })
      expect(probe).toHaveBeenCalledTimes(1)
      expect(screen.getByText(ADMIN_OFFLINE_TITLE)).toBeInTheDocument()
    })
  })

  describe('a legacy boolean probe', () => {
    it('shows server trouble while the browser is online, and still recovers', async () => {
      const probe = vi.fn().mockResolvedValueOnce(false).mockResolvedValue(true)
      render(<AdminRouteErrorBoundary error={new TypeError('Failed to fetch')} probe={probe} />)

      await advance(2000)
      expect(screen.getByText(ADMIN_SERVER_TROUBLE_TITLE)).toBeInTheDocument()
      expect(revalidate).not.toHaveBeenCalled()
      await advance(4000)
      expect(revalidate).toHaveBeenCalledTimes(1)
    })

    it('shows offline when navigator.onLine is false', async () => {
      const probe = vi.fn().mockResolvedValue(false)
      render(<AdminApiUnavailable probe={probe} />)
      await advance(2000)
      expect(screen.getByText(ADMIN_SERVER_TROUBLE_TITLE)).toBeInTheDocument()

      setOnline(false)
      await advance(4000)
      expect(probe).toHaveBeenCalledTimes(2)
      expect(screen.getByText(ADMIN_OFFLINE_TITLE)).toBeInTheDocument()
    })

    it('treats a rejected probe as unreachable', async () => {
      const probe = vi.fn().mockRejectedValue(new Error('boom'))
      render(<AdminApiUnavailable probe={probe} />)
      await advance(2000)
      expect(revalidate).not.toHaveBeenCalled()
      expect(screen.getByText(ADMIN_SERVER_TROUBLE_TITLE)).toBeInTheDocument()
    })

    it('keeps exporting the deprecated server-down constants', () => {
      expect(ADMIN_SERVER_DOWN_TITLE).toBe('Can’t reach the server')
      expect(ADMIN_SERVER_DOWN_MESSAGE).toMatch(/Retrying automatically/)
    })
  })

  describe('copy', () => {
    const translated = {
      offlineTitle: 'Sin conexión',
      offlineMessage: 'Nos reconectaremos automáticamente.',
      serverTitle: 'Problemas con nuestros servidores',
      serverMessage: 'Reintentando automáticamente.',
      retryLabel: 'Reintentar',
      backLinkLabel: 'Volver',
    }

    it('takes translated strings from the copy prop', async () => {
      const probe = vi.fn().mockResolvedValue({ reachable: false, reason: 'server' })
      render(<AdminApiUnavailable probe={probe} copy={translated} />)
      expect(screen.getByText('Problemas con nuestros servidores')).toBeInTheDocument()
      expect(screen.getByText('Reintentando automáticamente.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Volver' })).toBeInTheDocument()

      setOnline(false)
      await act(async () => {
        globalThis.dispatchEvent(new Event('offline'))
      })
      expect(screen.getByText('Sin conexión')).toBeInTheDocument()
      expect(screen.getByText('Nos reconectaremos automáticamente.')).toBeInTheDocument()
    })

    it('takes copy from AdminDataProvider, lets the boundary override it, and falls back to English', () => {
      render(
        <AdminDataProvider
          sdk={{}}
          databaseModels={[]}
          formTheme={{}}
          probe={vi.fn()}
          unavailableCopy={{ serverTitle: 'Provider title', retryLabel: 'Provider retry' }}
        >
          <AdminRouteErrorBoundary
            error={new TypeError('Failed to fetch')}
            copy={{ retryLabel: 'Boundary retry' }}
          />
        </AdminDataProvider>,
      )
      expect(screen.getByText('Provider title')).toBeInTheDocument()
      expect(screen.getByText(ADMIN_API_UNAVAILABLE_COPY.serverMessage)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Boundary retry' })).toBeInTheDocument()
    })
  })
})

describe('normalizeAdminProbeResult', () => {
  afterEach(() => setOnline(true))

  it('maps a boolean and a result without a reason through navigator.onLine', () => {
    setOnline(true)
    expect(normalizeAdminProbeResult(true)).toEqual({ reachable: true, reason: 'server' })
    expect(normalizeAdminProbeResult(false)).toEqual({ reachable: false, reason: 'server' })
    expect(normalizeAdminProbeResult({ reachable: false })).toEqual({
      reachable: false,
      reason: 'server',
    })
    setOnline(false)
    expect(normalizeAdminProbeResult(false)).toEqual({ reachable: false, reason: 'offline' })
    expect(normalizeAdminProbeResult(undefined)).toEqual({ reachable: false, reason: 'offline' })
  })

  it('keeps the reason a probe gives', () => {
    setOnline(true)
    expect(normalizeAdminProbeResult({ reachable: false, reason: 'offline' })).toEqual({
      reachable: false,
      reason: 'offline',
    })
  })
})

describe('probeAdminConnectivity', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    setOnline(true)
  })

  it('reports offline without a request when navigator.onLine is false', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    setOnline(false)
    await expect(probeAdminConnectivity()).resolves.toEqual({ reachable: false, reason: 'offline' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('counts any answer from the web app origin as a working connection', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })))
    await expect(probeAdminConnectivity('/favicon.ico')).resolves.toEqual({ reachable: true })
  })

  it('reports offline when the web app origin does not answer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(probeAdminConnectivity('/favicon.ico')).resolves.toEqual({
      reachable: false,
      reason: 'offline',
    })
  })
})
