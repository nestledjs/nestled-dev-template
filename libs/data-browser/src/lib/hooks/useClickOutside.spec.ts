import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useClickOutside } from './useClickOutside'
import { createRef } from 'react'

describe('useClickOutside', () => {
  let container: HTMLDivElement
  let innerElement: HTMLDivElement

  beforeEach(() => {
    // Create DOM structure for testing
    container = document.createElement('div')
    innerElement = document.createElement('div')
    container.appendChild(innerElement)
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe('basic click detection', () => {
    it('should call handler when clicking outside the ref element', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      // Manually assign the ref
      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, handler, true))

      // Click outside the element
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)

      outsideElement.remove()
    })

    it('should not call handler when clicking inside the ref element', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, handler, true))

      // Click inside the element
      innerElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()
    })

    it('should not call handler when clicking on the ref element itself', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: container,
      })

      renderHook(() => useClickOutside(ref, handler, true))

      // Click on the element itself
      container.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('isActive parameter', () => {
    it('should not call handler when isActive is false', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, handler, false))

      // Click outside
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()

      outsideElement.remove()
    })

    it('should call handler when isActive is true', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, handler, true))

      // Click outside
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)

      outsideElement.remove()
    })

    it('should toggle behavior when isActive changes', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      const { rerender } = renderHook(
        ({ isActive }) => useClickOutside(ref, handler, isActive),
        { initialProps: { isActive: false } },
      )

      // Click outside while inactive
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()

      // Activate
      rerender({ isActive: true })

      // Click outside while active
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)

      outsideElement.remove()
    })

    it('should default to active when isActive is not provided', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, handler))

      // Click outside
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)

      outsideElement.remove()
    })
  })

  describe('null ref handling', () => {
    it('should not call handler when ref.current is null', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      // ref.current is null by default
      renderHook(() => useClickOutside(ref, handler, true))

      // Click anywhere
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()
    })

    it('should handle ref becoming null', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, handler, true))

      // Set ref to null
      Object.defineProperty(ref, 'current', {
        writable: true,
        value: null,
      })

      // Click outside
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      // Should not call handler since ref is null
      expect(handler).not.toHaveBeenCalled()

      outsideElement.remove()
    })
  })

  describe('event cleanup', () => {
    it('should cleanup event listener on unmount', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      const { unmount } = renderHook(() => useClickOutside(ref, handler, true))

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    })

    it('should not call handler after unmount', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      const { unmount } = renderHook(() => useClickOutside(ref, handler, true))

      unmount()

      // Try to click outside after unmount
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()

      outsideElement.remove()
    })

    it('should cleanup and re-add listener when isActive changes', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      const { rerender } = renderHook(
        ({ isActive }) => useClickOutside(ref, handler, isActive),
        { initialProps: { isActive: true } },
      )

      const initialCallCount = addEventListenerSpy.mock.calls.length

      // Change isActive
      rerender({ isActive: false })

      expect(removeEventListenerSpy).toHaveBeenCalled()

      // Change back
      rerender({ isActive: true })

      expect(addEventListenerSpy.mock.calls.length).toBeGreaterThan(initialCallCount)
    })
  })

  describe('handler updates', () => {
    it('should use the latest handler function', () => {
      const ref = createRef<HTMLDivElement>()
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      const { rerender } = renderHook(
        ({ handler }) => useClickOutside(ref, handler, true),
        { initialProps: { handler: handler1 } },
      )

      // Update handler
      rerender({ handler: handler2 })

      // Click outside
      const outsideElement = document.createElement('div')
      document.body.appendChild(outsideElement)
      outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler1).not.toHaveBeenCalled()
      expect(handler2).toHaveBeenCalledTimes(1)

      outsideElement.remove()
    })
  })

  describe('nested elements', () => {
    it('should not call handler when clicking on nested children', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      const nested = document.createElement('div')
      const deepNested = document.createElement('span')
      nested.appendChild(deepNested)
      innerElement.appendChild(nested)

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, handler, true))

      // Click on deeply nested element
      deepNested.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).not.toHaveBeenCalled()
    })

    it('should call handler when clicking on sibling elements', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      const sibling = document.createElement('div')
      container.appendChild(sibling)

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, handler, true))

      // Click on sibling
      sibling.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should call handler when clicking on parent elements', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, handler, true))

      // Click on parent container
      container.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('common use cases', () => {
    it('should work for dropdown menus', () => {
      const ref = createRef<HTMLDivElement>()
      const closeDropdown = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, closeDropdown, true))

      // Click inside dropdown
      innerElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      expect(closeDropdown).not.toHaveBeenCalled()

      // Click outside dropdown
      const outside = document.createElement('div')
      document.body.appendChild(outside)
      outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      expect(closeDropdown).toHaveBeenCalledTimes(1)

      outside.remove()
    })

    it('should work for modal dialogs', () => {
      const ref = createRef<HTMLDivElement>()
      const closeModal = vi.fn()

      const modalContent = document.createElement('div')
      const modalOverlay = document.createElement('div')
      modalContent.appendChild(innerElement)
      document.body.appendChild(modalOverlay)
      document.body.appendChild(modalContent)

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: modalContent,
      })

      renderHook(() => useClickOutside(ref, closeModal, true))

      // Click inside modal content
      innerElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      expect(closeModal).not.toHaveBeenCalled()

      // Click on overlay (outside modal content)
      modalOverlay.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      expect(closeModal).toHaveBeenCalledTimes(1)

      modalOverlay.remove()
      modalContent.remove()
    })

    it('should work for context menus', () => {
      const ref = createRef<HTMLDivElement>()
      const closeContextMenu = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      const { rerender } = renderHook(
        ({ isOpen }) => useClickOutside(ref, closeContextMenu, isOpen),
        { initialProps: { isOpen: false } },
      )

      // Open context menu
      rerender({ isOpen: true })

      // Click outside
      const outside = document.createElement('div')
      document.body.appendChild(outside)
      outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      expect(closeContextMenu).toHaveBeenCalledTimes(1)

      outside.remove()
    })
  })

  describe('edge cases', () => {
    it('should handle rapid clicks', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, handler, true))

      const outside = document.createElement('div')
      document.body.appendChild(outside)

      // Rapid clicks
      outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(3)

      outside.remove()
    })

    it('should handle clicks on dynamically added elements', () => {
      const ref = createRef<HTMLDivElement>()
      const handler = vi.fn()

      Object.defineProperty(ref, 'current', {
        writable: true,
        value: innerElement,
      })

      renderHook(() => useClickOutside(ref, handler, true))

      // Dynamically add element
      const dynamic = document.createElement('div')
      document.body.appendChild(dynamic)

      dynamic.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)

      dynamic.remove()
    })
  })
})
