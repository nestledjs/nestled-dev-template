import React, { useCallback, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { DataTable, ErrorBoundary } from '@nestledjs/shared-components'
import { getPluralName } from '@nestledjs/helpers'
import { AdminLocalStorage } from '../utils/secure-storage'
import { formatFieldName, kebabCase } from '../utils/string-utils'
import { Link, useParams, useSearchParams } from 'react-router'
import { DateRangeFilter, NumberRangeFilter, RelationFilterField } from '../components/filters'
import { useAdminList } from '../hooks/useAdminList'
import { getAdminDocuments } from '../utils/graphql-utils'
import { useAdminDataContext } from '../context/AdminDataContext'

interface AdminDataListPageProps {
  /** Optional model name - if not provided, will read from route params */
  modelName?: string
}

export function AdminDataListPage({ modelName: propModelName }: AdminDataListPageProps = {}) {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const { sdk, databaseModels, basePath = '/admin/data' } = useAdminDataContext()

  // Helper function to get enum values from SDK
  const getEnumValues = useCallback((enumType: string): string[] | null => {
    try {
      const enumObject = (sdk as any)[enumType]

      if (!enumObject || typeof enumObject !== 'object') {
        return null
      }

      const values = Object.values(enumObject).filter(value => typeof value === 'string')

      if (values.length === 0) {
        const keys = Object.keys(enumObject).filter(key => isNaN(Number(key)))
        return keys.length > 0 ? keys : null
      }

      return values as string[]
    } catch (error) {
      console.warn(`Failed to get enum values for type ${enumType}:`, error)
      return null
    }
  }, [sdk])

  // Consolidated state management with useReducer for better performance
  const { state, dispatch } = useAdminList()

  // Destructure state for easier access and backwards compatibility
  const {
    search,
    debouncedSearch,
    skip,
    pageSize,
    sort,
    visibleColumns,
    showColumnSelector,
    searchFields,
    filters,
    showFilters,
    showSearchFieldSelector,
  } = state

  // State setters using dispatch for backwards compatibility - memoized to prevent infinite loops
  const setSkip = useCallback(
    (skip: number) => dispatch({ type: 'SET_SKIP', payload: skip }),
    [dispatch],
  )
  const setFilters = useCallback(
    (filters: Record<string, any>) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    [dispatch],
  )
  const setShowFilters = useCallback(
    (show: boolean) => {
      if (show !== showFilters) dispatch({ type: 'TOGGLE_FILTERS' })
    },
    [showFilters, dispatch],
  )
  const setVisibleColumns = useCallback(
    (columns: string[]) => dispatch({ type: 'SET_VISIBLE_COLUMNS', payload: columns }),
    [dispatch],
  )
  const setShowColumnSelector = useCallback(
    (show: boolean) => {
      if (show !== showColumnSelector) dispatch({ type: 'TOGGLE_COLUMN_SELECTOR' })
    },
    [showColumnSelector, dispatch],
  )
  const setSearchFields = useCallback(
    (fields: string[]) => dispatch({ type: 'SET_SEARCH_FIELDS', payload: fields }),
    [dispatch],
  )
  const setShowSearchFieldSelector = useCallback(
    (show: boolean) => {
      if (show !== showSearchFieldSelector) dispatch({ type: 'TOGGLE_SEARCH_FIELD_SELECTOR' })
    },
    [showSearchFieldSelector, dispatch],
  )

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_DEBOUNCED_SEARCH', payload: state.search })
    }, 500) // 500ms debounce delay

    return () => clearTimeout(timer)
  }, [state.search])

  // Memoize expensive model finding calculation
  const pluralParam = propModelName || (params?.dataTypePlural ?? '')
  const model = useMemo(() => {
    if (propModelName) {
      // Direct model name provided
      return databaseModels.find((m: any) => m.name === propModelName)
    }

    if (!pluralParam) return undefined
    // Convert kebab-case URL param back to find matching model
    // URL: "event-recurring-patterns" should match model where kebabCase(getPluralName(model.name)) === pluralParam
    return databaseModels.find((m: any) => {
      const modelUrlName = kebabCase(getPluralName(m.name))
      return modelUrlName.toLowerCase() === pluralParam.toLowerCase()
    })
  }, [propModelName, pluralParam, databaseModels])

  // Parse URL filter parameters (e.g., ?userId=abc-123)
  // Must come AFTER model is defined
  const urlFilters = useMemo(() => {
    if (!model) return {}

    const filters: Record<string, any> = {}
    for (const [key, value] of searchParams.entries()) {
      // Skip pagination and search params
      if (key !== 'page' && key !== 'search' && key !== 'sort') {
        // Check if this is a foreign key field (e.g., userId)
        // If so, find the corresponding relation field (e.g., user)
        const relationField = model.fields.find((f: any) =>
          f.relationName &&
          !f.isList &&
          f.relationFromFields?.[0] === key
        )

        if (relationField) {
          // This is a foreign key - map it to the relation field for the UI
          // e.g., userId -> user: { id: "..." }
          filters[relationField.name] = { id: value }
        } else {
          // Check if this is a regular scalar field that exists on the model
          const scalarField = model.fields.find((f: any) => f.name === key && !f.relationName)
          if (scalarField) {
            // Regular scalar field that exists on the model
            filters[key] = value
          } else {
            // Field doesn't exist on this model - skip it
            console.warn(`[AdminList] URL parameter "${key}" does not exist on model "${model.name}" - ignoring`)
          }
        }
      }
    }
    return filters
  }, [searchParams, model])

  // Initialize filters from URL parameters on mount
  useEffect(() => {
    if (Object.keys(urlFilters).length > 0) {
      dispatch({ type: 'SET_FILTERS', payload: urlFilters })
      // Also show the filters panel so user can see what's filtered
      if (!showFilters) {
        dispatch({ type: 'TOGGLE_FILTERS' })
      }
    }
  }, [urlFilters, showFilters])

  // Get GraphQL documents based on model
  const documents = useMemo(() => {
    if (!model)
      return {
        query: undefined,
        listQuery: undefined,
        update: undefined,
        delete: undefined,
        create: undefined,
      }
    return getAdminDocuments(sdk, model)
  }, [sdk, model])

  const { listQuery: query } = documents

  // Calculate data path for GraphQL response
  const dataPath = useMemo(() => {
    return (
      model?.pluralModelPropertyName ||
      pluralParam.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    )
  }, [model, pluralParam])

  // Calculate pagination path for GraphQL response
  const paginationPath = useMemo(() => {
    return model ? `${model.pluralModelPropertyName}_meta` : `${dataPath}_meta`
  }, [model, dataPath])

  // Get all field names from model
  const fieldNames = useMemo(() => {
    if (!model) return []
    return model.fields
      .filter((field: any) => !field.relationName || !field.isList) // Include scalar fields and single relations
      .map((field: any) => field.name)
  }, [model])

  // Get filterable field names (excluding text fields - use search for those)
  const filterableFieldNames = useMemo(() => {
    if (!model) return []

    return model.fields
      .filter((field: any) => {
        // Include simple scalar fields that are good for filtering
        if (field.relationName && !field.isList) return true // Single relations
        if (field.relationName) return false // Skip list relations
        if (field.isList) return false
        if (['id', 'createdAt', 'updatedAt'].includes(field.name)) return false

        const fieldType = field.type.toLowerCase()
        // Removed 'string' from filterable types - use search instead for text fields
        return (
          ['boolean', 'int', 'float', 'date', 'datetime'].includes(fieldType) ||
          field.kind === 'enum'
        )
      })
      .map((field: any) => field.name)
  }, [model])

  // Get searchable field names for text search
  const searchableFieldNames = useMemo(() => {
    if (!model) return []

    return model.fields
      .filter((field: any) => {
        const fieldType = field.type.toLowerCase()
        return (
          !field.relationName &&
          (fieldType === 'string' || fieldType.includes('text') || fieldType === 'boolean')
        )
      })
      .map((field: any) => field.name)
  }, [model])

  // Helper function to get good default search fields
  const getDefaultSearchFields = useCallback((availableFields: string[]): string[] => {
    const goodFields = ['name', 'title', 'email', 'firstName', 'lastName', 'subject']
    const matches = goodFields.filter(field => availableFields.includes(field))

    if (matches.length >= 1) {
      return matches.slice(0, 2) // Limit to 2 fields for performance
    }

    // If no good matches, use first 2 fields
    return availableFields.slice(0, Math.min(2, availableFields.length))
  }, [])

  // Reset and load per-model settings when model changes
  useEffect(() => {
    if (!model) return

    // Visible columns (per model), filtered to valid fields
    const storedCols = AdminLocalStorage.getColumnVisibility(model.name) || fieldNames.slice(0, 8)
    const filteredCols = storedCols.filter((c: string) => fieldNames.includes(c))
    setVisibleColumns(filteredCols)

    // Sort (per model); fallback to first field if stored invalid
    const storedSort = AdminLocalStorage.getSortPreference(model.name)
    const sortFieldValid = storedSort && (storedSort.orderBy === 'id' || fieldNames.includes(storedSort.orderBy))
    const nextSort = sortFieldValid ? storedSort! : { orderBy: 'id', orderDirection: 'desc' }
    dispatch({ type: 'SET_SORT', payload: nextSort })

    // Search fields (per model), sanitized to valid fields
    const storedSearch = AdminLocalStorage.getSearchFields(model.name)
    const defaults = getDefaultSearchFields(searchableFieldNames)
    // Don't limit stored preferences - user may have selected more than 2 fields
    const filteredSearch = (storedSearch || defaults).filter((f: string) => searchableFieldNames.includes(f))
    setSearchFields(filteredSearch)

    // Clear per-model transient state
    dispatch({ type: 'SET_SEARCH', payload: '' })
    dispatch({ type: 'SET_DEBOUNCED_SEARCH', payload: '' })
    dispatch({ type: 'RESET_FILTERS' })
    dispatch({ type: 'RESET_PAGINATION' })
  }, [model?.name, fieldNames, searchableFieldNames, getDefaultSearchFields, setVisibleColumns, setSearchFields, dispatch])

  // Memoized sort handler that prevents unnecessary re-renders
  const setSortSafely = useCallback(
    (newSort: { orderBy: string; orderDirection: string } | ((prev: { orderBy: string; orderDirection: string }) => { orderBy: string; orderDirection: string })) => {
      const resolvedSort = typeof newSort === 'function' ? newSort(sort) : newSort
      // Only update if something actually changed
      if (resolvedSort.orderBy !== sort.orderBy || resolvedSort.orderDirection !== sort.orderDirection) {
        dispatch({ type: 'SET_SORT', payload: resolvedSort })
        if (model) {
          AdminLocalStorage.setSortPreference(model.name, resolvedSort)
        }
      }
    },
    [sort.orderBy, sort.orderDirection, model, dispatch],
  )

  // Close dropdowns when clicking outside - memoized to prevent memory leaks
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Element

      // Check if click is outside the column selector dropdown
      if (showColumnSelector) {
        const columnSelector = document.querySelector('[data-dropdown="column-selector"]')
        if (columnSelector && !columnSelector.contains(target)) {
          setShowColumnSelector(false)
        }
      }

      // Check if click is outside the search field selector dropdown
      if (showSearchFieldSelector) {
        const searchFieldSelector = document.querySelector(
          '[data-dropdown="search-field-selector"]',
        )
        if (searchFieldSelector && !searchFieldSelector.contains(target)) {
          setShowSearchFieldSelector(false)
        }
      }
    },
    [
      showColumnSelector,
      showSearchFieldSelector,
      setShowColumnSelector,
      setShowSearchFieldSelector,
    ],
  )

  useEffect(() => {
    if (showColumnSelector || showSearchFieldSelector) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showColumnSelector, showSearchFieldSelector, handleClickOutside])

  const variables = {
    input: {
      take: pageSize,
      skip,
      search: debouncedSearch,
      searchFields: searchFields.length > 0 ? searchFields : undefined,
      orderBy: sort.orderBy,
      orderDirection: sort.orderDirection,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    },
  }

  // Main GraphQL query with comprehensive error handling
  const { data, loading, error, networkStatus, refetch } = useQuery(query ?? (sdk as any).__AdminUsersDocument, {
    variables,
    skip: !model || !query,
    errorPolicy: 'all', // Continue processing even if there are GraphQL errors
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-first',
    // Add timeout for network requests
    context: {
      timeout: 30000, // 30 second timeout
    },
  })

  // Comprehensive data validation and error handling
  const { validatedItems, validatedPagination, dataError } = useMemo(() => {
    // Handle GraphQL errors
    if (error) {
      console.warn('[AdminList] GraphQL error:', error.message)

      // Check for specific error types
      const apolloError = error as any
      if (apolloError.networkError) {
        console.error('[AdminList] Network error:', apolloError.networkError)
      }

      if (apolloError.graphQLErrors?.length > 0) {
        console.error('[AdminList] GraphQL errors:', apolloError.graphQLErrors)
      }
    }

    // If no data available, return empty state
    if (!data) {
      return {
        validatedItems: [],
        validatedPagination: undefined,
        dataError: error || null,
      }
    }

    try {
      const anyData = data as any
      let processedItems = dataPath && anyData[dataPath] ? anyData[dataPath] : []
      const processedPagination =
        paginationPath && anyData[paginationPath] ? anyData[paginationPath] : undefined

      // Fallback: if no items found, try to find array data in the response
      if (!processedItems || processedItems.length === 0) {
        for (const [key, value] of Object.entries(anyData)) {
          if (Array.isArray(value)) {
            // If this looks like the right data (first item has an 'id' field), use it
            if (value.length > 0 && value[0]?.id) {
              processedItems = value
              break
            }
          }
        }
      }

      // Validate items array
      if (!Array.isArray(processedItems)) {
        console.warn('[AdminList] Expected array but got:', typeof processedItems)
        return {
          validatedItems: [],
          validatedPagination: processedPagination,
          dataError: new Error('Invalid data format: expected array'),
        }
      }

      // Validate and filter each item
      const filteredItems = processedItems.filter((item, index) => {
        if (!item || typeof item !== 'object') {
          console.warn(`[AdminList] Invalid item at index ${index}:`, item)
          return false
        }

        if (!item.id) {
          console.warn(`[AdminList] Item missing ID at index ${index}:`, item)
          return false
        }

        return true
      })

      return {
        validatedItems: filteredItems,
        validatedPagination: processedPagination,
        dataError: null,
      }
    } catch (err) {
      console.error('[AdminList] Error processing data:', err)
      return {
        validatedItems: [],
        validatedPagination: undefined,
        dataError: err instanceof Error ? err : new Error('Unknown data processing error'),
      }
    }
  }, [data, dataPath, paginationPath, error])

  const items = validatedItems
  const pagination = validatedPagination

  // Enhanced error display with user-friendly messages and retry options
  if (!model) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Invalid Data Type</h2>
              <p className="mt-2 text-sm text-gray-600">
                The data type "{pluralParam}" is not recognized.
              </p>
              <div className="mt-6">
                <Link
                  to={basePath}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-web hover:bg-green-web-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web"
                >
                  Return to Data Browser
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L5.316 15c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h2 className="mt-4 text-lg font-medium text-gray-900">
                GraphQL Schema Not Available
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                No GraphQL query found for "{model.name}". The admin schema may need to be
                regenerated.
              </p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-web hover:bg-green-web-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web"
                >
                  Reload Page
                </button>
                <Link
                  to={basePath}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web"
                >
                  Return to Data Browser
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate create link
  const createLink = `${basePath}/${kebabCase(model.name)}/create`

  // Column selector dropdown
  const columnSelector = (
    <div className="relative" data-dropdown="column-selector">
      <button
        onClick={() => setShowColumnSelector(!showColumnSelector)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web"
      >
        Columns
        <svg
          className="-mr-0.5 ml-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {showColumnSelector && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Visible Columns</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {fieldNames.map((field: string) => (
                <label key={field} className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(field)}
                    onChange={e => {
                      const newColumns = e.target.checked
                        ? [...visibleColumns, field]
                        : visibleColumns.filter(col => col !== field)
                      setVisibleColumns(newColumns)
                      AdminLocalStorage.setColumnVisibility(model.name, newColumns)
                    }}
                    className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-web focus:ring-green-web border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 leading-5">{formatFieldName(field)}</span>
                </label>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => {
                  setVisibleColumns(fieldNames)
                  AdminLocalStorage.setColumnVisibility(model.name, fieldNames)
                }}
                className="text-xs text-green-web hover:text-green-web-800"
              >
                Select All
              </button>
              <button
                onClick={() => {
                  const defaults = fieldNames.slice(0, 8)
                  setVisibleColumns(defaults)
                  AdminLocalStorage.setColumnVisibility(model.name, defaults)
                }}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Search field selector dropdown
  const searchFieldSelector = (
    <div className="relative" data-dropdown="search-field-selector">
      <button
        onClick={() => setShowSearchFieldSelector(!showSearchFieldSelector)}
        className="h-full px-3 border-l border-gray-300 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
        aria-label="Configure search fields"
      >
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {showSearchFieldSelector && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Search Fields</h3>
            {searchableFieldNames.length > 0 ? (
              <>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {searchableFieldNames.map((field: string) => (
                    <label key={field} className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={searchFields.includes(field)}
                        onChange={e => {
                          const newFields = e.target.checked
                            ? [...searchFields, field]
                            : searchFields.filter(f => f !== field)
                          setSearchFields(newFields)
                          AdminLocalStorage.setSearchFields(model.name, newFields)
                        }}
                        className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-web focus:ring-green-web border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 leading-5">
                        {formatFieldName(field)}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => {
                      setSearchFields(searchableFieldNames)
                      AdminLocalStorage.setSearchFields(model.name, searchableFieldNames)
                    }}
                    className="text-xs text-green-web hover:text-green-web-800 mr-3"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => {
                      const defaults = getDefaultSearchFields(searchableFieldNames)
                      setSearchFields(defaults)
                      AdminLocalStorage.setSearchFields(model.name, defaults)
                    }}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">No searchable text fields available</div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  // Filter panel for advanced filtering
  const filterPanel = showFilters && (
    <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setFilters({})
              dispatch({ type: 'RESET_PAGINATION' })
            }}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            Clear All
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterableFieldNames.map((fieldName: string) => {
          const field = model.fields.find((f: any) => f.name === fieldName)
          if (!field) return null

          const currentValue = filters[fieldName]
          const handleChange = (value: any) => {
            const newFilters = { ...filters }
            if (value === undefined || value === null || value === '') {
              delete newFilters[fieldName]
            } else {
              newFilters[fieldName] = value
            }
            setFilters(newFilters)
            dispatch({ type: 'RESET_PAGINATION' })
          }

          // Relation field filter
          if (field.relationName && !field.isList) {
            return (
              <RelationFilterField
                key={fieldName}
                fieldName={fieldName}
                relatedModelName={field.type}
                currentValue={currentValue}
                onChange={handleChange}
              />
            )
          }

          // Date/DateTime filter
          if (field.type.toLowerCase() === 'datetime' || field.type.toLowerCase() === 'date') {
            return (
              <DateRangeFilter
                key={fieldName}
                fieldName={fieldName}
                currentValue={currentValue}
                onChange={handleChange}
              />
            )
          }

          // Number range filter
          if (['int', 'bigint', 'float', 'decimal'].includes(field.type.toLowerCase())) {
            return (
              <NumberRangeFilter
                key={fieldName}
                fieldName={fieldName}
                fieldType={field.type.toLowerCase()}
                currentValue={currentValue}
                onChange={handleChange}
              />
            )
          }

          // Enum field filter
          if (field.kind === 'enum') {
            const enumValues = getEnumValues(field.type)
            if (enumValues) {
              return (
                <div key={fieldName} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {formatFieldName(fieldName)}
                  </label>
                  <select
                    value={typeof currentValue === 'string' ? currentValue : ''}
                    onChange={e => handleChange(e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-web focus:border-green-web text-sm"
                  >
                    <option value="">All</option>
                    {enumValues.map((val: string) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }
          }

          // Boolean filter
          if (field.type.toLowerCase() === 'boolean') {
            return (
              <div key={fieldName} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {formatFieldName(fieldName)}
                </label>
                <select
                  value={currentValue === undefined || currentValue === null ? '' : currentValue.toString()}
                  onChange={e => {
                    const value = e.target.value
                    handleChange(value === '' ? undefined : value === 'true')
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-web focus:border-green-web text-sm"
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            )
          }

          // String filter (contains)
          return (
            <div key={fieldName} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {formatFieldName(fieldName)}
              </label>
              <input
                type="text"
                value={typeof currentValue === 'string' ? currentValue : ''}
                onChange={e => handleChange(e.target.value || undefined)}
                placeholder={`Filter by ${formatFieldName(fieldName).toLowerCase()}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-web focus:border-green-web text-sm"
              />
            </div>
          )
        })}
      </div>
    </div>
  )

  const searchFilter = (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex-1 max-w-lg">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {loading && search !== debouncedSearch ? (
              <svg
                className="animate-spin h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <input
            id="search"
            name="search"
            className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-web focus:border-green-web sm:text-sm"
            placeholder={`Search ${searchFields.length > 0 ? searchFields.map((field: string) => field.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str: string) => str.toUpperCase())).join(', ') : getPluralName(model.name).toLowerCase()}...`}
            type="search"
            value={state.search || ''}
            onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          />
          {searchableFieldNames.length > 0 && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              {searchFieldSelector}
            </div>
          )}
        </div>
      </div>
      <div className="ml-4 flex space-x-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web ${
            showFilters || Object.keys(filters).length > 0
              ? 'border-green-web text-green-web bg-green-50 hover:bg-green-100'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {Object.keys(filters).length > 0 && (
            <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-web rounded-full">
              {Object.keys(filters).length}
            </span>
          )}
        </button>
        {columnSelector}
        <Link
          to={createLink}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
        >
          Create New
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {filterPanel}
      {searchFilter}
      <DataTable
        data={items}
        path={createLink.replace('/create', '')}
        fields={visibleColumns.length > 0 ? visibleColumns : fieldNames}
        pagination={pagination}
        setSkip={(skip: number) => dispatch({ type: 'SET_SKIP', payload: skip })}
        sort={state.sort}
        setSort={setSortSafely}
      />
    </>
  )
}

export function AdminDataErrorBoundary({ error }: Readonly<{ error: Error }>) {
  return <ErrorBoundary error={error} />
}
