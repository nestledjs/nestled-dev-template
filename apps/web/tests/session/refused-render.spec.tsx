import { Suspense } from 'react'
import { act, cleanup, render, screen } from '@testing-library/react'
import { CombinedGraphQLErrors, ServerError } from '@apollo/client'
import { createMemoryRouter, RouterProvider, useLoaderData, useRouteError } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '../../app/root'
import { isRefusedRenderError } from '../../app/session'
import {
  __resetSessionRevalidation,
  REFUSED_RENDER_INTERVAL_MS,
} from '../../app/session/session-revalidator'
import { stubLocation } from '../helpers/location'

// A preload the API refuses after the request was judged signed in reaches the browser in the
// loader data stream: the component that reads it throws, and the browser's error link never sees
// it. The root ErrorBoundary asks the server to judge the session again. It never signs out.

function graphqlError(extensions: Record<string, unknown>, message = 'Nope') {
  return new CombinedGraphQLErrors({ data: null, errors: [{ message, extensions }] })
}

const refused = () => graphqlError({ code: 'UNAUTHENTICATED' })

type Outcome = () => unknown

let loads: number
let location: ReturnType<typeof stubLocation>

/** A page whose render throws whatever the loader streamed, under the app's root ErrorBoundary. */
async function renderPage(outcome: (load: number) => Outcome) {
  function Page() {
    const { result } = useLoaderData() as { result: Outcome }
    return <p>{String(result())}</p>
  }
  function Boundary() {
    return <ErrorBoundary error={useRouteError()} />
  }
  const router = createMemoryRouter(
    [
      {
        path: '/members',
        loader: () => {
          loads += 1
          return { result: outcome(loads) }
        },
        element: (
          <Suspense fallback={null}>
            <Page />
          </Suspense>
        ),
        ErrorBoundary: Boundary,
      },
      { path: '/login', element: <p>Login</p> },
    ],
    { initialEntries: ['/members'] },
  )
  await act(async () => {
    render(<RouterProvider router={router} />)
  })
  return router
}

const throwing = (error: unknown) => () => {
  throw error
}

beforeEach(() => {
  __resetSessionRevalidation()
  loads = 0
  location = stubLocation()
  vi.useFakeTimers({ shouldAdvanceTime: true })
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

afterEach(() => {
  cleanup()
  expect(location.assign).not.toHaveBeenCalled()
  expect(location.replace).not.toHaveBeenCalled()
  expect(location.reload).not.toHaveBeenCalled()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  __resetSessionRevalidation()
})

async function wait(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}

describe('a render the API refused', () => {
  it('asks the server once, and gives way to the page when the retry succeeds', async () => {
    await renderPage(load => (load === 1 ? throwing(refused()) : () => 'the page'))
    await wait(100)

    expect(screen.getByText('the page')).toBeInTheDocument()
    expect(loads).toBe(2)
  })

  it('lets the server decide: a verdict of signed out is its redirect, not this page', async () => {
    const router = await renderPage(load => {
      if (load > 1) throw new Response(null, { status: 302, headers: { Location: '/login' } })
      return throwing(refused())
    })
    await wait(100)

    expect(router.state.location.pathname).toBe('/login')
  })

  it('a refusal that stays is at most one retry a minute, with the 401 screen between', async () => {
    const router = await renderPage(() => throwing(refused()))
    await wait(100)
    expect(loads).toBe(2)
    expect(screen.getByText('401')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()

    await wait(REFUSED_RENDER_INTERVAL_MS / 2)
    expect(loads).toBe(2)
    // The user's own retries load the data again, and do not add retries of their own.
    await act(() => router.revalidate())
    expect(loads).toBe(3)
    await wait(REFUSED_RENDER_INTERVAL_MS / 4)
    expect(loads).toBe(3)
    expect(router.state.location.pathname).toBe('/members')
  })
})

describe('what is a refused render', () => {
  it.each([
    ['a GraphQL UNAUTHENTICATED', refused(), true],
    [
      'an HTTP 401',
      new ServerError('refused', { response: new Response(null, { status: 401 }), bodyText: '' }),
      true,
    ],
    [
      'a 401 beside a 503 (an outage outranks it)',
      new CombinedGraphQLErrors({
        data: null,
        errors: [
          { message: 'a', extensions: { code: 'UNAUTHENTICATED' } },
          { message: 'b', extensions: { code: 'INTERNAL_SERVER_ERROR', status: 503 } },
        ],
      }),
      false,
    ],
    ['a message that says so', new Error('Unauthorized'), false],
    ['a GraphQL message that says so', graphqlError({ code: 'X' }, 'Unauthorized'), false],
    ['a forbidden call', graphqlError({ code: 'FORBIDDEN' }), false],
    ['nothing', undefined, false],
  ])('%s', (_label, error, expected) => {
    expect(isRefusedRenderError(error)).toBe(expected)
  })

  it('any other render error asks nothing', async () => {
    await renderPage(() => throwing(new Error('Unauthorized')))
    await wait(REFUSED_RENDER_INTERVAL_MS)
    expect(loads).toBe(1)
  })
})
