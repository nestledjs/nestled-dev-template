import { useCallback, useMemo, useRef, useState } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useRelationData } from '../../hooks/useRelationData'
import { formatFieldName } from '../../utils/string-utils'
import { RelationDropdownButton, RelationDropdownContent } from './RelationComponents'
import { filterControlClasses, filterLabelClasses } from './filter-styles'

interface RelationFilterFieldProps {
  fieldName: string
  relatedModelName: string
  currentValue: any
  onChange: (value: any) => void
}

// Refactored relation field filtering component
export function RelationFilterField({
  fieldName,
  relatedModelName,
  currentValue,
  onChange,
}: Readonly<RelationFilterFieldProps>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Memoize the close handler to prevent memory leaks
  const handleCloseDropdown = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Custom hooks for behavior
  useClickOutside(dropdownRef, handleCloseDropdown, isOpen)
  const {
    relatedItems,
    loading,
    error: relationError,
    hasDocument,
  } = useRelationData(
    relatedModelName,
    searchTerm,
    isOpen,
    currentValue?.id, // Pass current value ID so it can be loaded even when dropdown is closed
  )

  // Find current item to display
  const currentItem = useMemo(
    () => (currentValue?.id ? relatedItems.find((item: any) => item.id === currentValue.id) : null),
    [currentValue?.id, relatedItems],
  )

  // Event handlers
  const handleSelect = useCallback(
    (item: any) => {
      onChange({ id: item.id })
      setIsOpen(false)
      setSearchTerm('') // Reset search when item selected
    },
    [onChange],
  )

  const handleClear = useCallback(() => {
    onChange(undefined)
    setIsOpen(false)
    setSearchTerm('')
  }, [onChange])

  const handleToggleOpen = useCallback(() => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm('') // Reset search when opening
    }
  }, [isOpen])

  // If no document available, fall back to text input
  if (!hasDocument) {
    return (
      <div className="space-y-1">
        <label className={filterLabelClasses}>{formatFieldName(fieldName)} ID</label>
        <input
          type="text"
          value={currentValue?.id || ''}
          onChange={e => onChange(e.target.value ? { id: e.target.value } : undefined)}
          placeholder="Enter ID..."
          className={filterControlClasses}
        />
      </div>
    )
  }

  return (
    <div className="space-y-1" ref={dropdownRef}>
      <label className={filterLabelClasses}>{formatFieldName(fieldName)}</label>
      <div className="relative">
        <RelationDropdownButton
          currentItem={currentItem}
          relatedModelName={relatedModelName}
          isOpen={isOpen}
          onClick={handleToggleOpen}
        />

        {isOpen && (
          <RelationDropdownContent
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            relatedModelName={relatedModelName}
            items={relatedItems}
            loading={loading}
            error={relationError}
            onSelect={handleSelect}
            onClear={handleClear}
          />
        )}
      </div>
    </div>
  )
}
