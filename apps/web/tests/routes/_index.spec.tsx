import React from 'react'
import { render } from '@testing-library/react'
import { createRoutesStub } from 'react-router'
import App from '../../app/app'

describe('App Component', () => {
  test('renders without crashing when no meQueryRef provided', () => {
    const ReactRouterStub = createRoutesStub([
      {
        path: '/',
        Component: App,
        loader: () => ({ meQueryRef: null })
      },
    ])

    expect(() => render(<ReactRouterStub />)).not.toThrow()
  })

  test('renders without crashing when meQueryRef is undefined', () => {
    const ReactRouterStub = createRoutesStub([
      {
        path: '/',
        Component: App,
        loader: () => ({})
      },
    ])

    expect(() => render(<ReactRouterStub />)).not.toThrow()
  })
})
