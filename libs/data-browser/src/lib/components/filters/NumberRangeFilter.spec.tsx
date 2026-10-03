import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { NumberRangeFilter } from './NumberRangeFilter'

describe('NumberRangeFilter', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  describe('basic rendering', () => {
    it('should render field label', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )
      expect(screen.getByText('Age')).toBeInTheDocument()
    })

    it('should render min and max inputs', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      expect(screen.getByLabelText('Min')).toBeInTheDocument()
      expect(screen.getByLabelText('Max')).toBeInTheDocument()
    })

    it('should render empty inputs when no current value', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min') as HTMLInputElement
      const maxInput = screen.getByLabelText('Max') as HTMLInputElement

      expect(minInput.value).toBe('')
      expect(maxInput.value).toBe('')
    })

    it('should render current values when provided', () => {
      const currentValue = { gte: 18, lte: 65 }

      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min') as HTMLInputElement
      const maxInput = screen.getByLabelText('Max') as HTMLInputElement

      expect(minInput.value).toBe('18')
      expect(maxInput.value).toBe('65')
    })

    it('should show placeholder text', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      expect(screen.getByPlaceholderText('No minimum')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('No maximum')).toBeInTheDocument()
    })
  })

  describe('integer field type', () => {
    it('should have step="1" for int fields', () => {
      render(
        <NumberRangeFilter
          fieldName="count"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      const maxInput = screen.getByLabelText('Max')

      expect(minInput).toHaveAttribute('step', '1')
      expect(maxInput).toHaveAttribute('step', '1')
    })

    it('should have step="1" for bigint fields', () => {
      render(
        <NumberRangeFilter
          fieldName="count"
          fieldType="bigint"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      expect(minInput).toHaveAttribute('step', '1')
    })

    it('should parse integers correctly', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      fireEvent.change(minInput, { target: { value: '25' } })

      expect(mockOnChange).toHaveBeenCalledWith({ gte: 25 })
    })

    it('should handle negative integers', () => {
      render(
        <NumberRangeFilter
          fieldName="temperature"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      fireEvent.change(minInput, { target: { value: '-10' } })

      expect(mockOnChange).toHaveBeenCalledWith({ gte: -10 })
    })

    it('should reject decimal values for int fields', () => {
      render(
        <NumberRangeFilter
          fieldName="count"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      fireEvent.change(minInput, { target: { value: '3.14' } })

      // parseInt should convert 3.14 to 3
      expect(mockOnChange).toHaveBeenCalledWith({ gte: 3 })
    })
  })

  describe('float/decimal field types', () => {
    it('should have step="any" for float fields', () => {
      render(
        <NumberRangeFilter
          fieldName="price"
          fieldType="float"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      expect(minInput).toHaveAttribute('step', 'any')
    })

    it('should have step="any" for decimal fields', () => {
      render(
        <NumberRangeFilter
          fieldName="amount"
          fieldType="decimal"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      expect(minInput).toHaveAttribute('step', 'any')
    })

    it('should parse floats correctly', () => {
      render(
        <NumberRangeFilter
          fieldName="price"
          fieldType="float"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      fireEvent.change(minInput, { target: { value: '19.99' } })

      expect(mockOnChange).toHaveBeenCalledWith({ gte: 19.99 })
    })

    it('should handle decimal values', () => {
      render(
        <NumberRangeFilter
          fieldName="amount"
          fieldType="decimal"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      fireEvent.change(minInput, { target: { value: '100.50' } })

      expect(mockOnChange).toHaveBeenCalledWith({ gte: 100.5 })
    })

    it('should handle very small decimals', () => {
      render(
        <NumberRangeFilter
          fieldName="precision"
          fieldType="float"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      fireEvent.change(minInput, { target: { value: '0.0001' } })

      expect(mockOnChange).toHaveBeenCalledWith({ gte: 0.0001 })
    })
  })

  describe('min value handling', () => {
    it('should call onChange with gte when min is set', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      fireEvent.change(minInput, { target: { value: '18' } })

      expect(mockOnChange).toHaveBeenCalledWith({ gte: 18 })
    })

    it('should preserve lte when setting gte', () => {
      const currentValue = { lte: 100 }

      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      fireEvent.change(minInput, { target: { value: '18' } })

      expect(mockOnChange).toHaveBeenCalledWith({ gte: 18, lte: 100 })
    })

    it('should clear gte when min is cleared', async () => {
      const user = userEvent.setup()
      const currentValue = { gte: 18, lte: 65 }

      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      await user.clear(minInput)

      expect(mockOnChange).toHaveBeenCalledWith({ lte: 65 })
    })

    it('should call onChange with undefined when both values are cleared from min', async () => {
      const user = userEvent.setup()
      const currentValue = { gte: 18 }

      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      await user.clear(minInput)

      expect(mockOnChange).toHaveBeenCalledWith(undefined)
    })

    it('should handle NaN values by clearing gte', () => {
      const currentValue = { gte: 10 }
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      // Number inputs return empty string for invalid values
      fireEvent.change(minInput, { target: { value: '' } })

      expect(mockOnChange).toHaveBeenCalledWith(undefined)
    })
  })

  describe('max value handling', () => {
    it('should call onChange with lte when max is set', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const maxInput = screen.getByLabelText('Max')
      fireEvent.change(maxInput, { target: { value: '65' } })

      expect(mockOnChange).toHaveBeenCalledWith({ lte: 65 })
    })

    it('should preserve gte when setting lte', () => {
      const currentValue = { gte: 18 }

      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const maxInput = screen.getByLabelText('Max')
      fireEvent.change(maxInput, { target: { value: '65' } })

      expect(mockOnChange).toHaveBeenCalledWith({ gte: 18, lte: 65 })
    })

    it('should clear lte when max is cleared', async () => {
      const user = userEvent.setup()
      const currentValue = { gte: 18, lte: 65 }

      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const maxInput = screen.getByLabelText('Max')
      await user.clear(maxInput)

      expect(mockOnChange).toHaveBeenCalledWith({ gte: 18 })
    })

    it('should call onChange with undefined when both values are cleared from max', async () => {
      const user = userEvent.setup()
      const currentValue = { lte: 65 }

      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const maxInput = screen.getByLabelText('Max')
      await user.clear(maxInput)

      expect(mockOnChange).toHaveBeenCalledWith(undefined)
    })
  })

  describe('range display', () => {
    it('should not show range text when no values are set', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      // The range display div should not be rendered
      expect(screen.queryByText(/^\d+ to \d+$/)).not.toBeInTheDocument()
      expect(screen.queryByText(/^≥ \d+$/)).not.toBeInTheDocument()
      expect(screen.queryByText(/^≤ \d+$/)).not.toBeInTheDocument()
    })

    it('should show "min to max" format when both values are set', () => {
      const currentValue = { gte: 18, lte: 65 }

      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      expect(screen.getByText('18 to 65')).toBeInTheDocument()
    })

    it('should show "≥ min" format when only min is set', () => {
      const currentValue = { gte: 18 }

      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      expect(screen.getByText('≥ 18')).toBeInTheDocument()
    })

    it('should show "≤ max" format when only max is set', () => {
      const currentValue = { lte: 65 }

      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      expect(screen.getByText('≤ 65')).toBeInTheDocument()
    })

    it('should display decimal values in range', () => {
      const currentValue = { gte: 19.99, lte: 99.99 }

      render(
        <NumberRangeFilter
          fieldName="price"
          fieldType="float"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      expect(screen.getByText('19.99 to 99.99')).toBeInTheDocument()
    })
  })

  describe('field name formatting', () => {
    it('should format camelCase field names', () => {
      render(
        <NumberRangeFilter
          fieldName="itemCount"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )
      expect(screen.getByText('Item Count')).toBeInTheDocument()
    })

    it('should capitalize first letter of snake_case field names', () => {
      render(
        <NumberRangeFilter
          fieldName="total_amount"
          fieldType="decimal"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )
      expect(screen.getByText('Total_amount')).toBeInTheDocument()
    })

    it('should capitalize first letter of kebab-case field names', () => {
      render(
        <NumberRangeFilter
          fieldName="order-total"
          fieldType="float"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )
      expect(screen.getByText('Order-total')).toBeInTheDocument()
    })
  })

  describe('input ids and labels', () => {
    it('should have correct id for min input', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      expect(minInput).toHaveAttribute('id', 'age-min')
    })

    it('should have correct id for max input', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const maxInput = screen.getByLabelText('Max')
      expect(maxInput).toHaveAttribute('id', 'age-max')
    })
  })

  describe('edge cases', () => {
    it('should handle null currentValue', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={null}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min') as HTMLInputElement
      const maxInput = screen.getByLabelText('Max') as HTMLInputElement

      expect(minInput.value).toBe('')
      expect(maxInput.value).toBe('')
    })

    it('should handle undefined currentValue', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={undefined}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min') as HTMLInputElement
      const maxInput = screen.getByLabelText('Max') as HTMLInputElement

      expect(minInput.value).toBe('')
      expect(maxInput.value).toBe('')
    })

    it('should handle zero values', () => {
      const currentValue = { gte: 0, lte: 0 }

      render(
        <NumberRangeFilter
          fieldName="count"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min') as HTMLInputElement
      const maxInput = screen.getByLabelText('Max') as HTMLInputElement

      expect(minInput.value).toBe('0')
      expect(maxInput.value).toBe('0')
      expect(screen.getByText('0 to 0')).toBeInTheDocument()
    })

    it('should handle very large numbers', () => {
      render(
        <NumberRangeFilter
          fieldName="population"
          fieldType="bigint"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      fireEvent.change(minInput, { target: { value: '1000000000' } })

      expect(mockOnChange).toHaveBeenCalledWith({ gte: 1000000000 })
    })

    it('should handle empty string input', async () => {
      const user = userEvent.setup()
      const currentValue = { gte: 10 }

      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={currentValue}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      await user.clear(minInput)

      expect(mockOnChange).toHaveBeenCalledWith(undefined)
    })
  })

  describe('styling', () => {
    it('should apply correct classes to inputs', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')
      const maxInput = screen.getByLabelText('Max')

      expect(minInput).toHaveClass('border', 'border-gray-300', 'rounded-md')
      expect(maxInput).toHaveClass('border', 'border-gray-300', 'rounded-md')
    })

    it('should have focus styling classes', () => {
      render(
        <NumberRangeFilter
          fieldName="age"
          fieldType="int"
          currentValue={{}}
          onChange={mockOnChange}
        />,
      )

      const minInput = screen.getByLabelText('Min')

      expect(minInput).toHaveClass('focus:ring-1', 'focus:ring-green-web', 'focus:border-green-web')
    })
  })
})
