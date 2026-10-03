import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EnumFilter } from './EnumFilter'

describe('EnumFilter', () => {
  const mockOnChange = vi.fn()
  const enumValues = ['ACTIVE', 'INACTIVE', 'PENDING']

  const defaultProps = {
    fieldName: 'status',
    currentValue: null,
    onChange: mockOnChange,
    enumValues,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with field name label', () => {
    render(<EnumFilter {...defaultProps} />)
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders all enum options plus "All values" option', () => {
    render(<EnumFilter {...defaultProps} />)

    expect(screen.getByRole('option', { name: 'All values' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Active' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Inactive' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Pending' })).toBeInTheDocument()
  })

  it('displays current value when set', () => {
    render(<EnumFilter {...defaultProps} currentValue="ACTIVE" />)

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('ACTIVE')
    expect(screen.getByText('Filtered by: Active')).toBeInTheDocument()
  })

  it('calls onChange with selected value', () => {
    render(<EnumFilter {...defaultProps} />)

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'ACTIVE' } })

    expect(mockOnChange).toHaveBeenCalledWith('ACTIVE')
  })

  it('calls onChange with undefined when "All values" is selected', () => {
    render(<EnumFilter {...defaultProps} currentValue="ACTIVE" />)

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '' } })

    expect(mockOnChange).toHaveBeenCalledWith(undefined)
  })

  it('does not show filter status when no value is selected', () => {
    render(<EnumFilter {...defaultProps} />)

    expect(screen.queryByText(/Filtered by:/)).not.toBeInTheDocument()
  })

  it('formats enum values in options', () => {
    const camelCaseEnums = ['activeStatus', 'inactiveStatus', 'pendingApproval']
    render(<EnumFilter {...defaultProps} enumValues={camelCaseEnums} />)

    expect(screen.getByRole('option', { name: 'Active Status' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Inactive Status' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Pending Approval' })).toBeInTheDocument()
  })
})
