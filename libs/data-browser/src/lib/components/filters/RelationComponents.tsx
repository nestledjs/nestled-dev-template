import { getItemDisplayName } from '../../utils/string-utils'
import { FilterChevron, filterControlClasses } from './filter-styles'

// Dropdown button component
export function RelationDropdownButton({
  currentItem,
  relatedModelName,
  isOpen,
  onClick,
}: Readonly<{
  currentItem: any
  relatedModelName: string
  isOpen: boolean
  onClick: () => void
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${filterControlClasses} text-left flex items-center justify-between`}
    >
      <span
        className={
          currentItem ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
        }
      >
        {currentItem
          ? getItemDisplayName(currentItem)
          : `Select ${relatedModelName.toLowerCase()}...`}
      </span>
      <FilterChevron isOpen={isOpen} />
    </button>
  )
}

// Search input component
export function RelationSearchInput({
  searchTerm,
  onSearchChange,
  relatedModelName,
}: Readonly<{
  searchTerm: string
  onSearchChange: (value: string) => void
  relatedModelName: string
}>) {
  return (
    <div className="p-2">
      <input
        type="text"
        placeholder={`Search ${relatedModelName.toLowerCase()}...`}
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full px-2 py-1 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-web"
        autoFocus
      />
    </div>
  )
}

// Individual item component
export function RelationItem({
  item,
  onSelect,
}: Readonly<{
  item: any
  onSelect: (item: any) => void
}>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700 transition-colors"
    >
      {getItemDisplayName(item)}
    </button>
  )
}

// Item list component with error handling
export function RelationItemList({
  items,
  loading,
  error,
  onSelect,
  onClear,
}: Readonly<{
  items: any[]
  loading: boolean
  error?: any
  onSelect: (item: any) => void
  onClear: () => void
}>) {
  return (
    <div className="max-h-48 overflow-y-auto">
      <button
        type="button"
        onClick={onClear}
        className="w-full px-3 py-2 text-left text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
      >
        Clear selection
      </button>

      {error && (
        <div className="px-3 py-2 text-sm text-red-600 dark:text-red-400">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Failed to load options
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {error.networkError ? 'Network error' : 'Please try again'}
          </div>
        </div>
      )}
      {!error && loading && (
        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500 dark:text-gray-400"
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
            Loading...
          </div>
        </div>
      )}
      {!error && !loading && items.length === 0 && (
        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No items found</div>
      )}
      {!error &&
        !loading &&
        items.length > 0 &&
        items.map((item: any) => <RelationItem key={item.id} item={item} onSelect={onSelect} />)}
    </div>
  )
}

// Dropdown content container with error handling
export function RelationDropdownContent({
  searchTerm,
  onSearchChange,
  relatedModelName,
  items,
  loading,
  error,
  onSelect,
  onClear,
}: Readonly<{
  searchTerm: string
  onSearchChange: (value: string) => void
  relatedModelName: string
  items: any[]
  loading: boolean
  error?: any
  onSelect: (item: any) => void
  onClear: () => void
}>) {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
      <RelationSearchInput
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        relatedModelName={relatedModelName}
      />
      <RelationItemList
        items={items}
        loading={loading}
        error={error}
        onSelect={onSelect}
        onClear={onClear}
      />
    </div>
  )
}
