import { formatFieldName } from '../../utils/string-utils'

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
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
        {formatFieldName(fieldName)}
      </label>
      <select
        id={fieldName}
        value={currentValue ?? ''}
        onChange={e => handleChange(e.target.value)}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-web focus:border-green-web"
      >
        <option value="">All values</option>
        {enumValues.map(value => (
          <option key={value} value={value}>
            {formatFieldName(value)}
          </option>
        ))}
      </select>
      {currentValue && (
        <div className="text-xs text-gray-500">Filtered by: {formatFieldName(currentValue)}</div>
      )}
    </div>
  )
}
