import { formatFieldName } from '../../utils/string-utils'

interface NumberRangeFilterProps {
  fieldName: string
  fieldType: string
  currentValue: any
  onChange: (value: any) => void
}

export function NumberRangeFilter({ 
  fieldName, 
  fieldType,
  currentValue, 
  onChange 
}: Readonly<NumberRangeFilterProps>) {
  // Parse current value if it's a range object
  const minValue = currentValue?.gte !== undefined ? currentValue.gte.toString() : ''
  const maxValue = currentValue?.lte !== undefined ? currentValue.lte.toString() : ''
  
  const parseNumber = (value: string) => {
    if (!value) return undefined
    
    // Parse based on field type
    if (fieldType === 'int' || fieldType === 'bigint') {
      const parsed = parseInt(value, 10)
      return isNaN(parsed) ? undefined : parsed
    } else if (fieldType === 'float' || fieldType === 'decimal') {
      const parsed = parseFloat(value)
      return isNaN(parsed) ? undefined : parsed
    }
    return undefined
  }
  
  const handleMinChange = (value: string) => {
    const newValue = { ...currentValue }
    const parsedValue = parseNumber(value)
    
    if (parsedValue !== undefined) {
      newValue.gte = parsedValue
    } else {
      delete newValue.gte
    }
    
    // If no min or max value, clear the filter entirely
    if (newValue.gte === undefined && newValue.lte === undefined) {
      onChange(undefined)
    } else {
      onChange(newValue)
    }
  }
  
  const handleMaxChange = (value: string) => {
    const newValue = { ...currentValue }
    const parsedValue = parseNumber(value)
    
    if (parsedValue !== undefined) {
      newValue.lte = parsedValue
    } else {
      delete newValue.lte
    }
    
    // If no min or max value, clear the filter entirely
    if (newValue.gte === undefined && newValue.lte === undefined) {
      onChange(undefined)
    } else {
      onChange(newValue)
    }
  }
  
  // Determine input step based on field type
  const step = fieldType === 'int' || fieldType === 'bigint' ? '1' : 'any'
  
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {formatFieldName(fieldName)}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Min</label>
          <input
            type="number"
            step={step}
            value={minValue}
            onChange={(e) => handleMinChange(e.target.value)}
            placeholder="No minimum"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-web focus:border-green-web"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Max</label>
          <input
            type="number"
            step={step}
            value={maxValue}
            onChange={(e) => handleMaxChange(e.target.value)}
            placeholder="No maximum"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-web focus:border-green-web"
          />
        </div>
      </div>
      {(minValue || maxValue) && (
        <div className="text-xs text-gray-500">
          {minValue && maxValue && `${minValue} to ${maxValue}`}
          {minValue && !maxValue && `≥ ${minValue}`}
          {!minValue && maxValue && `≤ ${maxValue}`}
        </div>
      )}
    </div>
  )
}