import { render } from '@testing-library/react'
import { useEffect } from 'react'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// tests/setup.ts unmounts rendered trees before a spec's own vi.unstubAllGlobals() runs. Without
// it, the spec's afterEach unstubs first and the unmount below meets the real (absent) global.

declare global {
  // eslint-disable-next-line no-var
  var teardownProbe: { name: string } | undefined
}

const seenOnUnmount: Array<string | undefined> = []

function UsesStubbedGlobal() {
  useEffect(() => () => void seenOnUnmount.push(globalThis.teardownProbe?.name), [])
  return <p>mounted</p>
}

describe('teardown order for a spec that unstubs globals in afterEach', () => {
  beforeEach(() => {
    vi.stubGlobal('teardownProbe', { name: 'stub' })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  afterAll(() => {
    expect(seenOnUnmount).toEqual(['stub', 'stub'])
    expect(globalThis.teardownProbe).toBeUndefined()
  })

  it('renders a component that reads a stubbed global when it unmounts', () => {
    render(<UsesStubbedGlobal />)
    expect(globalThis.teardownProbe).toEqual({ name: 'stub' })
  })

  it('renders it again', () => {
    render(<UsesStubbedGlobal />)
    expect(globalThis.teardownProbe).toEqual({ name: 'stub' })
  })
})
