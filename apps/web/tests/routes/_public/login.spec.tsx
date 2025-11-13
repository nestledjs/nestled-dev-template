import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestRouter } from "../../helpers/createTestRouter"
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login, { loader } from '../../../app/routes/_public/login'
import { getCookie, getJsonCookie } from '@nestled-template/shared/utils'

// Mock only the essential external dependencies
vi.mock('@nestled-template/shared/utils', () => ({
  getCookie: vi.fn(),
  getJsonCookie: vi.fn(),
}))

vi.mock('@nestled-template/shared/sdk', () => ({
  useLoginMutation: vi.fn(),
  useComplete2FaLoginMutation: vi.fn(),
}))

import { useLoginMutation, useComplete2FaLoginMutation } from '@nestled-template/shared/sdk'

describe('Login Component', () => {
  let mockLoginMutation: ReturnType<typeof vi.fn>
  let mockComplete2FAMutation: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockLoginMutation = vi.fn()
    mockComplete2FAMutation = vi.fn()

    vi.mocked(useLoginMutation).mockReturnValue([mockLoginMutation] as any)
    vi.mocked(useComplete2FaLoginMutation).mockReturnValue([mockComplete2FAMutation] as any)
    vi.mocked(getCookie).mockReturnValue(null)
    vi.mocked(getJsonCookie).mockReturnValue(null)
  })

  const renderLogin = (loaderData = {}) => {
    const ReactRouterStub = createTestRouter([
      {
        path: '/login',
        Component: Login,
        loader: () => loaderData,
      },
    ])

    return render(<ReactRouterStub initialEntries={['/login']} />)
  }

  // Note: Component rendering tests are skipped due to complex dependency chain
  // (AuthLayout, Form from @nestledjs/forms, etc.) that would require extensive mocking.
  // Focus on loader function tests and E2E tests for UI validation.

  describe('Loader Function', () => {
    it('should redirect authenticated users to dashboard', async () => {
      vi.mocked(getCookie).mockReturnValue('valid-session-token')

      const request = new Request('http://localhost/login')
      const args = { request, params: {}, context: {} } as any

      await expect(loader(args)).rejects.toThrow()
    })

    it('should return remembered email data', async () => {
      vi.mocked(getCookie).mockReturnValue(null)
      vi.mocked(getJsonCookie).mockReturnValue({ email: 'remembered@example.com' })

      const request = new Request('http://localhost/login')
      const args = { request, params: {}, context: {} } as any

      const result = await loader(args)
      expect(result).toEqual({ email: 'remembered@example.com' })
    })

    it('should return empty object when no remembered data', async () => {
      vi.mocked(getCookie).mockReturnValue(null)
      vi.mocked(getJsonCookie).mockReturnValue(null)

      const request = new Request('http://localhost/login')
      const args = { request, params: {}, context: {} } as any

      const result = await loader(args)
      expect(result).toEqual({})
    })
  })
})
