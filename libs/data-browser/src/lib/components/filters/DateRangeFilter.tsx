import { formatFieldName } from '../../utils/string-utils'

interface DateRangeFilterProps {
  fieldName: string
  currentValue: any
  onChange: (value: any) => void
}

// Component for date range filtering
export function DateRangeFilter({
  fieldName,
  currentValue,
  onChange,
}: Readonly<DateRangeFilterProps>) {
  // Parse current value if it's a range object
  const fromDate = currentValue?.gte ? new Date(currentValue.gte).toISOString().split('T')[0] : ''
  const toDate = currentValue?.lte ? new Date(currentValue.lte).toISOString().split('T')[0] : ''

  const handleFromChange = (date: string) => {
    const newValue = { ...currentValue }
    if (date) {
      newValue.gte = new Date(date).toISOString()
    } else {
      delete newValue.gte
    }

    // If no from or to date, clear the filter entirely
    if (!newValue.gte && !newValue.lte) {
      onChange(undefined)
    } else {
      onChange(newValue)
    }
  }

  const handleToChange = (date: string) => {
    const newValue = { ...currentValue }
    if (date) {
      // Set to end of day for "to" date
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      newValue.lte = endOfDay.toISOString()
    } else {
      delete newValue.lte
    }

    // If no from or to date, clear the filter entirely
    if (!newValue.gte && !newValue.lte) {
      onChange(undefined)
    } else {
      onChange(newValue)
    }
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {formatFieldName(fieldName)}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor={`${fieldName}-from`} className="block text-xs text-gray-500 mb-1">
            From
          </label>
          <input
            id={`${fieldName}-from`}
            type="date"
            value={fromDate}
            onChange={e => handleFromChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-web focus:border-green-web"
          />
        </div>
        <div>
          <label htmlFor={`${fieldName}-to`} className="block text-xs text-gray-500 mb-1">
            To
          </label>
          <input
            id={`${fieldName}-to`}
            type="date"
            value={toDate}
            onChange={e => handleToChange(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-web focus:border-green-web"
          />
        </div>
      </div>
      {(fromDate || toDate) && (
        <div className="text-xs text-gray-500">
          {fromDate && toDate && `${fromDate} to ${toDate}`}
          {fromDate && !toDate && `From ${fromDate}`}
          {!fromDate && toDate && `Until ${toDate}`}
        </div>
      )}
    </div>
  )
}
