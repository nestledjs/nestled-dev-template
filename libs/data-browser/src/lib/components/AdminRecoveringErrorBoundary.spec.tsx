import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminDataProvider } from '../context/AdminDataContext'
import {
  ADMIN_OFFLINE_TITLE,
  ADMIN_SERVER_DOWN_TITLE,
  AdminApiUnavailable,
  AdminRouteErrorBoundary,
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
    setOnline(true)
  })

  it('leaves a non-network error to the shared ErrorBoundary', () => {
    render(<AdminRouteErrorBoundary error={new Error('Boom')} />)
    expect(screen.getByText('Static boundary: Boom')).toBeInTheDocument()
  })

  it('shows the recovering panel for a network error', () => {
    render(<AdminRouteErrorBoundary error={new TypeError('Failed to fetch')} probe={vi.fn()} />)
    expect(screen.getByText(ADMIN_SERVER_DOWN_TITLE)).toBeInTheDocument()
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
    setOnline(false)
    render(<AdminApiUnavailable />)
    expect(screen.getByText(ADMIN_OFFLINE_TITLE)).toBeInTheDocument()

    await advance(2000)
    expect(revalidate).not.toHaveBeenCalled()

    setOnline(true)
    await act(async () => {
      globalThis.dispatchEvent(new Event('online'))
    })
    expect(revalidate).toHaveBeenCalledTimes(1)
    expect(screen.getByText(ADMIN_SERVER_DOWN_TITLE)).toBeInTheDocument()
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
})
