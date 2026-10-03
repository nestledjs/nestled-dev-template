import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ExportButton } from './ExportButton'

const runQuery = vi.fn()

vi.mock('@apollo/client/react', () => ({
  useLazyQuery: () => [runQuery],
}))

describe('ExportButton', () => {
  const createObjectURL = vi.fn(() => 'blob:csv')
  const revokeObjectURL = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL })
  })

  function renderButton() {
    return render(
      <ExportButton
        query={{}}
        dataPath="users"
        variables={{ input: { search: 'ada', filters: { role: 'ADMIN' }, orderBy: 'name' } }}
        visibleColumns={['id', 'name']}
        fieldNames={['id', 'name', 'email']}
        modelName="users"
        hasActiveFilters
      />,
    )
  }

  it('exports all records with all columns', async () => {
    runQuery.mockResolvedValue({
      data: {
        users: [
          { id: '1', name: 'Ada', email: 'ada@example.com' },
          { id: '2', name: 'Grace, Hopper', email: 'grace@example.com' },
        ],
      },
    })
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    renderButton()
    fireEvent.click(screen.getByRole('button', { name: 'Export' }))
    fireEvent.click(screen.getByRole('button', { name: 'Download (3 columns)' }))

    await waitFor(() =>
      expect(runQuery).toHaveBeenCalledWith({
        variables: { input: { take: 50000, skip: 0, orderBy: 'id', orderDirection: 'desc' } },
      }),
    )
    expect(clickSpy).toHaveBeenCalled()
    expect(createObjectURL.mock.calls[0][0]).toBeInstanceOf(Blob)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:csv')
    clickSpy.mockRestore()
  })

  it('exports filtered records with visible columns and fallback data path discovery', async () => {
    runQuery.mockResolvedValue({
      data: {
        otherUsers: [{ id: '1', name: 'Ada', email: 'ada@example.com' }],
      },
    })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    renderButton()
    fireEvent.click(screen.getByRole('button', { name: 'Export' }))

    expect(screen.getByText('1 filter active')).toBeInTheDocument()
    expect(screen.getByText('Search: "ada"')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Download' }))

    await waitFor(() =>
      expect(runQuery).toHaveBeenCalledWith({
        variables: {
          input: {
            search: 'ada',
            filters: { role: 'ADMIN' },
            orderBy: 'name',
            take: 50000,
            skip: 0,
          },
        },
      }),
    )
  })

  it('shows query errors and closes the menu from the backdrop', async () => {
    runQuery.mockResolvedValue({ data: {}, error: new Error('Query failed') })

    renderButton()
    fireEvent.click(screen.getByRole('button', { name: 'Export' }))
    fireEvent.click(screen.getByRole('button', { name: 'Download' }))

    expect(await screen.findByText('Query failed')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close export menu' }))
    expect(screen.queryByText('Export as CSV')).not.toBeInTheDocument()
  })
})
