import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundaryUi } from './error-boundary-ui'

describe('ErrorBoundaryUi', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  it('renders plain errors with stack details', () => {
    const error = new Error('Simple failure')
    error.stack = 'stack trace'

    render(<ErrorBoundaryUi error={error} />)

    expect(screen.getByText('Something went wrong')).toBeTruthy()
    expect(screen.getAllByText('Simple failure')).toHaveLength(2)
    expect(screen.getByText('Stack trace')).toBeTruthy()
  })

  it('pretty prints aggregate errors and embedded JSON messages', () => {
    const error = Object.assign(new Error('invocation: { foo: "bar" } done'), {
      errors: [
        Object.assign(new Error('{"message":"Nested"}'), { code: 'BAD_USER_INPUT' }),
        'string child',
      ],
    })

    render(<ErrorBoundaryUi error={error} />)

    expect(screen.getByText(/invocation:/)).toBeTruthy()
    expect(screen.getByText(/BAD_USER_INPUT/)).toBeTruthy()
    expect(screen.getByText('string child')).toBeTruthy()
  })
})
