import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DataTable } from './data-table'

vi.mock('react-router', () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

describe('DataTable', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('renders rows, sorting, id visibility, clipboard copy, and pagination', () => {
    const setSort = vi.fn()
    const setSkip = vi.fn()

    render(
      <DataTable
        path="/admin/users"
        fields={['id', 'name', 'profile.title']}
        data={[{ id: 'user-1', name: 'Ada', profile: { title: 'Engineer' } }]}
        sort={{ orderBy: 'name', orderDirection: 'asc' }}
        setSort={setSort}
        setSkip={setSkip}
        pagination={{ skip: 20, take: 20, filteredTotal: 50 }}
      />,
    )

    expect(screen.getByRole('link', { name: 'Edit user-1' }).getAttribute('href')).toBe(
      '/admin/users/user-1',
    )
    expect(screen.getByText('Ada')).toBeTruthy()
    expect(screen.getByText('Engineer')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Sort by Name' }))
    expect(setSort).toHaveBeenCalledWith({ orderBy: 'name', orderDirection: 'desc' })

    fireEvent.click(screen.getByRole('button', { name: 'Show ID' }))
    expect(screen.getByText('user-1')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Copy ID' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('user-1')

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(setSkip).toHaveBeenCalledWith(0)
    expect(setSkip).toHaveBeenCalledWith(40)
  })

  it('renders a @dateOnly column on its calendar day and a timestamp locally', () => {
    render(
      <DataTable
        path="/admin/people"
        fields={['id', 'birthDate', 'lastSeenAt', 'mandateNotes']}
        data={[
          {
            id: 'p-1',
            birthDate: '2026-05-16T00:00:00.000Z',
            lastSeenAt: '2026-05-16T12:30:00.000Z',
            mandateNotes: 'pending review',
          },
        ]}
        fieldMeta={{
          birthDate: { type: 'DateTime', documentation: '@dateOnly' },
          lastSeenAt: { type: 'DateTime' },
          mandateNotes: { type: 'String' },
        }}
      />,
    )

    // Midnight UTC must not slide onto the previous day west of UTC.
    expect(screen.getByText('May 16, 2026')).toBeTruthy()

    // A timestamp keeps its time, and text whose NAME contains "date" stays text -- it used to
    // be fed to a date formatter and rendered as the literal string "Invalid Date".
    const instant = new Date('2026-05-16T12:30:00.000Z')
    const localDay = instant.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    const localTime = instant.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    expect(screen.getByText(`${localDay} ${localTime}`)).toBeTruthy()
    expect(screen.getByText('pending review')).toBeTruthy()
    expect(screen.queryByText('Invalid Date')).toBeNull()
  })
})
