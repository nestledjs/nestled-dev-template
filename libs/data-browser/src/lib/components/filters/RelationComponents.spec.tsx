import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import {
  RelationDropdownButton,
  RelationSearchInput,
  RelationItem,
  RelationItemList,
  RelationDropdownContent,
} from './RelationComponents'

describe('RelationComponents', () => {
  describe('RelationDropdownButton', () => {
    it('should render button with placeholder when no item selected', () => {
      const onClick = vi.fn()
      render(
        <RelationDropdownButton
          currentItem={null}
          relatedModelName="User"
          isOpen={false}
          onClick={onClick}
        />
      )

      expect(screen.getByText('Select user...')).toBeInTheDocument()
    })

    it('should render button with selected item display name', () => {
      const onClick = vi.fn()
      const currentItem = { id: '1', name: 'John Doe' }

      render(
        <RelationDropdownButton
          currentItem={currentItem}
          relatedModelName="User"
          isOpen={false}
          onClick={onClick}
        />
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should call onClick when button is clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()

      render(
        <RelationDropdownButton
          currentItem={null}
          relatedModelName="User"
          isOpen={false}
          onClick={onClick}
        />
      )

      const button = screen.getByRole('button')
      await user.click(button)

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should rotate chevron icon when open', () => {
      const onClick = vi.fn()
      const { container } = render(
        <RelationDropdownButton
          currentItem={null}
          relatedModelName="User"
          isOpen={true}
          onClick={onClick}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('rotate-180')
    })

    it('should not rotate chevron icon when closed', () => {
      const onClick = vi.fn()
      const { container } = render(
        <RelationDropdownButton
          currentItem={null}
          relatedModelName="User"
          isOpen={false}
          onClick={onClick}
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).not.toHaveClass('rotate-180')
    })

    it('should apply different text color for selected vs placeholder', () => {
      const onClick = vi.fn()

      const { rerender, container } = render(
        <RelationDropdownButton
          currentItem={null}
          relatedModelName="User"
          isOpen={false}
          onClick={onClick}
        />
      )

      const placeholderSpan = container.querySelector('span')
      expect(placeholderSpan).toHaveClass('text-gray-500')

      const currentItem = { id: '1', name: 'John Doe' }
      rerender(
        <RelationDropdownButton
          currentItem={currentItem}
          relatedModelName="User"
          isOpen={false}
          onClick={onClick}
        />
      )

      const selectedSpan = container.querySelector('span')
      expect(selectedSpan).toHaveClass('text-gray-900')
    })

    it('should lowercase model name in placeholder', () => {
      const onClick = vi.fn()
      render(
        <RelationDropdownButton
          currentItem={null}
          relatedModelName="Organization"
          isOpen={false}
          onClick={onClick}
        />
      )

      expect(screen.getByText('Select organization...')).toBeInTheDocument()
    })
  })

  describe('RelationSearchInput', () => {
    it('should render search input with placeholder', () => {
      const onSearchChange = vi.fn()

      render(
        <RelationSearchInput
          searchTerm=""
          onSearchChange={onSearchChange}
          relatedModelName="User"
        />
      )

      expect(screen.getByPlaceholderText('Search user...')).toBeInTheDocument()
    })

    it('should display current search term', () => {
      const onSearchChange = vi.fn()

      render(
        <RelationSearchInput
          searchTerm="John"
          onSearchChange={onSearchChange}
          relatedModelName="User"
        />
      )

      const input = screen.getByPlaceholderText('Search user...') as HTMLInputElement
      expect(input.value).toBe('John')
    })

    it('should call onSearchChange when typing', async () => {
      const user = userEvent.setup()
      const onSearchChange = vi.fn()

      render(
        <RelationSearchInput
          searchTerm=""
          onSearchChange={onSearchChange}
          relatedModelName="User"
        />
      )

      const input = screen.getByPlaceholderText('Search user...')
      await user.type(input, 'Jane')

      expect(onSearchChange).toHaveBeenCalled()
    })

    it('should lowercase model name in placeholder', () => {
      const onSearchChange = vi.fn()

      render(
        <RelationSearchInput
          searchTerm=""
          onSearchChange={onSearchChange}
          relatedModelName="Organization"
        />
      )

      expect(screen.getByPlaceholderText('Search organization...')).toBeInTheDocument()
    })
  })

  describe('RelationItem', () => {
    it('should render item display name', () => {
      const onSelect = vi.fn()
      const item = { id: '1', name: 'John Doe' }

      render(<RelationItem item={item} onSelect={onSelect} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should call onSelect when clicked', async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      const item = { id: '1', name: 'John Doe' }

      render(<RelationItem item={item} onSelect={onSelect} />)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(onSelect).toHaveBeenCalledWith(item)
      expect(onSelect).toHaveBeenCalledTimes(1)
    })

    it('should render as a button', () => {
      const onSelect = vi.fn()
      const item = { id: '1', name: 'John Doe' }

      render(<RelationItem item={item} onSelect={onSelect} />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should have hover styling', () => {
      const onSelect = vi.fn()
      const item = { id: '1', name: 'John Doe' }

      render(<RelationItem item={item} onSelect={onSelect} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-gray-100')
    })
  })

  describe('RelationItemList', () => {
    const mockOnSelect = vi.fn()
    const mockOnClear = vi.fn()

    beforeEach(() => {
      mockOnSelect.mockClear()
      mockOnClear.mockClear()
    })

    it('should render clear selection button', () => {
      render(
        <RelationItemList
          items={[]}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.getByText('Clear selection')).toBeInTheDocument()
    })

    it('should call onClear when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <RelationItemList
          items={[]}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      const clearButton = screen.getByText('Clear selection')
      await user.click(clearButton)

      expect(mockOnClear).toHaveBeenCalledTimes(1)
    })

    it('should show loading state', () => {
      render(
        <RelationItemList
          items={[]}
          loading={true}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should show error state with network error message', () => {
      const error = { networkError: { message: 'Network failed' } }

      render(
        <RelationItemList
          items={[]}
          loading={false}
          error={error}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.getByText('Failed to load options')).toBeInTheDocument()
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    it('should show error state with generic error message', () => {
      const error = { message: 'Something went wrong' }

      render(
        <RelationItemList
          items={[]}
          loading={false}
          error={error}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.getByText('Failed to load options')).toBeInTheDocument()
      expect(screen.getByText('Please try again')).toBeInTheDocument()
    })

    it('should show "No items found" when items array is empty', () => {
      render(
        <RelationItemList
          items={[]}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.getByText('No items found')).toBeInTheDocument()
    })

    it('should render list of items', () => {
      const items = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Bob Johnson' },
      ]

      render(
        <RelationItemList
          items={items}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })

    it('should not show loading when error is present', () => {
      const error = { message: 'Error' }

      render(
        <RelationItemList
          items={[]}
          loading={true}
          error={error}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      expect(screen.getByText('Failed to load options')).toBeInTheDocument()
    })

    it('should not show "No items found" when loading', () => {
      render(
        <RelationItemList
          items={[]}
          loading={true}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.queryByText('No items found')).not.toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should have scrollable container with max height', () => {
      const { container } = render(
        <RelationItemList
          items={[]}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      const listContainer = container.firstChild
      expect(listContainer).toHaveClass('max-h-48', 'overflow-y-auto')
    })

    it('should render loading spinner SVG', () => {
      const { container } = render(
        <RelationItemList
          items={[]}
          loading={true}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('should render error icon SVG', () => {
      const error = { message: 'Error' }
      const { container } = render(
        <RelationItemList
          items={[]}
          loading={false}
          error={error}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      // Error section should have an SVG icon
      const errorText = screen.getByText('Failed to load options')
      const errorContainer = errorText.closest('div')
      const icon = errorContainer?.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('RelationDropdownContent', () => {
    const mockOnSearchChange = vi.fn()
    const mockOnSelect = vi.fn()
    const mockOnClear = vi.fn()

    beforeEach(() => {
      mockOnSearchChange.mockClear()
      mockOnSelect.mockClear()
      mockOnClear.mockClear()
    })

    it('should render search input', () => {
      render(
        <RelationDropdownContent
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          relatedModelName="User"
          items={[]}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.getByPlaceholderText('Search user...')).toBeInTheDocument()
    })

    it('should render item list', () => {
      render(
        <RelationDropdownContent
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          relatedModelName="User"
          items={[]}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.getByText('Clear selection')).toBeInTheDocument()
    })

    it('should pass search term to search input', () => {
      render(
        <RelationDropdownContent
          searchTerm="John"
          onSearchChange={mockOnSearchChange}
          relatedModelName="User"
          items={[]}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      const input = screen.getByPlaceholderText('Search user...') as HTMLInputElement
      expect(input.value).toBe('John')
    })

    it('should pass items to item list', () => {
      const items = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
      ]

      render(
        <RelationDropdownContent
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          relatedModelName="User"
          items={items}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('should pass loading state to item list', () => {
      render(
        <RelationDropdownContent
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          relatedModelName="User"
          items={[]}
          loading={true}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should pass error to item list', () => {
      const error = { message: 'Error occurred' }

      render(
        <RelationDropdownContent
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          relatedModelName="User"
          items={[]}
          loading={false}
          error={error}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      expect(screen.getByText('Failed to load options')).toBeInTheDocument()
    })

    it('should have dropdown styling classes', () => {
      const { container } = render(
        <RelationDropdownContent
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          relatedModelName="User"
          items={[]}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      const dropdown = container.firstChild
      expect(dropdown).toHaveClass('absolute', 'z-10', 'w-full', 'bg-white', 'border', 'rounded-md', 'shadow-lg')
    })

    it('should position dropdown with mt-1', () => {
      const { container } = render(
        <RelationDropdownContent
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          relatedModelName="User"
          items={[]}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      const dropdown = container.firstChild
      expect(dropdown).toHaveClass('mt-1')
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete dropdown interaction flow', async () => {
      const user = userEvent.setup()
      const mockOnSearchChange = vi.fn()
      const mockOnSelect = vi.fn()
      const mockOnClear = vi.fn()

      const items = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
      ]

      render(
        <RelationDropdownContent
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          relatedModelName="User"
          items={items}
          loading={false}
          onSelect={mockOnSelect}
          onClear={mockOnClear}
        />
      )

      // Search for a user
      const searchInput = screen.getByPlaceholderText('Search user...')
      await user.type(searchInput, 'John')
      expect(mockOnSearchChange).toHaveBeenCalled()

      // Select a user
      const johnButton = screen.getByText('John Doe')
      await user.click(johnButton)
      expect(mockOnSelect).toHaveBeenCalledWith({ id: '1', name: 'John Doe' })

      // Clear selection
      const clearButton = screen.getByText('Clear selection')
      await user.click(clearButton)
      expect(mockOnClear).toHaveBeenCalled()
    })

    it('should handle button state transitions', () => {
      const onClick = vi.fn()

      const { rerender } = render(
        <RelationDropdownButton
          currentItem={null}
          relatedModelName="User"
          isOpen={false}
          onClick={onClick}
        />
      )

      expect(screen.getByText('Select user...')).toBeInTheDocument()

      // Select an item
      rerender(
        <RelationDropdownButton
          currentItem={{ id: '1', name: 'John Doe' }}
          relatedModelName="User"
          isOpen={false}
          onClick={onClick}
        />
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Select user...')).not.toBeInTheDocument()

      // Open dropdown
      rerender(
        <RelationDropdownButton
          currentItem={{ id: '1', name: 'John Doe' }}
          relatedModelName="User"
          isOpen={true}
          onClick={onClick}
        />
      )

      const svg = document.querySelector('svg')
      expect(svg).toHaveClass('rotate-180')
    })
  })
})
