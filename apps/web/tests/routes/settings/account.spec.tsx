import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createTestRouter } from '../../helpers/createTestRouter'
import AccountSettings from '../../../app/routes/settings/account'

import { useLoaderData } from 'react-router'
import { useReadQuery } from '@apollo/client/react'
import {
  useDeleteUserAccountMutation,
  useExportUserDataLazyQuery,
  useResendVerificationEmailMutation,
} from '@nestled-template/shared/sdk'

// Mock React Router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useLoaderData: vi.fn(),
  }
})

// Mock the SDK mutations and queries
vi.mock('@nestled-template/shared/sdk', () => ({
  MeDocument: {},
  useDeleteUserAccountMutation: vi.fn(),
  useExportUserDataLazyQuery: vi.fn(),
  useResendVerificationEmailMutation: vi.fn(),
}))

// Mock TransferOwnershipModal component
vi.mock('../../../app/components/TransferOwnershipModal', () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="transfer-modal">
        <h3>Transfer Ownership Modal</h3>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}))

// Mock Apollo
vi.mock('@apollo/client/react', () => ({
  useReadQuery: vi.fn(),
}))

describe('AccountSettings', () => {
  const mockDeleteAccount = vi.fn()
  const mockExportUserData = vi.fn()
  const mockResendVerificationEmail = vi.fn()

  const mockUser = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    emails: [{ email: 'john@example.com', primary: true }],
    emailValidated: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isSuperAdmin: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock useLoaderData to return the QueryRef
    vi.mocked(useLoaderData).mockReturnValue({
      meQueryRef: {} as any,
    })

    // Mock Apollo client hook
    vi.mocked(useReadQuery).mockReturnValue({
      data: { me: mockUser },
    } as any)

    vi.mocked(useDeleteUserAccountMutation).mockReturnValue([mockDeleteAccount, {} as any])
    vi.mocked(useExportUserDataLazyQuery).mockReturnValue([mockExportUserData, {} as any])
    vi.mocked(useResendVerificationEmailMutation).mockReturnValue([
      mockResendVerificationEmail,
      {} as any,
    ])

    global.alert = vi.fn()
    Object.assign(window, {
      location: { href: '' },
    })
    URL.createObjectURL = vi.fn(() => 'mock-url')
  })

  const renderWithRouter = () => {
    const ReactRouterStub = createTestRouter([
      {
        path: '/settings/account',
        Component: AccountSettings,
      },
    ])

    return render(<ReactRouterStub initialEntries={['/settings/account']} />)
  }

  describe('Basic Rendering', () => {
    it('should render page header', () => {
      renderWithRouter()

      expect(screen.getByText('Account Settings')).toBeInTheDocument()
      expect(
        screen.getByText('Manage your personal account information and preferences')
      ).toBeInTheDocument()
    })

    it('should render user information', () => {
      renderWithRouter()

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    it('should render all main sections', () => {
      renderWithRouter()

      expect(screen.getByText('Personal Information')).toBeInTheDocument()
      expect(screen.getByText('Account Information')).toBeInTheDocument()
      expect(screen.getByText('Export Your Data')).toBeInTheDocument()
      expect(screen.getByText('Transfer Organization Ownership')).toBeInTheDocument()
      expect(screen.getByText('Danger Zone')).toBeInTheDocument()
    })
  })

  describe('Email Verification', () => {
    it('should show verify button for unverified email', () => {
      vi.mocked(useReadQuery).mockReturnValue({
        data: {
          me: {
            ...mockUser,
            emailValidated: false,
          },
        },
      } as any)

      renderWithRouter()

      expect(screen.getByRole('button', { name: /verify email/i })).toBeInTheDocument()
    })

    it('should not show verify button for verified email', () => {
      renderWithRouter()

      expect(screen.queryByRole('button', { name: /verify email/i })).not.toBeInTheDocument()
    })
  })

  describe('Data Export', () => {
    it('should have export button', () => {
      renderWithRouter()

      expect(screen.getByRole('button', { name: /export personal data/i })).toBeInTheDocument()
    })

    it('should call export when button clicked', async () => {
      const user = userEvent.setup()
      mockExportUserData.mockResolvedValue({
        data: { exportUserData: { userData: {} } },
      })

      renderWithRouter()

      const exportButton = screen.getByRole('button', { name: /export personal data/i })
      await user.click(exportButton)

      expect(mockExportUserData).toHaveBeenCalled()
    })
  })

  describe('Transfer Ownership', () => {
    it('should have transfer ownership button', () => {
      renderWithRouter()

      expect(screen.getByRole('button', { name: /transfer ownership/i })).toBeInTheDocument()
    })

    it('should open modal when clicked', async () => {
      const user = userEvent.setup()

      renderWithRouter()

      const button = screen.getByRole('button', { name: /transfer ownership/i })
      await user.click(button)

      expect(screen.getByTestId('transfer-modal')).toBeInTheDocument()
    })
  })

  describe('Delete Account', () => {
    it('should have delete account button', () => {
      renderWithRouter()

      expect(screen.getByRole('button', { name: /delete my account/i })).toBeInTheDocument()
    })

    it('should show confirmation when clicked', async () => {
      const user = userEvent.setup()

      renderWithRouter()

      const deleteButton = screen.getByRole('button', { name: /delete my account/i })
      await user.click(deleteButton)

      expect(screen.getByText(/are you absolutely sure/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/type delete to confirm/i)).toBeInTheDocument()
    })

    it('should require DELETE text to enable confirm button', async () => {
      const user = userEvent.setup()

      renderWithRouter()

      const deleteButton = screen.getByRole('button', { name: /delete my account/i })
      await user.click(deleteButton)

      const confirmButton = screen.getByRole('button', { name: /i understand, delete my account/i })
      expect(confirmButton).toBeDisabled()

      const input = screen.getByPlaceholderText(/type delete to confirm/i)
      await user.type(input, 'DELETE')

      expect(confirmButton).not.toBeDisabled()
    })
  })
})
