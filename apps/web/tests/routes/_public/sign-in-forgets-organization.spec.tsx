import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useMutation } from '@apollo/client/react'
import {
  getStoredActiveOrganizationId,
  storeActiveOrganizationId,
} from '@nestled-template/shared/apollo'
import { Complete2FaLogin, Login, Register } from '@nestled-template/shared/sdk'
import { createTestRouter } from '../../helpers/createTestRouter'
import LoginPage from '../../../app/routes/_public/login'
import RegisterPage from '../../../app/routes/_public/register'

// A new session must not be sent for the organization the browser stored for whoever was signed in
// before (`x-organization-id`): a shared browser, or a session that ended without a logout (it
// expired, or went through /force-logout, which cannot reach localStorage). Every sign-in path
// forgets the stored organization.

vi.mock('@apollo/client/react', () => ({ useMutation: vi.fn() }))

vi.mock('@nestled-template/web', () => ({
  AuthLayout: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
  turnstileSiteKey: () => undefined,
  TurnstileWidget: () => null,
}))

// A plain form that submits its inputs' values.
vi.mock('@nestledjs/forms', () => ({
  Form: ({
    id,
    fields,
    submit,
  }: {
    id: string
    fields: Array<{ key: string; type: string; options?: { label?: string; text?: string } }>
    submit: (values: Record<string, unknown>) => void
  }) => (
    <form
      id={id}
      onSubmit={event => {
        event.preventDefault()
        submit(Object.fromEntries(new FormData(event.currentTarget)))
      }}
    >
      {fields.map(({ key, type, options }) =>
        type === 'button' ? (
          <button key={key} type="submit">
            {options?.text}
          </button>
        ) : (
          <label key={key}>
            {options?.label}
            <input name={key} />
          </label>
        ),
      )}
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

const PREVIOUS_USERS_ORGANIZATION = 'org-of-the-previous-user'

type MutationAnswer = (variables: unknown) => unknown

function answerMutations(answers: Map<unknown, MutationAnswer>) {
  vi.mocked(useMutation).mockImplementation(((document: unknown) => [
    vi.fn(async ({ variables }: { variables?: unknown } = {}) => ({
      data: answers.get(document)?.(variables),
    })),
    { loading: false },
  ]) as never)
}

function renderAt(path: string, Component: React.ComponentType) {
  const Stub = createTestRouter([
    { path, Component, loader: () => ({}) },
    { path: '/members/dashboard', Component: () => <p>Dashboard</p> },
  ])
  return render(<Stub initialEntries={[path]} />)
}

describe('signing in forgets the organization stored for the previous user', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('a password sign-in forgets an organization stored after the form opened', async () => {
    answerMutations(new Map([[Login, () => ({ login: { user: { id: 'user-2' } } })]]))
    renderAt('/login', LoginPage)
    await screen.findByRole('heading', { name: 'Welcome Back' })
    // Another tab of the previous user's session stores its organization meanwhile.
    storeActiveOrganizationId(PREVIOUS_USERS_ORGANIZATION)

    await userEvent.click(screen.getByRole('button', { name: 'Log In' }))

    await screen.findByText('Dashboard')
    expect(getStoredActiveOrganizationId()).toBeNull()
  })

  it('a two-factor sign-in forgets it too', async () => {
    answerMutations(
      new Map<unknown, MutationAnswer>([
        [Login, () => ({ login: { requires2FA: true, tempToken: 'temp' } })],
        [Complete2FaLogin, () => ({ complete2FALogin: { user: { id: 'user-2' } } })],
      ]),
    )
    renderAt('/login', LoginPage)
    await userEvent.click(await screen.findByRole('button', { name: 'Log In' }))
    await screen.findByRole('heading', { name: 'Two-Factor Authentication' })
    storeActiveOrganizationId(PREVIOUS_USERS_ORGANIZATION)

    await userEvent.type(screen.getByLabelText('Authentication Code'), '123456')
    await userEvent.click(screen.getByRole('button', { name: 'Verify and Login' }))

    await screen.findByText('Dashboard')
    expect(getStoredActiveOrganizationId()).toBeNull()
  })

  it('a failed sign-in keeps what is stored', async () => {
    answerMutations(new Map([[Login, () => ({ login: null })]]))
    renderAt('/login', LoginPage)
    await screen.findByRole('heading', { name: 'Welcome Back' })
    storeActiveOrganizationId(PREVIOUS_USERS_ORGANIZATION)

    await userEvent.click(screen.getByRole('button', { name: 'Log In' }))

    await screen.findByText('Invalid login credentials')
    expect(getStoredActiveOrganizationId()).toBe(PREVIOUS_USERS_ORGANIZATION)
  })

  it('registering (which signs the new account in) forgets it', async () => {
    storeActiveOrganizationId(PREVIOUS_USERS_ORGANIZATION)
    answerMutations(new Map([[Register, () => ({ register: { token: 'token' } })]]))
    renderAt('/register', RegisterPage)

    await userEvent.click(await screen.findByRole('button', { name: 'Create Account' }))

    await screen.findByText('Dashboard')
    await waitFor(() => expect(getStoredActiveOrganizationId()).toBeNull())
  })
})
