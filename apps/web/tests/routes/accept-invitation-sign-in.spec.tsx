import React, { useEffect } from 'react'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLocation, useNavigate } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMutation } from '@apollo/client/react'
import { useGlobalCtx } from '@nestled-template/web'
import {
  __resetActiveOrganizationSessionChange,
  ACTIVE_ORGANIZATION_STORAGE_KEY,
} from '@nestled-template/shared/apollo'
import { AcceptOrganizationInvitation, Login } from '@nestled-template/shared/sdk'
import { createTestRouter } from '../helpers/createTestRouter'
import { stubLocation } from '../helpers/location'
import AcceptInvitationPage from '../../app/routes/accept-invitation'

// The invitation page's log-in tab starts a session. That session's work (accepting the invitation)
// belongs to a new document: this one still holds whatever it held before, and a document load is
// on its way. The invitation is single-use, so it must be accepted exactly once across both.

vi.mock('@apollo/client/react', () => {
  // One object, as the cache gives: a new one on every render re-runs the page's effect.
  const answer = {
    data: {
      getInvitationDetails: {
        id: 'inv-1',
        email: 'invitee@example.com',
        organizationName: 'Invited Org',
        inviterName: 'Inviter',
        roleName: 'Member',
      },
    },
    loading: false,
  }
  return { useMutation: vi.fn(), useQuery: () => answer }
})

vi.mock('@nestled-template/web', () => ({ useGlobalCtx: vi.fn() }))

vi.mock('@nestledjs/forms', () => ({
  Form: ({
    fields,
    submit,
  }: {
    fields: Array<{ key: string; type: string; options?: { text?: string } }>
    submit: (values: Record<string, unknown>) => void
  }) => (
    <form
      onSubmit={event => {
        event.preventDefault()
        submit({ email: 'invitee@example.com', password: 'correct-password' })
      }}
    >
      {fields
        .filter(({ type }) => type === 'button')
        .map(({ key, options }) => (
          <button key={key} type="submit">
            {options?.text}
          </button>
        ))}
    </form>
  ),
}))

vi.mock('@nestled-template/shared/styles', () => ({ formTheme: {} }))

vi.mock('@nestledjs/forms-core', () => ({
  FormFieldClass: Object.fromEntries(
    ['text', 'email', 'password', 'checkbox', 'button'].map(type => [
      type,
      (key: string, options: unknown) => ({ key, type, options }),
    ]),
  ),
}))

const TOKEN = 'a+token/with=signs&more'
const INVITATION = `/accept-invitation?token=${encodeURIComponent(TOKEN)}`
const SIGNED_IN = { login: { user: { id: 'user-b' } } }
const TWO_FACTOR = { login: { token: null, user: null, requires2FA: true, tempToken: 'temp' } }

let location: ReturnType<typeof stubLocation>
const accept = vi.fn()
let loginAnswer: () => Promise<unknown>
let goTo: (path: string) => void

function Address() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    goTo = navigate
  }, [navigate])
  return <p data-testid="address">{pathname + search}</p>
}

const page = () => (
  <>
    <Address />
    <AcceptInvitationPage />
  </>
)

function renderAt(path: string) {
  const Stub = createTestRouter([
    { path: '/accept-invitation', Component: page },
    { path: '/login', Component: Address },
    { path: '/members', Component: Address },
    { path: '/elsewhere', Component: Address },
  ])
  const rendered = render(<Stub initialEntries={[path]} />)
  return { renderAgain: () => rendered.rerender(<Stub initialEntries={[path]} />) }
}

const signedInAs = (id: string | null) =>
  vi.mocked(useGlobalCtx).mockReturnValue({ user: id ? { id } : null } as never)

async function logInOnInvitation() {
  await userEvent.click(await screen.findByRole('button', { name: 'Login' }))
  await userEvent.click(screen.getByRole('button', { name: 'Login & Accept Invitation' }))
}

/** The document load: fresh module state, the new session's cookie. */
function newDocument() {
  cleanup()
  __resetActiveOrganizationSessionChange()
}

beforeEach(() => {
  localStorage.clear()
  location = stubLocation()
  vi.spyOn(console, 'log').mockImplementation(() => undefined)
  signedInAs(null)
  accept.mockReset()
  accept.mockResolvedValue({ data: { acceptOrganizationInvitation: { success: true } } })
  loginAnswer = async () => ({ data: SIGNED_IN })
  vi.mocked(useMutation).mockImplementation(((document: unknown) => [
    document === AcceptOrganizationInvitation ? accept : () => loginAnswer(),
    { loading: false },
  ]) as never)
  expect(Login).toBeDefined()
})

