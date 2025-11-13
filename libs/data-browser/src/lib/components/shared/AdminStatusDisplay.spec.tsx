import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { AdminStatusDisplay, AdminUserStatus, type StatusType } from './AdminStatusDisplay'

describe('AdminStatusDisplay', () => {
  describe('basic rendering', () => {
    it('should render default label for status', () => {
      render(<AdminStatusDisplay status="active" />)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('should render custom label when provided', () => {
      render(<AdminStatusDisplay status="active" label="Currently Active" />)
      expect(screen.getByText('Currently Active')).toBeInTheDocument()
    })

    it('should render icon by default', () => {
      const { container } = render(<AdminStatusDisplay status="active" />)
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should not render icon when showIcon is false', () => {
      const { container } = render(<AdminStatusDisplay status="active" showIcon={false} />)
      const icon = container.querySelector('svg')
      expect(icon).not.toBeInTheDocument()
    })
  })

  describe('all status types', () => {
    const statuses: StatusType[] = [
      'active',
      'inactive',
      'pending',
      'approved',
      'rejected',
      'warning',
      'error',
      'success',
      'paused',
      'unknown',
    ]

    statuses.forEach(status => {
      it(`should render ${status} status`, () => {
        render(<AdminStatusDisplay status={status} />)
        const element = screen.getByText(new RegExp(status, 'i'))
        expect(element).toBeInTheDocument()
      })

      it(`should apply correct color classes for ${status}`, () => {
        const { container } = render(<AdminStatusDisplay status={status} />)
        const badge = container.firstChild
        expect(badge).toHaveClass('inline-flex', 'items-center')
      })
    })
  })

  describe('status color configurations', () => {
    it('should apply green colors for active status', () => {
      const { container } = render(<AdminStatusDisplay status="active" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'border-green-200')
    })

    it('should apply gray colors for inactive status', () => {
      const { container } = render(<AdminStatusDisplay status="inactive" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-800', 'border-gray-200')
    })

    it('should apply yellow colors for pending status', () => {
      const { container } = render(<AdminStatusDisplay status="pending" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800', 'border-yellow-200')
    })

    it('should apply red colors for rejected status', () => {
      const { container } = render(<AdminStatusDisplay status="rejected" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('bg-red-100', 'text-red-800', 'border-red-200')
    })

    it('should apply blue colors for paused status', () => {
      const { container } = render(<AdminStatusDisplay status="paused" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'border-blue-200')
    })
  })

  describe('size variants', () => {
    it('should apply small size classes', () => {
      const { container } = render(<AdminStatusDisplay status="active" size="small" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('text-xs', 'px-2', 'py-1')
    })

    it('should apply medium size classes by default', () => {
      const { container } = render(<AdminStatusDisplay status="active" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('text-sm', 'px-2.5', 'py-1.5')
    })

    it('should apply large size classes', () => {
      const { container } = render(<AdminStatusDisplay status="active" size="large" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('text-base', 'px-3', 'py-2')
    })
  })

  describe('display variants', () => {
    it('should render badge variant by default', () => {
      const { container } = render(<AdminStatusDisplay status="active" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('rounded', 'border')
      expect(badge).not.toHaveClass('rounded-full')
    })

    it('should render pill variant', () => {
      const { container } = render(<AdminStatusDisplay status="active" variant="pill" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('rounded-full', 'border')
    })

    it('should render dot variant without icon', () => {
      const { container } = render(<AdminStatusDisplay status="active" variant="dot" />)
      const badge = container.firstChild
      const icon = container.querySelector('svg')

      expect(badge).toHaveClass('inline-flex')
      expect(icon).not.toBeInTheDocument() // Dot variant doesn't show main icon
    })

    it('should render full variant', () => {
      const { container } = render(<AdminStatusDisplay status="active" variant="full" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('flex', 'items-center', 'justify-center', 'w-full')
    })
  })

  describe('onClick behavior', () => {
    it('should render as button when onClick is provided', () => {
      const onClick = vi.fn()
      render(<AdminStatusDisplay status="active" onClick={onClick} />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should call onClick when clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(<AdminStatusDisplay status="active" onClick={onClick} />)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should apply clickable styling when onClick is provided', () => {
      const onClick = vi.fn()
      render(<AdminStatusDisplay status="active" onClick={onClick} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('cursor-pointer', 'hover:opacity-80')
    })

    it('should render as span when onClick is not provided', () => {
      const { container } = render(<AdminStatusDisplay status="active" />)

      const button = screen.queryByRole('button')
      expect(button).not.toBeInTheDocument()

      const span = container.querySelector('span')
      expect(span).toBeInTheDocument()
    })
  })

  describe('tooltip', () => {
    it('should apply tooltip title to button when clickable', () => {
      const onClick = vi.fn()
      render(<AdminStatusDisplay status="active" onClick={onClick} tooltip="Click to change" />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', 'Click to change')
    })

    it('should apply tooltip title to span when not clickable', () => {
      const { container } = render(<AdminStatusDisplay status="active" tooltip="Status tooltip" />)

      const span = container.querySelector('span')
      expect(span).toHaveAttribute('title', 'Status tooltip')
    })
  })

  describe('custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<AdminStatusDisplay status="active" className="custom-status" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('custom-status')
    })

    it('should preserve base classes with custom className', () => {
      const { container } = render(<AdminStatusDisplay status="active" className="custom-status" />)
      const badge = container.firstChild
      expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded', 'custom-status')
    })
  })

  describe('icon sizing', () => {
    it('should size icon according to size prop for small', () => {
      const { container } = render(<AdminStatusDisplay status="active" size="small" />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('h-3', 'w-3')
    })

    it('should size icon according to size prop for medium', () => {
      const { container } = render(<AdminStatusDisplay status="active" size="medium" />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('h-4', 'w-4')
    })

    it('should size icon according to size prop for large', () => {
      const { container } = render(<AdminStatusDisplay status="active" size="large" />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('h-5', 'w-5')
    })
  })
})

describe('AdminUserStatus', () => {
  describe('basic rendering', () => {
    it('should render online status', () => {
      const { container } = render(<AdminUserStatus status="online" />)
      const dot = container.querySelector('.bg-green-400')
      expect(dot).toBeInTheDocument()
    })

    it('should render offline status', () => {
      const { container } = render(<AdminUserStatus status="offline" />)
      const dot = container.querySelector('.bg-gray-400')
      expect(dot).toBeInTheDocument()
    })

    it('should render away status', () => {
      const { container } = render(<AdminUserStatus status="away" />)
      const dot = container.querySelector('.bg-yellow-400')
      expect(dot).toBeInTheDocument()
    })

    it('should render busy status', () => {
      const { container } = render(<AdminUserStatus status="busy" />)
      const dot = container.querySelector('.bg-red-400')
      expect(dot).toBeInTheDocument()
    })
  })

  describe('label display', () => {
    it('should not show label by default', () => {
      render(<AdminUserStatus status="online" />)
      expect(screen.queryByText('Online')).not.toBeInTheDocument()
    })

    it('should show label when showLabel is true', () => {
      render(<AdminUserStatus status="online" showLabel={true} />)
      expect(screen.getByText('Online')).toBeInTheDocument()
    })

    it('should display correct label for offline', () => {
      render(<AdminUserStatus status="offline" showLabel={true} />)
      expect(screen.getByText('Offline')).toBeInTheDocument()
    })

    it('should display correct label for away', () => {
      render(<AdminUserStatus status="away" showLabel={true} />)
      expect(screen.getByText('Away')).toBeInTheDocument()
    })

    it('should display correct label for busy', () => {
      render(<AdminUserStatus status="busy" showLabel={true} />)
      expect(screen.getByText('Busy')).toBeInTheDocument()
    })
  })

  describe('size variants', () => {
    it('should apply small size to dot', () => {
      const { container } = render(<AdminUserStatus status="online" size="small" />)
      const dot = container.querySelector('.bg-green-400')
      expect(dot).toHaveClass('h-2', 'w-2')
    })

    it('should apply medium size to dot by default', () => {
      const { container } = render(<AdminUserStatus status="online" />)
      const dot = container.querySelector('.bg-green-400')
      expect(dot).toHaveClass('h-3', 'w-3')
    })

    it('should apply large size to dot', () => {
      const { container } = render(<AdminUserStatus status="online" size="large" />)
      const dot = container.querySelector('.bg-green-400')
      expect(dot).toHaveClass('h-4', 'w-4')
    })

    it('should size label text for small', () => {
      const { container } = render(<AdminUserStatus status="online" size="small" showLabel={true} />)
      const label = screen.getByText('Online')
      expect(label).toHaveClass('text-xs')
    })

    it('should size label text for large', () => {
      const { container } = render(<AdminUserStatus status="online" size="large" showLabel={true} />)
      const label = screen.getByText('Online')
      expect(label).toHaveClass('text-base')
    })
  })

  describe('custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<AdminUserStatus status="online" className="custom-user-status" />)
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('custom-user-status')
    })

    it('should preserve base classes with custom className', () => {
      const { container } = render(<AdminUserStatus status="online" className="custom-user-status" />)
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('inline-flex', 'items-center', 'custom-user-status')
    })
  })

  describe('accessibility', () => {
    it('should have aria-label on status dot', () => {
      const { container } = render(<AdminUserStatus status="online" />)
      const dot = container.querySelector('[aria-label]')
      expect(dot).toHaveAttribute('aria-label', 'Online')
    })

    it('should have correct aria-label for all statuses', () => {
      const statuses = [
        { status: 'online' as const, label: 'Online' },
        { status: 'offline' as const, label: 'Offline' },
        { status: 'away' as const, label: 'Away' },
        { status: 'busy' as const, label: 'Busy' },
      ]

      statuses.forEach(({ status, label }) => {
        const { container } = render(<AdminUserStatus status={status} />)
        const dot = container.querySelector('[aria-label]')
        expect(dot).toHaveAttribute('aria-label', label)
      })
    })
  })

  describe('styling', () => {
    it('should have rounded dot', () => {
      const { container } = render(<AdminUserStatus status="online" />)
      const dot = container.querySelector('.bg-green-400')
      expect(dot).toHaveClass('rounded-full')
    })

    it('should have proper spacing between dot and label', () => {
      const { container } = render(<AdminUserStatus status="online" showLabel={true} />)
      const label = screen.getByText('Online')
      expect(label).toHaveClass('ml-2')
    })

    it('should have gray text color for label', () => {
      render(<AdminUserStatus status="online" showLabel={true} />)
      const label = screen.getByText('Online')
      expect(label).toHaveClass('text-gray-700')
    })
  })
})

describe('integration scenarios', () => {
  it('should handle AdminStatusDisplay with all props', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <AdminStatusDisplay
        status="pending"
        label="Awaiting Approval"
        size="large"
        variant="pill"
        showIcon={true}
        className="my-status"
        onClick={onClick}
        tooltip="Click to approve"
      />
    )

    const button = screen.getByRole('button', { name: 'Awaiting Approval' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('my-status')
    expect(button).toHaveAttribute('title', 'Click to approve')

    await user.click(button)
    expect(onClick).toHaveBeenCalled()
  })

  it('should handle AdminUserStatus with all props', () => {
    render(
      <AdminUserStatus
        status="away"
        showLabel={true}
        size="large"
        className="my-user-status"
      />
    )

    expect(screen.getByText('Away')).toBeInTheDocument()
    const wrapper = screen.getByText('Away').closest('div')
    expect(wrapper).toHaveClass('my-user-status')
  })
})
