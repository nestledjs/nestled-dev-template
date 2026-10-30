import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ServiceUnavailable } from './service-unavailable'

describe('ServiceUnavailable', () => {
  it('keeps "Refresh Page" as the button label by default', () => {
    render(<ServiceUnavailable />)

    expect(screen.getByRole('button', { name: 'Refresh Page' })).toBeTruthy()
  })

  it('uses refreshLabel for the button when given', () => {
    const onRefresh = vi.fn()
    render(<ServiceUnavailable refreshLabel="Try again" onRefresh={onRefresh} />)

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Refresh Page')).toBeNull()
  })

  it('renders no button when showRefreshButton is false', () => {
    render(<ServiceUnavailable showRefreshButton={false} refreshLabel="Try again" />)

    expect(screen.queryByRole('button')).toBeNull()
  })
})
