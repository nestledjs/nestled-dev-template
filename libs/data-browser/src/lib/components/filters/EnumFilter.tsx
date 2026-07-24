import { formatFieldName } from '../../utils/string-utils'
import { filterHelpTextClasses, filterLabelClasses, FilterSelect } from './filter-styles'

interface EnumFilterProps {
  fieldName: string
  currentValue: string | undefined | null
  onChange: (value: string | undefined) => void
  enumValues: string[]
}

// Component for enum filtering
export function EnumFilter({
  fieldName,
  currentValue,
  onChange,
  enumValues,
}: Readonly<EnumFilterProps>) {
  const handleChange = (value: string) => {
    if (value === '') {
      onChange(undefined)
    } else {
      onChange(value)
    }
  }

  return (
    <div className="space-y-1">
      <label htmlFor={fieldName} className={filterLabelClasses}>
        {formatFieldName(fieldName)}
      </label>
      <FilterSelect
        id={fieldName}
        value={currentValue ?? ''}
        onChange={e => handleChange(e.target.value)}
      >
        <option value="">All values</option>
        {enumValues.map(value => (
          <option key={value} value={value}>
            {formatFieldName(value)}
          </option>
        ))}
      </FilterSelect>
      {currentValue && (
        <div className={filterHelpTextClasses}>Filtered by: {formatFieldName(currentValue)}</div>
      )}
    </div>
  )
}
