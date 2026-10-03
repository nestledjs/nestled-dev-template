import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAdminList } from './useAdminList'
import { initialState } from '../types'

describe('useAdminList', () => {
  describe('initial state', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useAdminList())

      expect(result.current.state).toEqual(initialState)
      expect(result.current.state.search).toBe('')
      expect(result.current.state.debouncedSearch).toBe('')
      expect(result.current.state.skip).toBe(0)
      expect(result.current.state.pageSize).toBe(20)
      expect(result.current.state.sort).toEqual({ orderBy: 'id', orderDirection: 'desc' })
      expect(result.current.state.visibleColumns).toEqual([])
      expect(result.current.state.showColumnSelector).toBe(false)
      expect(result.current.state.searchFields).toEqual([])
      expect(result.current.state.showSearchFieldSelector).toBe(false)
      expect(result.current.state.filters).toEqual({})
      expect(result.current.state.showFilters).toBe(false)
    })

    it('should provide dispatch function', () => {
      const { result } = renderHook(() => useAdminList())

      expect(result.current.dispatch).toBeDefined()
      expect(typeof result.current.dispatch).toBe('function')
    })
  })

  describe('SET_SEARCH action', () => {
    it('should set search value', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SEARCH', payload: 'test search' })
      })

      expect(result.current.state.search).toBe('test search')
    })

    it('should handle null search value', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SEARCH', payload: null })
      })

      expect(result.current.state.search).toBe(null)
    })

    it('should handle empty string search value', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SEARCH', payload: '' })
      })

      expect(result.current.state.search).toBe('')
    })

    it('should update search without affecting other state', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SKIP', payload: 40 })
        result.current.dispatch({ type: 'SET_SEARCH', payload: 'query' })
      })

      expect(result.current.state.search).toBe('query')
      expect(result.current.state.skip).toBe(40)
    })
  })

  describe('SET_DEBOUNCED_SEARCH action', () => {
    it('should set debounced search value', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_DEBOUNCED_SEARCH', payload: 'debounced' })
      })

      expect(result.current.state.debouncedSearch).toBe('debounced')
    })

    it('should handle null debounced search value', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_DEBOUNCED_SEARCH', payload: null })
      })

      expect(result.current.state.debouncedSearch).toBe(null)
    })

    it('should keep search and debounced search independent', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SEARCH', payload: 'immediate' })
        result.current.dispatch({ type: 'SET_DEBOUNCED_SEARCH', payload: 'delayed' })
      })

      expect(result.current.state.search).toBe('immediate')
      expect(result.current.state.debouncedSearch).toBe('delayed')
    })
  })

  describe('SET_SKIP action', () => {
    it('should set skip value', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SKIP', payload: 20 })
      })

      expect(result.current.state.skip).toBe(20)
    })

    it('should handle zero skip value', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SKIP', payload: 0 })
      })

      expect(result.current.state.skip).toBe(0)
    })

    it('should handle large skip values', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SKIP', payload: 1000 })
      })

      expect(result.current.state.skip).toBe(1000)
    })

    it('should update skip for pagination', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SKIP', payload: 20 })
        result.current.dispatch({ type: 'SET_SKIP', payload: 40 })
        result.current.dispatch({ type: 'SET_SKIP', payload: 60 })
      })

      expect(result.current.state.skip).toBe(60)
    })
  })

  describe('SET_PAGE_SIZE action', () => {
    it('should set page size', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_PAGE_SIZE', payload: 50 })
      })

      expect(result.current.state.pageSize).toBe(50)
    })

    it('should handle common page sizes', () => {
      const { result } = renderHook(() => useAdminList())

      const pageSizes = [10, 20, 50, 100]

      pageSizes.forEach(size => {
        act(() => {
          result.current.dispatch({ type: 'SET_PAGE_SIZE', payload: size })
        })
        expect(result.current.state.pageSize).toBe(size)
      })
    })
  })

  describe('SET_SORT action', () => {
    it('should set sort configuration', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({
          type: 'SET_SORT',
          payload: { orderBy: 'name', orderDirection: 'asc' },
        })
      })

      expect(result.current.state.sort).toEqual({ orderBy: 'name', orderDirection: 'asc' })
    })

    it('should handle descending sort', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({
          type: 'SET_SORT',
          payload: { orderBy: 'createdAt', orderDirection: 'desc' },
        })
      })

      expect(result.current.state.sort).toEqual({ orderBy: 'createdAt', orderDirection: 'desc' })
    })

    it('should update sort multiple times', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({
          type: 'SET_SORT',
          payload: { orderBy: 'name', orderDirection: 'asc' },
        })
        result.current.dispatch({
          type: 'SET_SORT',
          payload: { orderBy: 'email', orderDirection: 'desc' },
        })
      })

      expect(result.current.state.sort).toEqual({ orderBy: 'email', orderDirection: 'desc' })
    })
  })

  describe('SET_VISIBLE_COLUMNS action', () => {
    it('should set visible columns', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_VISIBLE_COLUMNS', payload: ['id', 'name', 'email'] })
      })

      expect(result.current.state.visibleColumns).toEqual(['id', 'name', 'email'])
    })

    it('should handle empty columns array', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_VISIBLE_COLUMNS', payload: [] })
      })

      expect(result.current.state.visibleColumns).toEqual([])
    })

    it('should replace previous visible columns', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_VISIBLE_COLUMNS', payload: ['id', 'name'] })
        result.current.dispatch({ type: 'SET_VISIBLE_COLUMNS', payload: ['email', 'phone'] })
      })

      expect(result.current.state.visibleColumns).toEqual(['email', 'phone'])
    })
  })

  describe('TOGGLE_COLUMN_SELECTOR action', () => {
    it('should toggle column selector from false to true', () => {
      const { result } = renderHook(() => useAdminList())

      expect(result.current.state.showColumnSelector).toBe(false)

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_COLUMN_SELECTOR' })
      })

      expect(result.current.state.showColumnSelector).toBe(true)
    })

    it('should toggle column selector from true to false', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_COLUMN_SELECTOR' })
        result.current.dispatch({ type: 'TOGGLE_COLUMN_SELECTOR' })
      })

      expect(result.current.state.showColumnSelector).toBe(false)
    })

    it('should toggle multiple times', () => {
      const { result } = renderHook(() => useAdminList())

      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.dispatch({ type: 'TOGGLE_COLUMN_SELECTOR' })
        })
        expect(result.current.state.showColumnSelector).toBe(i % 2 === 0)
      }
    })
  })

  describe('SET_SEARCH_FIELDS action', () => {
    it('should set search fields', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SEARCH_FIELDS', payload: ['name', 'email'] })
      })

      expect(result.current.state.searchFields).toEqual(['name', 'email'])
    })

    it('should handle empty search fields array', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SEARCH_FIELDS', payload: [] })
      })

      expect(result.current.state.searchFields).toEqual([])
    })

    it('should replace previous search fields', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SEARCH_FIELDS', payload: ['name'] })
        result.current.dispatch({ type: 'SET_SEARCH_FIELDS', payload: ['email', 'phone'] })
      })

      expect(result.current.state.searchFields).toEqual(['email', 'phone'])
    })
  })

  describe('TOGGLE_SEARCH_FIELD_SELECTOR action', () => {
    it('should toggle search field selector from false to true', () => {
      const { result } = renderHook(() => useAdminList())

      expect(result.current.state.showSearchFieldSelector).toBe(false)

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_SEARCH_FIELD_SELECTOR' })
      })

      expect(result.current.state.showSearchFieldSelector).toBe(true)
    })

    it('should toggle search field selector from true to false', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_SEARCH_FIELD_SELECTOR' })
        result.current.dispatch({ type: 'TOGGLE_SEARCH_FIELD_SELECTOR' })
      })

      expect(result.current.state.showSearchFieldSelector).toBe(false)
    })
  })

  describe('SET_FILTERS action', () => {
    it('should set filters', () => {
      const { result } = renderHook(() => useAdminList())

      const filters = {
        status: 'active',
        role: 'admin',
      }

      act(() => {
        result.current.dispatch({ type: 'SET_FILTERS', payload: filters })
      })

      expect(result.current.state.filters).toEqual(filters)
    })

    it('should handle empty filters', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_FILTERS', payload: {} })
      })

      expect(result.current.state.filters).toEqual({})
    })

    it('should handle complex filter values', () => {
      const { result } = renderHook(() => useAdminList())

      const filters = {
        dateRange: { from: '2024-01-01', to: '2024-12-31' },
        numbers: [1, 2, 3],
        nested: { field: { value: 'test' } },
      }

      act(() => {
        result.current.dispatch({ type: 'SET_FILTERS', payload: filters })
      })

      expect(result.current.state.filters).toEqual(filters)
    })

    it('should replace previous filters', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_FILTERS', payload: { old: 'value' } })
        result.current.dispatch({ type: 'SET_FILTERS', payload: { new: 'value' } })
      })

      expect(result.current.state.filters).toEqual({ new: 'value' })
    })
  })

  describe('TOGGLE_FILTERS action', () => {
    it('should toggle filters from false to true', () => {
      const { result } = renderHook(() => useAdminList())

      expect(result.current.state.showFilters).toBe(false)

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_FILTERS' })
      })

      expect(result.current.state.showFilters).toBe(true)
    })

    it('should toggle filters from true to false', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_FILTERS' })
        result.current.dispatch({ type: 'TOGGLE_FILTERS' })
      })

      expect(result.current.state.showFilters).toBe(false)
    })
  })

  describe('SET_SHOW_FILTERS action', () => {
    it('should set showFilters to true', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SHOW_FILTERS', payload: true })
      })

      expect(result.current.state.showFilters).toBe(true)
    })

    it('should set showFilters to false', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'TOGGLE_FILTERS' }) // Set to true
        result.current.dispatch({ type: 'SET_SHOW_FILTERS', payload: false })
      })

      expect(result.current.state.showFilters).toBe(false)
    })

    it('should provide explicit control over showFilters', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SHOW_FILTERS', payload: true })
        result.current.dispatch({ type: 'SET_SHOW_FILTERS', payload: true })
        result.current.dispatch({ type: 'SET_SHOW_FILTERS', payload: false })
      })

      expect(result.current.state.showFilters).toBe(false)
    })
  })

  describe('RESET_PAGINATION action', () => {
    it('should reset skip to 0', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SKIP', payload: 100 })
        result.current.dispatch({ type: 'RESET_PAGINATION' })
      })

      expect(result.current.state.skip).toBe(0)
    })

    it('should not affect other state', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_SKIP', payload: 100 })
        result.current.dispatch({ type: 'SET_SEARCH', payload: 'test' })
        result.current.dispatch({ type: 'SET_PAGE_SIZE', payload: 50 })
        result.current.dispatch({ type: 'RESET_PAGINATION' })
      })

      expect(result.current.state.skip).toBe(0)
      expect(result.current.state.search).toBe('test')
      expect(result.current.state.pageSize).toBe(50)
    })
  })

  describe('RESET_FILTERS action', () => {
    it('should reset filters to empty object', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_FILTERS', payload: { status: 'active' } })
        result.current.dispatch({ type: 'RESET_FILTERS' })
      })

      expect(result.current.state.filters).toEqual({})
    })

    it('should not affect other state', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        result.current.dispatch({ type: 'SET_FILTERS', payload: { status: 'active' } })
        result.current.dispatch({ type: 'SET_SEARCH', payload: 'test' })
        result.current.dispatch({ type: 'TOGGLE_FILTERS' })
        result.current.dispatch({ type: 'RESET_FILTERS' })
      })

      expect(result.current.state.filters).toEqual({})
      expect(result.current.state.search).toBe('test')
      expect(result.current.state.showFilters).toBe(true)
    })
  })

  describe('complex workflows', () => {
    it('should handle complete search workflow', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        // User types search query
        result.current.dispatch({ type: 'SET_SEARCH', payload: 'john' })
        // Debounced value updates
        result.current.dispatch({ type: 'SET_DEBOUNCED_SEARCH', payload: 'john' })
        // Reset pagination when searching
        result.current.dispatch({ type: 'RESET_PAGINATION' })
      })

      expect(result.current.state.search).toBe('john')
      expect(result.current.state.debouncedSearch).toBe('john')
      expect(result.current.state.skip).toBe(0)
    })

    it('should handle complete pagination workflow', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        // First page
        result.current.dispatch({ type: 'SET_SKIP', payload: 0 })
        // Next page
        result.current.dispatch({ type: 'SET_SKIP', payload: 20 })
        // Next page
        result.current.dispatch({ type: 'SET_SKIP', payload: 40 })
        // Previous page
        result.current.dispatch({ type: 'SET_SKIP', payload: 20 })
      })

      expect(result.current.state.skip).toBe(20)
    })

    it('should handle complete filter workflow', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        // Show filters
        result.current.dispatch({ type: 'TOGGLE_FILTERS' })
        // Set filters
        result.current.dispatch({ type: 'SET_FILTERS', payload: { status: 'active' } })
        // Reset pagination when filtering
        result.current.dispatch({ type: 'RESET_PAGINATION' })
      })

      expect(result.current.state.showFilters).toBe(true)
      expect(result.current.state.filters).toEqual({ status: 'active' })
      expect(result.current.state.skip).toBe(0)
    })

    it('should handle complete column customization workflow', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        // Toggle column selector
        result.current.dispatch({ type: 'TOGGLE_COLUMN_SELECTOR' })
        // Set visible columns
        result.current.dispatch({ type: 'SET_VISIBLE_COLUMNS', payload: ['id', 'name', 'email'] })
        // Close column selector
        result.current.dispatch({ type: 'TOGGLE_COLUMN_SELECTOR' })
      })

      expect(result.current.state.showColumnSelector).toBe(false)
      expect(result.current.state.visibleColumns).toEqual(['id', 'name', 'email'])
    })

    it('should handle complete sort workflow', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        // Sort by name ascending
        result.current.dispatch({
          type: 'SET_SORT',
          payload: { orderBy: 'name', orderDirection: 'asc' },
        })
        // Click same column to reverse
        result.current.dispatch({
          type: 'SET_SORT',
          payload: { orderBy: 'name', orderDirection: 'desc' },
        })
        // Reset pagination when sorting
        result.current.dispatch({ type: 'RESET_PAGINATION' })
      })

      expect(result.current.state.sort).toEqual({ orderBy: 'name', orderDirection: 'desc' })
      expect(result.current.state.skip).toBe(0)
    })

    it('should handle clearing all filters and resetting state', () => {
      const { result } = renderHook(() => useAdminList())

      act(() => {
        // Set up filtered state
        result.current.dispatch({ type: 'SET_SEARCH', payload: 'test' })
        result.current.dispatch({ type: 'SET_FILTERS', payload: { status: 'active' } })
        result.current.dispatch({ type: 'SET_SKIP', payload: 40 })

        // Clear everything
        result.current.dispatch({ type: 'SET_SEARCH', payload: '' })
        result.current.dispatch({ type: 'RESET_FILTERS' })
        result.current.dispatch({ type: 'RESET_PAGINATION' })
      })

      expect(result.current.state.search).toBe('')
      expect(result.current.state.filters).toEqual({})
      expect(result.current.state.skip).toBe(0)
    })
  })
})
