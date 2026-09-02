import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { DateRangeFilter } from './DateRangeFilter'

describe('DateRangeFilter', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  describe('basic rendering', () => {
    it('should render field label', () => {
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)
      expect(screen.getByText('Created At')).toBeInTheDocument()
    })

    it('should render from and to date inputs', () => {
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      expect(screen.getByLabelText('From')).toBeInTheDocument()
      expect(screen.getByLabelText('To')).toBeInTheDocument()
    })

    it('should render empty inputs when no current value', () => {
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      const fromInput = screen.getByLabelText('From') as HTMLInputElement
      const toInput = screen.getByLabelText('To') as HTMLInputElement

      expect(fromInput.value).toBe('')
      expect(toInput.value).toBe('')
    })

    it('should render current values when provided', () => {
      const currentValue = {
        gte: '2024-01-01T00:00:00.000Z',
        lte: '2024-01-31T23:59:59.999Z',
      }

      render(
        <DateRangeFilter
          fieldName="createdAt"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const fromInput = screen.getByLabelText('From') as HTMLInputElement
      const toInput = screen.getByLabelText('To') as HTMLInputElement

      expect(fromInput.value).toBe('2024-01-01')
      expect(toInput.value).toBe('2024-01-31')
    })
  })

  describe('from date handling', () => {
    it('should call onChange with gte when from date is set', async () => {
      const user = userEvent.setup()
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      const fromInput = screen.getByLabelText('From')
      await user.type(fromInput, '2024-01-15')

      expect(mockOnChange).toHaveBeenCalledWith({
        gte: expect.stringContaining('2024-01-15'),
      })
    })

    it('should preserve lte when setting gte', async () => {
      const user = userEvent.setup()
      const currentValue = { lte: '2024-01-31T23:59:59.999Z' }

      render(
        <DateRangeFilter
          fieldName="createdAt"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const fromInput = screen.getByLabelText('From')
      await user.type(fromInput, '2024-01-15')

      expect(mockOnChange).toHaveBeenCalledWith({
        gte: expect.stringContaining('2024-01-15'),
        lte: '2024-01-31T23:59:59.999Z',
      })
    })

    it('should clear gte when from date is cleared', async () => {
      const user = userEvent.setup()
      const currentValue = { gte: '2024-01-01T00:00:00.000Z', lte: '2024-01-31T23:59:59.999Z' }

      render(
        <DateRangeFilter
          fieldName="createdAt"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const fromInput = screen.getByLabelText('From')
      await user.clear(fromInput)

      expect(mockOnChange).toHaveBeenCalledWith({
        lte: '2024-01-31T23:59:59.999Z',
      })
    })

    it('should call onChange with undefined when both dates are cleared', async () => {
      const user = userEvent.setup()
      const currentValue = { gte: '2024-01-01T00:00:00.000Z' }

      render(
        <DateRangeFilter
          fieldName="createdAt"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const fromInput = screen.getByLabelText('From')
      await user.clear(fromInput)

      expect(mockOnChange).toHaveBeenCalledWith(undefined)
    })
  })

  describe('to date handling', () => {
    it('should call onChange with lte when to date is set', async () => {
      const user = userEvent.setup()
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      const toInput = screen.getByLabelText('To')
      await user.type(toInput, '2024-01-31')

      expect(mockOnChange).toHaveBeenCalledWith({
        lte: expect.stringContaining('2024-01-31'),
      })
    })

    it('should set to end of day for to date', async () => {
      const user = userEvent.setup()
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      const toInput = screen.getByLabelText('To')
      await user.type(toInput, '2024-01-31')

      const callArg = mockOnChange.mock.calls[0][0]

      // End of the picked day in UTC, the same calendar day the input displays. Asserting the
      // LOCAL getters here passed while the bound was landing on the previous UTC day, because
      // `setHours` makes `getHours()` read 23 whatever day it actually moved the instant to.
      expect(callArg.lte).toBe('2024-01-31T23:59:59.999Z')
    })

    it('should cover the whole of the picked to-day, not just its first hours', async () => {
      const user = userEvent.setup()
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      await user.type(screen.getByLabelText('To'), '2024-01-31')

      // A record late on the picked day must fall inside the range. Deriving the bound with
      // `setHours` truncated it to the local day before, excluding most of 2024-01-31.
      const { lte } = mockOnChange.mock.calls[0][0]
      expect(new Date('2024-01-31T22:00:00.000Z').getTime()).toBeLessThanOrEqual(
        new Date(lte).getTime(),
      )
    })

    it('should round-trip the picked days back into the inputs', async () => {
      const user = userEvent.setup()
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      await user.type(screen.getByLabelText('From'), '2024-01-15')
      const { gte } = mockOnChange.mock.calls[0][0]

      mockOnChange.mockClear()
      await user.type(screen.getByLabelText('To'), '2024-01-31')
      const { lte } = mockOnChange.mock.calls[0][0]

      // The inputs render their value as `new Date(v).toISOString().split('T')[0]`, so both
      // bounds have to sit on the UTC day that was picked or the filter shows a day it did not set.
      expect(new Date(gte).toISOString().split('T')[0]).toBe('2024-01-15')
      expect(new Date(lte).toISOString().split('T')[0]).toBe('2024-01-31')
    })

    it('should preserve gte when setting lte', async () => {
      const user = userEvent.setup()
      const currentValue = { gte: '2024-01-01T00:00:00.000Z' }

      render(
        <DateRangeFilter
          fieldName="createdAt"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const toInput = screen.getByLabelText('To')
      await user.type(toInput, '2024-01-31')

      expect(mockOnChange).toHaveBeenCalledWith({
        gte: '2024-01-01T00:00:00.000Z',
        lte: expect.stringContaining('2024-01-31'),
      })
    })

    it('should clear lte when to date is cleared', async () => {
      const user = userEvent.setup()
      const currentValue = { gte: '2024-01-01T00:00:00.000Z', lte: '2024-01-31T23:59:59.999Z' }

      render(
        <DateRangeFilter
          fieldName="createdAt"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const toInput = screen.getByLabelText('To')
      await user.clear(toInput)

      expect(mockOnChange).toHaveBeenCalledWith({
        gte: '2024-01-01T00:00:00.000Z',
      })
    })
  })

  describe('range display', () => {
    it('should not show range text when no dates are set', () => {
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      // The range display div should not be rendered
      expect(screen.queryByText(/^\d{4}-\d{2}-\d{2} to \d{4}-\d{2}-\d{2}$/)).not.toBeInTheDocument()
      expect(screen.queryByText(/^From \d{4}-\d{2}-\d{2}$/)).not.toBeInTheDocument()
      expect(screen.queryByText(/^Until \d{4}-\d{2}-\d{2}$/)).not.toBeInTheDocument()
    })

    it('should show "from to" format when both dates are set', () => {
      const currentValue = {
        gte: '2024-01-01T00:00:00.000Z',
        lte: '2024-01-31T23:59:59.999Z',
      }

      render(
        <DateRangeFilter
          fieldName="createdAt"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      expect(screen.getByText('2024-01-01 to 2024-01-31')).toBeInTheDocument()
    })

    it('should show "From" format when only from date is set', () => {
      const currentValue = { gte: '2024-01-01T00:00:00.000Z' }

      render(
        <DateRangeFilter
          fieldName="createdAt"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      expect(screen.getByText('From 2024-01-01')).toBeInTheDocument()
    })

    it('should show "Until" format when only to date is set', () => {
      const currentValue = { lte: '2024-01-31T23:59:59.999Z' }

      render(
        <DateRangeFilter
          fieldName="createdAt"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      expect(screen.getByText('Until 2024-01-31')).toBeInTheDocument()
    })
  })

  describe('field name formatting', () => {
    it('should format camelCase field names', () => {
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)
      expect(screen.getByText('Created At')).toBeInTheDocument()
    })

    it('should capitalize first letter of snake_case field names', () => {
      render(<DateRangeFilter fieldName="updated_at" currentValue={{}} onChange={mockOnChange} />)
      expect(screen.getByText('Updated_at')).toBeInTheDocument()
    })

    it('should capitalize first letter of kebab-case field names', () => {
      render(
        <DateRangeFilter fieldName="last-modified" currentValue={{}} onChange={mockOnChange} />,
      )
      expect(screen.getByText('Last-modified')).toBeInTheDocument()
    })
  })

  describe('input ids and labels', () => {
    it('should have correct id for from input', () => {
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      const fromInput = screen.getByLabelText('From')
      expect(fromInput).toHaveAttribute('id', 'createdAt-from')
    })

    it('should have correct id for to input', () => {
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      const toInput = screen.getByLabelText('To')
      expect(toInput).toHaveAttribute('id', 'createdAt-to')
    })
  })

  describe('edge cases', () => {
    it('should handle null currentValue', () => {
      render(<DateRangeFilter fieldName="createdAt" currentValue={null} onChange={mockOnChange} />)

      const fromInput = screen.getByLabelText('From') as HTMLInputElement
      const toInput = screen.getByLabelText('To') as HTMLInputElement

      expect(fromInput.value).toBe('')
      expect(toInput.value).toBe('')
    })

    it('should handle undefined currentValue', () => {
      render(
        <DateRangeFilter fieldName="createdAt" currentValue={undefined} onChange={mockOnChange} />,
      )

      const fromInput = screen.getByLabelText('From') as HTMLInputElement
      const toInput = screen.getByLabelText('To') as HTMLInputElement

      expect(fromInput.value).toBe('')
      expect(toInput.value).toBe('')
    })

    it('should handle date strings without time component', () => {
      const currentValue = {
        gte: '2024-01-01',
        lte: '2024-01-31',
      }

      render(
        <DateRangeFilter
          fieldName="createdAt"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const fromInput = screen.getByLabelText('From') as HTMLInputElement
      const toInput = screen.getByLabelText('To') as HTMLInputElement

      expect(fromInput.value).toBe('2024-01-01')
      expect(toInput.value).toBe('2024-01-31')
    })
  })

  describe('styling', () => {
    it('should apply correct classes to inputs', () => {
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      const fromInput = screen.getByLabelText('From')
      const toInput = screen.getByLabelText('To')

      expect(fromInput).toHaveClass('border', 'border-gray-300', 'rounded-md')
      expect(toInput).toHaveClass('border', 'border-gray-300', 'rounded-md')
    })

    it('should have focus styling classes', () => {
      render(<DateRangeFilter fieldName="createdAt" currentValue={{}} onChange={mockOnChange} />)

      const fromInput = screen.getByLabelText('From')

      expect(fromInput).toHaveClass(
        'focus:ring-1',
        'focus:ring-green-web',
        'focus:border-green-web',
      )
    })
  })
})
