import { formatFieldName } from '../../utils/string-utils'
import { filterControlClasses, filterHelpTextClasses, filterLabelClasses } from './filter-styles'

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
      <label className={filterLabelClasses}>{formatFieldName(fieldName)}</label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor={`${fieldName}-from`} className={`${filterHelpTextClasses} block mb-1`}>
            From
          </label>
          <input
            id={`${fieldName}-from`}
            type="date"
            value={fromDate}
            onChange={e => handleFromChange(e.target.value)}
            className={filterControlClasses}
          />
        </div>
        <div>
          <label htmlFor={`${fieldName}-to`} className={`${filterHelpTextClasses} block mb-1`}>
            To
          </label>
          <input
            id={`${fieldName}-to`}
            type="date"
            value={toDate}
            onChange={e => handleToChange(e.target.value)}
            className={filterControlClasses}
          />
        </div>
      </div>
      {(fromDate || toDate) && (
        <div className={filterHelpTextClasses}>
          {fromDate && toDate && `${fromDate} to ${toDate}`}
          {fromDate && !toDate && `From ${fromDate}`}
          {!fromDate && toDate && `Until ${toDate}`}
        </div>
      )}
    </div>
  )
}
