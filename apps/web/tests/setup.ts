import '@testing-library/jest-dom/vitest'
import './mocks/sdk'

// jsdom lacks ResizeObserver, which Headless UI's floating components
// (Combobox/Listbox/Menu panels) reference when they open. Provide a no-op
// stub so those components can be tested.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
