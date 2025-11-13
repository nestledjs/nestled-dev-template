import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { AdminErrorState, AdminEmptyState, AdminLoadingState } from './AdminErrorStates'
import { FolderIcon } from '@heroicons/react/24/outline'

describe('AdminErrorStates', () => {
  describe('AdminErrorState', () => {
    describe('basic rendering', () => {
      it('should render error title', () => {
        render(<AdminErrorState title="Error occurred" />)
        expect(screen.getByText('Error occurred')).toBeInTheDocument()
      })

      it('should render error message when provided', () => {
        render(<AdminErrorState title="Error" message="Something went wrong" />)
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      })

      it('should not render message when not provided', () => {
        render(<AdminErrorState title="Error" />)
        const messages = screen.queryByRole('paragraph')
        expect(messages).not.toBeInTheDocument()
      })

      it('should render icon by default', () => {
        const { container } = render(<AdminErrorState title="Error" />)
        const icon = container.querySelector('svg')
        expect(icon).toBeInTheDocument()
      })

      it('should not render icon when showIcon is false', () => {
        const { container } = render(<AdminErrorState title="Error" showIcon={false} />)
        const icon = container.querySelector('svg')
        expect(icon).not.toBeInTheDocument()
      })
    })

    describe('severity variants', () => {
      it('should apply warning severity styles', () => {
        const { container } = render(<AdminErrorState title="Warning" severity="warning" />)
        const errorDiv = container.firstChild
        expect(errorDiv).toHaveClass('bg-yellow-50', 'border-yellow-200')
      })

      it('should apply error severity styles by default', () => {
        const { container } = render(<AdminErrorState title="Error" />)
        const errorDiv = container.firstChild
        expect(errorDiv).toHaveClass('bg-red-50', 'border-red-200')
      })

      it('should apply critical severity styles', () => {
        const { container } = render(<AdminErrorState title="Critical" severity="critical" />)
        const errorDiv = container.firstChild
        expect(errorDiv).toHaveClass('bg-red-100', 'border-red-300')
      })
    })

    describe('action buttons', () => {
      it('should render retry button when onRetry is provided', () => {
        const onRetry = vi.fn()
        render(<AdminErrorState title="Error" onRetry={onRetry} />)

        const retryButton = screen.getByRole('button', { name: 'Try Again' })
        expect(retryButton).toBeInTheDocument()
      })

      it('should call onRetry when retry button is clicked', async () => {
        const user = userEvent.setup()
        const onRetry = vi.fn()
        render(<AdminErrorState title="Error" onRetry={onRetry} />)

        const retryButton = screen.getByRole('button', { name: 'Try Again' })
        await user.click(retryButton)

        expect(onRetry).toHaveBeenCalledTimes(1)
      })

      it('should render dismiss button when onDismiss is provided', () => {
        const onDismiss = vi.fn()
        render(<AdminErrorState title="Error" onDismiss={onDismiss} />)

        const dismissButton = screen.getByRole('button', { name: 'Dismiss' })
        expect(dismissButton).toBeInTheDocument()
      })

      it('should call onDismiss when dismiss button is clicked', async () => {
        const user = userEvent.setup()
        const onDismiss = vi.fn()
        render(<AdminErrorState title="Error" onDismiss={onDismiss} />)

        const dismissButton = screen.getByRole('button', { name: 'Dismiss' })
        await user.click(dismissButton)

        expect(onDismiss).toHaveBeenCalledTimes(1)
      })

      it('should render both buttons when both handlers are provided', () => {
        const onRetry = vi.fn()
        const onDismiss = vi.fn()
        render(<AdminErrorState title="Error" onRetry={onRetry} onDismiss={onDismiss} />)

        expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
      })

      it('should not render button container when no handlers provided', () => {
        const { container } = render(<AdminErrorState title="Error" />)
        const buttons = container.querySelectorAll('button')
        expect(buttons).toHaveLength(0)
      })
    })

    describe('custom className', () => {
      it('should apply custom className', () => {
        const { container } = render(<AdminErrorState title="Error" className="custom-error" />)
        const errorDiv = container.firstChild
        expect(errorDiv).toHaveClass('custom-error')
      })

      it('should preserve base classes with custom className', () => {
        const { container } = render(<AdminErrorState title="Error" className="custom-error" />)
        const errorDiv = container.firstChild
        expect(errorDiv).toHaveClass('rounded-md', 'border', 'p-4', 'custom-error')
      })
    })
  })

  describe('AdminEmptyState', () => {
    describe('basic rendering', () => {
      it('should render empty state title', () => {
        render(<AdminEmptyState title="No items found" />)
        expect(screen.getByText('No items found')).toBeInTheDocument()
      })

      it('should render message when provided', () => {
        render(<AdminEmptyState title="No items" message="Try creating your first item" />)
        expect(screen.getByText('Try creating your first item')).toBeInTheDocument()
      })

      it('should not render message when not provided', () => {
        const { container } = render(<AdminEmptyState title="No items" />)
        const paragraphs = container.querySelectorAll('p')
        expect(paragraphs).toHaveLength(0)
      })

      it('should render custom icon when provided', () => {
        const { container } = render(<AdminEmptyState title="Empty" icon={FolderIcon} />)
        const icon = container.querySelector('svg')
        expect(icon).toBeInTheDocument()
        expect(icon).toHaveClass('h-12', 'w-12', 'text-gray-400')
      })

      it('should not render icon when not provided', () => {
        const { container } = render(<AdminEmptyState title="Empty" />)
        const icons = container.querySelectorAll('svg')
        expect(icons).toHaveLength(0)
      })
    })

    describe('action button', () => {
      it('should render action button when actionLabel and onAction are provided', () => {
        const onAction = vi.fn()
        render(<AdminEmptyState title="Empty" actionLabel="Create New" onAction={onAction} />)

        const button = screen.getByRole('button', { name: 'Create New' })
        expect(button).toBeInTheDocument()
      })

      it('should call onAction when button is clicked', async () => {
        const user = userEvent.setup()
        const onAction = vi.fn()
        render(<AdminEmptyState title="Empty" actionLabel="Create" onAction={onAction} />)

        const button = screen.getByRole('button', { name: 'Create' })
        await user.click(button)

        expect(onAction).toHaveBeenCalledTimes(1)
      })

      it('should not render button when only actionLabel is provided', () => {
        render(<AdminEmptyState title="Empty" actionLabel="Create" />)
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
      })

      it('should not render button when only onAction is provided', () => {
        const onAction = vi.fn()
        render(<AdminEmptyState title="Empty" onAction={onAction} />)
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
      })
    })

    describe('styling', () => {
      it('should apply custom className', () => {
        const { container } = render(<AdminEmptyState title="Empty" className="custom-empty" />)
        const emptyDiv = container.firstChild
        expect(emptyDiv).toHaveClass('text-center', 'custom-empty')
      })

      it('should have centered text by default', () => {
        const { container } = render(<AdminEmptyState title="Empty" />)
        const emptyDiv = container.firstChild
        expect(emptyDiv).toHaveClass('text-center')
      })
    })
  })

  describe('AdminLoadingState', () => {
    describe('basic rendering', () => {
      it('should render default loading title', () => {
        render(<AdminLoadingState />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
      })

      it('should render custom title when provided', () => {
        render(<AdminLoadingState title="Fetching data..." />)
        expect(screen.getByText('Fetching data...')).toBeInTheDocument()
      })

      it('should render message when provided', () => {
        render(<AdminLoadingState message="Please wait while we load your data" />)
        expect(screen.getByText('Please wait while we load your data')).toBeInTheDocument()
      })

      it('should not render message when not provided', () => {
        const { container } = render(<AdminLoadingState />)
        const paragraphs = container.querySelectorAll('p')
        expect(paragraphs).toHaveLength(0)
      })

      it('should render loading spinner', () => {
        const { container } = render(<AdminLoadingState />)
        const spinner = container.querySelector('.animate-spin')
        expect(spinner).toBeInTheDocument()
      })
    })

    describe('size variants', () => {
      it('should apply small size classes', () => {
        const { container } = render(<AdminLoadingState size="small" />)
        const spinner = container.querySelector('.animate-spin')
        expect(spinner).toHaveClass('h-4', 'w-4')
      })

      it('should apply medium size classes by default', () => {
        const { container } = render(<AdminLoadingState />)
        const spinner = container.querySelector('.animate-spin')
        expect(spinner).toHaveClass('h-8', 'w-8')
      })

      it('should apply large size classes', () => {
        const { container } = render(<AdminLoadingState size="large" />)
        const spinner = container.querySelector('.animate-spin')
        expect(spinner).toHaveClass('h-12', 'w-12')
      })
    })

    describe('styling', () => {
      it('should apply custom className', () => {
        const { container } = render(<AdminLoadingState className="custom-loading" />)
        const loadingDiv = container.firstChild
        expect(loadingDiv).toHaveClass('custom-loading')
      })

      it('should have flex layout for centering', () => {
        const { container } = render(<AdminLoadingState />)
        const loadingDiv = container.firstChild
        expect(loadingDiv).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
      })

      it('should have spinner with correct styling', () => {
        const { container } = render(<AdminLoadingState />)
        const spinner = container.querySelector('.animate-spin')
        expect(spinner).toHaveClass('rounded-full', 'border-b-2', 'border-green-web')
      })
    })
  })

  describe('integration scenarios', () => {
    it('should handle error state with all props', async () => {
      const user = userEvent.setup()
      const onRetry = vi.fn()
      const onDismiss = vi.fn()

      render(
        <AdminErrorState
          title="Connection Error"
          message="Failed to connect to server"
          severity="critical"
          onRetry={onRetry}
          onDismiss={onDismiss}
          showIcon={true}
          className="my-error"
        />
      )

      expect(screen.getByText('Connection Error')).toBeInTheDocument()
      expect(screen.getByText('Failed to connect to server')).toBeInTheDocument()

      const retryButton = screen.getByRole('button', { name: 'Try Again' })
      await user.click(retryButton)
      expect(onRetry).toHaveBeenCalled()

      const dismissButton = screen.getByRole('button', { name: 'Dismiss' })
      await user.click(dismissButton)
      expect(onDismiss).toHaveBeenCalled()
    })

    it('should handle empty state with all props', async () => {
      const user = userEvent.setup()
      const onAction = vi.fn()

      render(
        <AdminEmptyState
          title="No Users"
          message="Get started by creating a new user"
          actionLabel="Add User"
          onAction={onAction}
          icon={FolderIcon}
          className="my-empty"
        />
      )

      expect(screen.getByText('No Users')).toBeInTheDocument()
      expect(screen.getByText('Get started by creating a new user')).toBeInTheDocument()

      const button = screen.getByRole('button', { name: 'Add User' })
      await user.click(button)
      expect(onAction).toHaveBeenCalled()
    })

    it('should handle loading state with all props', () => {
      render(
        <AdminLoadingState
          title="Loading users..."
          message="This may take a few seconds"
          size="large"
          className="my-loading"
        />
      )

      expect(screen.getByText('Loading users...')).toBeInTheDocument()
      expect(screen.getByText('This may take a few seconds')).toBeInTheDocument()
    })
  })
})
