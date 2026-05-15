import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { RelationFilterField } from './RelationFilterField'

// Mock the hooks
vi.mock('../../hooks/useClickOutside', () => ({
  useClickOutside: vi.fn(),
}))

vi.mock('../../hooks/useRelationData', () => ({
  useRelationData: vi.fn(),
}))

import { useClickOutside } from '../../hooks/useClickOutside'
import { useRelationData } from '../../hooks/useRelationData'

const mockUseClickOutside = useClickOutside as ReturnType<typeof vi.fn>
const mockUseRelationData = useRelationData as ReturnType<typeof vi.fn>

describe('RelationFilterField', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
    mockUseClickOutside.mockClear()

    // Default mock implementation for useRelationData
    mockUseRelationData.mockReturnValue({
      relatedItems: [],
      loading: false,
      error: null,
      hasDocument: true,
    })
  })

  describe('basic rendering with GraphQL document', () => {
    it('should render field label', () => {
      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText('User Id')).toBeInTheDocument()
    })

    it('should render dropdown button', () => {
      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText('Select user...')).toBeInTheDocument()
    })

    it('should show current item when value is set', () => {
      const currentValue = { id: '1' }
      const relatedItems = [{ id: '1', name: 'John Doe' }]

      mockUseRelationData.mockReturnValue({
        relatedItems,
        loading: false,
        error: null,
        hasDocument: true,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={currentValue}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should not show dropdown content when closed', () => {
      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      expect(screen.queryByPlaceholderText('Search user...')).not.toBeInTheDocument()
    })
  })

  describe('dropdown toggle behavior', () => {
    it('should show dropdown content when button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      const button = screen.getByText('Select user...')
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search user...')).toBeInTheDocument()
      })
    })

    it('should hide dropdown when button is clicked again', async () => {
      const user = userEvent.setup()

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      const button = screen.getByText('Select user...')

      // Open
      await user.click(button)
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search user...')).toBeInTheDocument()
      })

      // Close
      await user.click(button)
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Search user...')).not.toBeInTheDocument()
      })
    })

    it('should reset search term when opening dropdown', async () => {
      const user = userEvent.setup()

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      const button = screen.getByText('Select user...')
      await user.click(button)

      // Type in search
      const searchInput = await screen.findByPlaceholderText('Search user...')
      await user.type(searchInput, 'test')

      // Close dropdown
      await user.click(button)

      // Open again - search should be reset
      await user.click(button)
      const newSearchInput = await screen.findByPlaceholderText('Search user...')
      expect((newSearchInput as HTMLInputElement).value).toBe('')
    })
  })

  describe('item selection', () => {
    it('should call onChange with item id when item is selected', async () => {
      const user = userEvent.setup()
      const relatedItems = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
      ]

      mockUseRelationData.mockReturnValue({
        relatedItems,
        loading: false,
        error: null,
        hasDocument: true,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      // Open dropdown
      const button = screen.getByText('Select user...')
      await user.click(button)

      // Select item
      const item = await screen.findByText('John Doe')
      await user.click(item)

      expect(mockOnChange).toHaveBeenCalledWith({ id: '1' })
    })

    it('should close dropdown after item selection', async () => {
      const user = userEvent.setup()
      const relatedItems = [{ id: '1', name: 'John Doe' }]

      mockUseRelationData.mockReturnValue({
        relatedItems,
        loading: false,
        error: null,
        hasDocument: true,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      // Open dropdown
      const button = screen.getByText('Select user...')
      await user.click(button)

      // Select item
      const item = await screen.findByText('John Doe')
      await user.click(item)

      // Dropdown should close
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Search user...')).not.toBeInTheDocument()
      })
    })

    it('should reset search term after item selection', async () => {
      const user = userEvent.setup()
      const relatedItems = [{ id: '1', name: 'John Doe' }]

      mockUseRelationData.mockReturnValue({
        relatedItems,
        loading: false,
        error: null,
        hasDocument: true,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      // Open dropdown
      const button = screen.getByText('Select user...')
      await user.click(button)

      // Type in search
      const searchInput = await screen.findByPlaceholderText('Search user...')
      await user.type(searchInput, 'test')

      // Select item
      const item = await screen.findByText('John Doe')
      await user.click(item)

      // Open again - search should be reset
      await user.click(button)
      const newSearchInput = await screen.findByPlaceholderText('Search user...')
      expect((newSearchInput as HTMLInputElement).value).toBe('')
    })
  })

  describe('clear selection', () => {
    it('should call onChange with undefined when clear is clicked', async () => {
      const user = userEvent.setup()

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={{ id: '1' }}
          onChange={mockOnChange}
        />
      )

      // Open dropdown
      const button = screen.getByRole('button')
      await user.click(button)

      // Click clear
      const clearButton = await screen.findByText('Clear selection')
      await user.click(clearButton)

      expect(mockOnChange).toHaveBeenCalledWith(undefined)
    })

    it('should close dropdown after clearing', async () => {
      const user = userEvent.setup()

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={{ id: '1' }}
          onChange={mockOnChange}
        />
      )

      // Open dropdown
      const button = screen.getByRole('button')
      await user.click(button)

      // Click clear
      const clearButton = await screen.findByText('Clear selection')
      await user.click(clearButton)

      // Dropdown should close
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Search user...')).not.toBeInTheDocument()
      })
    })

    it('should reset search term after clearing', async () => {
      const user = userEvent.setup()

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={{ id: '1' }}
          onChange={mockOnChange}
        />
      )

      // Open dropdown
      const button = screen.getByRole('button')
      await user.click(button)

      // Type in search
      const searchInput = await screen.findByPlaceholderText('Search user...')
      await user.type(searchInput, 'test')

      // Click clear
      const clearButton = await screen.findByText('Clear selection')
      await user.click(clearButton)

      // Open again - search should be reset
      await user.click(button)
      const newSearchInput = await screen.findByPlaceholderText('Search user...')
      expect((newSearchInput as HTMLInputElement).value).toBe('')
    })
  })

  describe('search functionality', () => {
    it('should update search term when typing', async () => {
      const user = userEvent.setup()

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      // Open dropdown
      const button = screen.getByText('Select user...')
      await user.click(button)

      // Type in search
      const searchInput = await screen.findByPlaceholderText('Search user...')
      await user.type(searchInput, 'John')

      expect((searchInput as HTMLInputElement).value).toBe('John')
    })

    it('should pass search term to useRelationData when dropdown is open', async () => {
      const user = userEvent.setup()

      const { rerender } = render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      // Initially closed - should pass empty string and false
      expect(mockUseRelationData).toHaveBeenCalledWith('User', '', false, undefined)

      // Open dropdown
      const button = screen.getByText('Select user...')
      await user.click(button)

      // Force rerender to trigger hook call
      rerender(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      // Should pass true for isOpen
      await waitFor(() => {
        const calls = mockUseRelationData.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[2]).toBe(true) // isOpen parameter
      })
    })
  })

  describe('loading and error states', () => {
    it('should show loading state in dropdown', async () => {
      const user = userEvent.setup()
      mockUseRelationData.mockReturnValue({
        relatedItems: [],
        loading: true,
        error: null,
        hasDocument: true,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      // Open dropdown
      const button = screen.getByText('Select user...')
      await user.click(button)

      expect(await screen.findByText('Loading...')).toBeInTheDocument()
    })

    it('should show error state in dropdown', async () => {
      const user = userEvent.setup()
      mockUseRelationData.mockReturnValue({
        relatedItems: [],
        loading: false,
        error: { message: 'Failed to load' },
        hasDocument: true,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      // Open dropdown
      const button = screen.getByText('Select user...')
      await user.click(button)

      expect(await screen.findByText('Failed to load options')).toBeInTheDocument()
    })

    it('should show "No items found" when items array is empty', async () => {
      const user = userEvent.setup()
      mockUseRelationData.mockReturnValue({
        relatedItems: [],
        loading: false,
        error: null,
        hasDocument: true,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      // Open dropdown
      const button = screen.getByText('Select user...')
      await user.click(button)

      expect(await screen.findByText('No items found')).toBeInTheDocument()
    })
  })

  describe('fallback to text input when no document', () => {
    it('should render text input when hasDocument is false', () => {
      mockUseRelationData.mockReturnValue({
        relatedItems: [],
        loading: false,
        error: null,
        hasDocument: false,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByPlaceholderText('Enter ID...')).toBeInTheDocument()
      expect(screen.queryByText('Select user...')).not.toBeInTheDocument()
    })

    it('should show label with "ID" suffix for text input fallback', () => {
      mockUseRelationData.mockReturnValue({
        relatedItems: [],
        loading: false,
        error: null,
        hasDocument: false,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText('User Id ID')).toBeInTheDocument()
    })

    it('should display current value ID in text input', () => {
      mockUseRelationData.mockReturnValue({
        relatedItems: [],
        loading: false,
        error: null,
        hasDocument: false,
      })

      const currentValue = { id: 'abc-123' }

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={currentValue}
          onChange={mockOnChange}
        />
      )

      const input = screen.getByPlaceholderText('Enter ID...') as HTMLInputElement
      expect(input.value).toBe('abc-123')
    })

    it('should call onChange with ID object when text is entered', async () => {
      mockUseRelationData.mockReturnValue({
        relatedItems: [],
        loading: false,
        error: null,
        hasDocument: false,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      const input = screen.getByPlaceholderText('Enter ID...')
      fireEvent.change(input, { target: { value: 'test-id-123' } })

      expect(mockOnChange).toHaveBeenCalledWith({ id: 'test-id-123' })
    })

    it('should call onChange with undefined when text input is cleared', async () => {
      const user = userEvent.setup()
      mockUseRelationData.mockReturnValue({
        relatedItems: [],
        loading: false,
        error: null,
        hasDocument: false,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={{ id: 'test' }}
          onChange={mockOnChange}
        />
      )

      const input = screen.getByPlaceholderText('Enter ID...')
      await user.clear(input)

      expect(mockOnChange).toHaveBeenCalledWith(undefined)
    })
  })

  describe('useClickOutside integration', () => {
    it('should call useClickOutside with ref and handler', () => {
      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      expect(mockUseClickOutside).toHaveBeenCalled()

      const calls = mockUseClickOutside.mock.calls[0]
      expect(calls[0]).toBeDefined() // ref
      expect(typeof calls[1]).toBe('function') // handler
      expect(calls[2]).toBe(false) // isActive (initially closed)
    })

    it('should pass isActive=true to useClickOutside when dropdown is open', async () => {
      const user = userEvent.setup()

      const { rerender } = render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      // Open dropdown
      const button = screen.getByText('Select user...')
      await user.click(button)

      // Force rerender
      rerender(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      // Check last call to useClickOutside
      await waitFor(() => {
        const calls = mockUseClickOutside.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[2]).toBe(true) // isActive should be true
      })
    })
  })

  describe('useRelationData integration', () => {
    it('should pass current value ID to useRelationData', () => {
      const currentValue = { id: '123' }

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={currentValue}
          onChange={mockOnChange}
        />
      )

      expect(mockUseRelationData).toHaveBeenCalledWith('User', '', false, '123')
    })

    it('should pass undefined to useRelationData when no current value', () => {
      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      expect(mockUseRelationData).toHaveBeenCalledWith('User', '', false, undefined)
    })

    it('should find and display current item from relatedItems', () => {
      const currentValue = { id: '2' }
      const relatedItems = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Bob Johnson' },
      ]

      mockUseRelationData.mockReturnValue({
        relatedItems,
        loading: false,
        error: null,
        hasDocument: true,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={currentValue}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('should handle case when current value ID is not in relatedItems', () => {
      const currentValue = { id: '999' }
      const relatedItems = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
      ]

      mockUseRelationData.mockReturnValue({
        relatedItems,
        loading: false,
        error: null,
        hasDocument: true,
      })

      render(
        <RelationFilterField
          fieldName="userId"
          relatedModelName="User"
          currentValue={currentValue}
          onChange={mockOnChange}
        />
      )

      // Should still show placeholder since item not found
      expect(screen.getByText('Select user...')).toBeInTheDocument()
    })
  })

  describe('field name formatting', () => {
    it('should format camelCase field names', () => {
      render(
        <RelationFilterField
          fieldName="organizationId"
          relatedModelName="Organization"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText('Organization Id')).toBeInTheDocument()
    })

    it('should capitalize first letter of snake_case field names', () => {
      mockUseRelationData.mockReturnValue({
        relatedItems: [],
        loading: false,
        error: null,
        hasDocument: false,
      })

      render(
        <RelationFilterField
          fieldName="user_id"
          relatedModelName="User"
          currentValue={null}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText('User_id ID')).toBeInTheDocument()
    })
  })
})
