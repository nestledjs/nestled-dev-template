// State management types for admin list page
export interface AdminListState {
  search: string | null
  debouncedSearch: string | null
  skip: number
  pageSize: number
  sort: { orderBy: string; orderDirection: string }
  visibleColumns: string[]
  showColumnSelector: boolean
  searchFields: string[]
  showSearchFieldSelector: boolean
  filters: Record<string, unknown>
  showFilters: boolean
}

export type AdminListAction =
  | { type: 'SET_SEARCH'; payload: string | null }
  | { type: 'SET_DEBOUNCED_SEARCH'; payload: string | null }
  | { type: 'SET_SKIP'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'SET_SORT'; payload: { orderBy: string; orderDirection: string } }
  | { type: 'SET_VISIBLE_COLUMNS'; payload: string[] }
  | { type: 'TOGGLE_COLUMN_SELECTOR' }
  | { type: 'SET_SEARCH_FIELDS'; payload: string[] }
  | { type: 'TOGGLE_SEARCH_FIELD_SELECTOR' }
  | { type: 'SET_FILTERS'; payload: Record<string, unknown> }
  | { type: 'TOGGLE_FILTERS' }
  | { type: 'SET_SHOW_FILTERS'; payload: boolean }
  | { type: 'RESET_PAGINATION' }
  | { type: 'RESET_FILTERS' }

export const initialState: AdminListState = {
  search: '',
  debouncedSearch: '',
  skip: 0,
  pageSize: 20,
  sort: { orderBy: 'id', orderDirection: 'desc' },
  visibleColumns: [],
  showColumnSelector: false,
  searchFields: [],
  showSearchFieldSelector: false,
  filters: {},
  showFilters: false,
}

// Database model type (from @nestled-template/shared/utils originally)
export interface DatabaseModel {
  name: string
  fields: any[]
  pluralModelPropertyName?: string
  // Add other properties as needed
}
