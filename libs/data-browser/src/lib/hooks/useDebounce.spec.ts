import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDebounce } from './useDebounce'

// Helper to wait for a specific time
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('useDebounce', () => {
  describe('basic debouncing behavior', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('test', 50))
      expect(result.current).toBe('test')
    })

    it('should debounce string value updates', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'initial', delay: 50 },
      })

      expect(result.current).toBe('initial')

      // Update value
      rerender({ value: 'updated', delay: 50 })

      // Value should not change immediately
      expect(result.current).toBe('initial')

      // Wait for debounce
      await waitFor(() => {
        expect(result.current).toBe('updated')
      })
    })

    it('should debounce number value updates', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 0, delay: 50 },
      })

      expect(result.current).toBe(0)

      rerender({ value: 42, delay: 50 })
      expect(result.current).toBe(0)

      await waitFor(() => {
        expect(result.current).toBe(42)
      })
    })

    it('should debounce object value updates', async () => {
      const initialObj = { name: 'John' }
      const updatedObj = { name: 'Jane' }

      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: initialObj, delay: 50 },
      })

      expect(result.current).toBe(initialObj)

      rerender({ value: updatedObj, delay: 50 })
      expect(result.current).toBe(initialObj)

      await waitFor(() => {
        expect(result.current).toBe(updatedObj)
      })
    })

    it('should debounce array value updates', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: [1, 2, 3], delay: 50 },
      })

      expect(result.current).toEqual([1, 2, 3])

      rerender({ value: [4, 5, 6], delay: 50 })
      expect(result.current).toEqual([1, 2, 3])

      await waitFor(() => {
        expect(result.current).toEqual([4, 5, 6])
      })
    })

    it('should debounce boolean value updates', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: true, delay: 50 },
      })

      expect(result.current).toBe(true)

      rerender({ value: false, delay: 50 })
      expect(result.current).toBe(true)

      await waitFor(() => {
        expect(result.current).toBe(false)
      })
    })
  })

  describe('rapid value changes', () => {
    it('should only apply the last value when rapidly changing', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'initial', delay: 100 },
      })

      // Rapidly change values
      rerender({ value: 'change1', delay: 100 })
      await wait(20)

      rerender({ value: 'change2', delay: 100 })
      await wait(20)

      rerender({ value: 'change3', delay: 100 })
      await wait(20)

      rerender({ value: 'final', delay: 100 })

      // Should still have initial value
      expect(result.current).toBe('initial')

      // Wait for debounce to complete
      await waitFor(() => {
        expect(result.current).toBe('final')
      })
    })

    it('should cancel previous timers on rapid updates', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 1, delay: 100 },
      })

      expect(result.current).toBe(1)

      // Update and wait partway
      rerender({ value: 2, delay: 100 })
      await wait(80)

      // Update again before first completes
      rerender({ value: 3, delay: 100 })
      await wait(80)

      // Should still have original value
      expect(result.current).toBe(1)

      // Wait for final debounce
      await waitFor(() => {
        expect(result.current).toBe(3)
      })
    })
  })

  describe('delay variations', () => {
    it('should handle zero delay', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'initial', delay: 0 },
      })

      expect(result.current).toBe('initial')

      rerender({ value: 'updated', delay: 0 })

      await waitFor(() => {
        expect(result.current).toBe('updated')
      })
    })

    it('should handle very short delays', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'initial', delay: 1 },
      })

      rerender({ value: 'updated', delay: 1 })

      await waitFor(() => {
        expect(result.current).toBe('updated')
      })
    })

    it('should handle longer delays', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'initial', delay: 200 },
      })

      rerender({ value: 'updated', delay: 200 })

      // Should not update immediately
      await wait(150)
      expect(result.current).toBe('initial')

      // Should update after full delay
      await waitFor(() => {
        expect(result.current).toBe('updated')
      })
    })

    it('should respect delay changes', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'initial', delay: 100 },
      })

      // Update with shorter delay
      rerender({ value: 'updated', delay: 50 })

      await waitFor(() => {
        expect(result.current).toBe('updated')
      })
    })
  })

  describe('null and undefined values', () => {
    it('should handle null values', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'test' as string | null, delay: 50 },
      })

      rerender({ value: null, delay: 50 })

      await waitFor(() => {
        expect(result.current).toBe(null)
      })
    })

    it('should handle undefined values', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'test' as string | undefined, delay: 50 },
      })

      rerender({ value: undefined, delay: 50 })

      await waitFor(() => {
        expect(result.current).toBe(undefined)
      })
    })

    it('should handle transition from null to value', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: null as string | null, delay: 50 },
      })

      expect(result.current).toBe(null)

      rerender({ value: 'test', delay: 50 })

      await waitFor(() => {
        expect(result.current).toBe('test')
      })
    })
  })

  describe('cleanup behavior', () => {
    it('should cleanup timer on unmount', async () => {
      const { unmount, rerender, result } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        {
          initialProps: { value: 'initial', delay: 100 },
        },
      )

      rerender({ value: 'updated', delay: 100 })
      unmount()

      // Wait to ensure no state updates occur after unmount
      await wait(150)

      // No error should be thrown - cleanup worked
      expect(result.error).toBeUndefined()
    })

    it('should not cause errors after unmount', async () => {
      const { result, rerender, unmount } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        {
          initialProps: { value: 'initial', delay: 100 },
        },
      )

      rerender({ value: 'updated', delay: 100 })

      // Unmount before debounce completes
      unmount()

      // Wait longer than debounce delay
      await wait(150)

      // Should not throw an error about updating unmounted component
      expect(result.current).toBe('initial')
    })
  })

  describe('common use cases', () => {
    it('should work for search input debouncing', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: '', delay: 50 },
      })

      // Simulate typing
      rerender({ value: 's', delay: 50 })
      await wait(10)

      rerender({ value: 'se', delay: 50 })
      await wait(10)

      rerender({ value: 'sea', delay: 50 })
      await wait(10)

      rerender({ value: 'search', delay: 50 })

      // Should still be empty
      expect(result.current).toBe('')

      // Wait for debounce
      await waitFor(() => {
        expect(result.current).toBe('search')
      })
    })

    it('should work for window resize debouncing', async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: { width: 1024, height: 768 }, delay: 50 },
      })

      // Simulate rapid resize events
      rerender({ value: { width: 1025, height: 769 }, delay: 50 })
      await wait(10)

      rerender({ value: { width: 1026, height: 770 }, delay: 50 })
      await wait(10)

      rerender({ value: { width: 1200, height: 800 }, delay: 50 })

      // Wait for debounce
      await waitFor(() => {
        expect(result.current).toEqual({ width: 1200, height: 800 })
      })
    })
  })

  describe('edge cases', () => {
    it('should handle single character words', () => {
      const result = renderHook(() => useDebounce('I', 50))
      expect(result.result.current).toBe('I')
    })

    it('should handle capitalized words', async () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 50), {
        initialProps: { value: 'User' },
      })

      rerender({ value: 'Organization' })

      await waitFor(() => {
        expect(result.current).toBe('Organization')
      })
    })

    it('should handle all caps words', async () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 50), {
        initialProps: { value: 'USER' },
      })

      rerender({ value: 'API' })

      await waitFor(() => {
        expect(result.current).toBe('API')
      })
    })

    it('should handle multiple rapid changes to same value', async () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 50), {
        initialProps: { value: 'initial' },
      })

      // Change to 'test' multiple times
      rerender({ value: 'test' })
      await wait(10)
      rerender({ value: 'test' })
      await wait(10)
      rerender({ value: 'test' })

      await waitFor(() => {
        expect(result.current).toBe('test')
      })
    })
  })
})
