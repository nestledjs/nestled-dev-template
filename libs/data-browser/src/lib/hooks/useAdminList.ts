import { useReducer } from 'react'
import { AdminListAction, AdminListState, initialState } from '../types'

// State reducer for performance optimization
function adminListReducer(state: AdminListState, action: AdminListAction): AdminListState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload }
    case 'SET_DEBOUNCED_SEARCH':
      return { ...state, debouncedSearch: action.payload }
    case 'SET_SKIP':
      return { ...state, skip: action.payload }
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload, skip: 0 }
    case 'SET_SORT':
      return { ...state, sort: action.payload }
    case 'SET_VISIBLE_COLUMNS':
      return { ...state, visibleColumns: action.payload }
    case 'TOGGLE_COLUMN_SELECTOR':
      return { ...state, showColumnSelector: !state.showColumnSelector }
    case 'SET_SEARCH_FIELDS':
      return { ...state, searchFields: action.payload }
    case 'TOGGLE_SEARCH_FIELD_SELECTOR':
      return { ...state, showSearchFieldSelector: !state.showSearchFieldSelector }
    case 'SET_FILTERS':
      return { ...state, filters: action.payload }
    case 'TOGGLE_FILTERS':
      return { ...state, showFilters: !state.showFilters }
    case 'SET_SHOW_FILTERS':
      return { ...state, showFilters: action.payload }
    case 'RESET_PAGINATION':
      return { ...state, skip: 0 }
    case 'RESET_FILTERS':
      return { ...state, filters: {} }
    default:
      return state
  }
}

export function useAdminList() {
  const [state, dispatch] = useReducer(adminListReducer, initialState)
  
  return { state, dispatch }
}