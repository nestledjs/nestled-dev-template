import '../../shared/styles/src/lib/app.css'
import { MemoryRouter } from 'react-router'
import type { Preview } from '@storybook/react'
import { ComponentType } from 'react'

const preview: Preview = {
  decorators: [
    (Story: ComponentType) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export default preview
