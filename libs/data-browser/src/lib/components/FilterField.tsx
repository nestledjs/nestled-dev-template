import React from 'react'
import { DateRangeFilter, EnumFilter, NumberRangeFilter, RelationFilterField } from './filters'
import { formatFieldName } from '../utils/string-utils'

interface FilterFieldProps {
  fieldName: string
  model: any
  databaseModels: any[]
  filters: Record<string, any>
  onChange: (value: any) => void
  getEnumValues: (enumType: string) => string[] | null
}

/**
 * Renders a single filter field based on its type
 * Extracted from AdminDataListPage to reduce cognitive complexity
 */
export function FilterField({
  fieldName,
  model,
  databaseModels,
  filters,
  onChange,
  getEnumValues,
}: FilterFieldProps) {
  // Check if this is a related enum field (format: "relationName.enumFieldName")
  const isRelatedEnumField = fieldName.includes('.')

  let field: any = null
  let relatedModel: any = null
  let relatedEnumField: any = null

  if (isRelatedEnumField) {
    const [relationName, enumFieldName] = fieldName.split('.')
    field = model.fields.find((f: any) => f.name === relationName)
    if (field) {
      relatedModel = databaseModels.find((m: any) => m.name === field.type)
      if (relatedModel) {
        relatedEnumField = relatedModel.fields.find((f: any) => f.name === enumFieldName)
      }
    }
    if (!field || !relatedModel || !relatedEnumField) return null
  }

  if (!isRelatedEnumField) {
    field = model.fields.find((f: any) => f.name === fieldName)
    if (!field) return null
  }

  // For related enum fields, the filter value is nested
  const currentValue = isRelatedEnumField
    ? (filters[fieldName.split('.')[0]] as any)?.[fieldName.split('.')[1]]
    : filters[fieldName]

  // Handle related enum fields first
  if (isRelatedEnumField && relatedEnumField) {
    const enumValues = getEnumValues(relatedEnumField.type)
    if (enumValues) {
      return (
        <EnumFilter
          key={fieldName}
          fieldName={fieldName}
          currentValue={currentValue}
          onChange={onChange}
          enumValues={enumValues}
        />
      )
    }
  }

  // Relation field filter (only for non-enum relation filters)
  if (field.relationName && !field.isList && !isRelatedEnumField) {
    return (
      <RelationFilterField
        key={fieldName}
        fieldName={fieldName}
        relatedModelName={field.type}
        currentValue={currentValue}
        onChange={onChange}
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
        onChange={onChange}
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
        onChange={onChange}
      />
    )
  }

  // Enum field filter
  if (field.kind === 'enum') {
    const enumValues = getEnumValues(field.type)
    if (enumValues) {
      return (
        <EnumFilter
          key={fieldName}
          fieldName={fieldName}
          currentValue={currentValue}
          onChange={onChange}
          enumValues={enumValues}
        />
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
            onChange(value === '' ? undefined : value === 'true')
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
        onChange={e => onChange(e.target.value || undefined)}
        placeholder={`Filter by ${formatFieldName(fieldName).toLowerCase()}...`}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-web focus:border-green-web text-sm"
      />
    </div>
  )
}