afterEach(() => {
  vi.useRealTimers()
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  __resetActiveOrganizationSessionChange()
  localStorage.clear()
})

describe('a log-in on the invitation page', () => {
  it('loads the invitation again in a new document, and accepts it there, once', async () => {
    localStorage.setItem(ACTIVE_ORGANIZATION_STORAGE_KEY, 'org-of-a-previous-user')
    const first = renderAt(INVITATION)
    await logInOnInvitation()

    await waitFor(() => expect(location.replace).toHaveBeenCalledTimes(1))
    expect(location.replace).toHaveBeenCalledWith(INVITATION)
    expect(localStorage.getItem(ACTIVE_ORGANIZATION_STORAGE_KEY)).toBeNull()
    // The old document learns of the new user while its document load is on its way (a Me refetch,
    // a revalidation): it must not accept as well.
    signedInAs('user-b')
    first.renderAgain()
    await act(async () => undefined)
    expect(screen.getByTestId('address').textContent).toBe(INVITATION)
    expect(accept).not.toHaveBeenCalled()

    newDocument()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    renderAt(INVITATION)
    await waitFor(() => expect(accept).toHaveBeenCalledTimes(1))
    expect(accept).toHaveBeenCalledWith({ variables: { input: { token: TOKEN } } })
    await act(() => vi.advanceTimersByTimeAsync(2000))
    expect(screen.getByTestId('address').textContent).toBe('/members')
    expect(accept).toHaveBeenCalledTimes(1)
  })

  it('a previous user signed in on the page: the same, and their failed attempt is not repeated', async () => {
    signedInAs('user-a')
    accept.mockRejectedValueOnce(new Error('This invitation is for another address'))
    renderAt(INVITATION)
    await screen.findByText('This invitation is for another address')
    await logInOnInvitation()

    await waitFor(() => expect(location.replace).toHaveBeenCalledWith(INVITATION))
    expect(accept).toHaveBeenCalledTimes(1)

    newDocument()
    signedInAs('user-b')
    renderAt(INVITATION)
    await waitFor(() => expect(accept).toHaveBeenCalledTimes(2))
  })

  it('wrong credentials leave the page as it is', async () => {
    loginAnswer = async () => ({ data: { login: { user: null } } })
    renderAt(INVITATION)
    await logInOnInvitation()
    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument()
    expect(location.replace).not.toHaveBeenCalled()
    expect(accept).not.toHaveBeenCalled()
  })
})

describe('a late answer to the log-in', () => {
  function holdLogin(): (answer: unknown) => void {
    let release: (answer: unknown) => void = () => undefined
    loginAnswer = () =>
      new Promise(resolve => {
        release = answer => resolve({ data: answer })
      })
    return answer => release(answer)
  }

  it('asking for a second factor does not navigate once the user has left the page', async () => {
    const release = holdLogin()
    renderAt(INVITATION)
    await logInOnInvitation()
    await act(async () => goTo('/elsewhere'))

    await act(async () => release(TWO_FACTOR))
    expect(screen.getByTestId('address').textContent).toBe('/elsewhere')
  })

  it('asking for a second factor does not navigate once the page shows another invitation', async () => {
    const release = holdLogin()
    renderAt(INVITATION)
    await logInOnInvitation()
    await act(async () => goTo('/accept-invitation?token=another'))

    await act(async () => release(TWO_FACTOR))
    expect(screen.getByTestId('address').textContent).toBe('/accept-invitation?token=another')
  })

  it('asking for a second factor still navigates while the page is unchanged', async () => {
    const release = holdLogin()
    renderAt(INVITATION)
    await logInOnInvitation()
    await act(async () => release(TWO_FACTOR))
    expect(screen.getByTestId('address').textContent).toBe(
      `/login?return_url=${encodeURIComponent(INVITATION)}`,
    )
  })

  it('a session that started after the user left still gets a document of its own, and accepts nothing', async () => {
    const release = holdLogin()
    renderAt(INVITATION)
    await logInOnInvitation()
    await act(async () => goTo('/elsewhere'))

    await act(async () => release(SIGNED_IN))
    expect(accept).not.toHaveBeenCalled()
    expect(location.replace).toHaveBeenCalledTimes(1)
    expect(location.replace).not.toHaveBeenCalledWith(INVITATION)
  })
})
