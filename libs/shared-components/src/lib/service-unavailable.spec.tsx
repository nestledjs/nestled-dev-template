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

  it('stays readable in dark mode: the title, icon and message have dark-mode text colours', () => {
    render(<ServiceUnavailable title="Down" message="Retrying automatically." />)

    const heading = screen.getByRole('heading', { name: 'Down' })
    // The title and icon inherit the container's colour; the message sets its own.
    const container = heading.parentElement as HTMLElement
    expect(container.className).toContain('dark:text-gray-100')
    expect(screen.getByText('Retrying automatically.').className).toContain('dark:text-gray-300')
  })
})
