import React from 'react'
import { DateRangeFilter, EnumFilter, NumberRangeFilter, RelationFilterField } from './filters'
import { formatFieldName } from '../utils/string-utils'

interface FilterFieldProps {
  readonly fieldName: string
  readonly model: any
  readonly databaseModels: any[]
  readonly filters: Record<string, any>
  readonly onChange: (value: any) => void
  readonly getEnumValues: (enumType: string) => string[] | null
}

interface FieldInfo {
  field: any
  relatedModel: any
  relatedEnumField: any
  isRelatedEnum: boolean
}

/**
 * Extract field information for both regular and related enum fields
 */
function getFieldInfo(fieldName: string, model: any, databaseModels: any[]): FieldInfo | null {
  const isRelatedEnum = fieldName.includes('.')

  if (isRelatedEnum) {
    const [relationName, enumFieldName] = fieldName.split('.')
    const field = model.fields.find((f: any) => f.name === relationName)
    if (!field) return null

    const relatedModel = databaseModels.find((m: any) => m.name === field.type)
    if (!relatedModel) return null

    const relatedEnumField = relatedModel.fields.find((f: any) => f.name === enumFieldName)
    if (!relatedEnumField) return null

    return { field, relatedModel, relatedEnumField, isRelatedEnum: true }
  }

  const field = model.fields.find((f: any) => f.name === fieldName)
  if (!field) return null

  return { field, relatedModel: null, relatedEnumField: null, isRelatedEnum: false }
}

/**
 * Get the current filter value for regular fields
 */
function getRegularFieldValue(fieldName: string, filters: Record<string, any>): any {
  return filters[fieldName]
}

/**
 * Get the current filter value for related enum fields
 */
function getRelatedEnumFieldValue(fieldName: string, filters: Record<string, any>): any {
  const [relationName, enumFieldName] = fieldName.split('.')
  return filters[relationName]?.[enumFieldName]
}

interface BooleanFilterProps {
  readonly fieldName: string
  readonly currentValue: any
  readonly onChange: (value: any) => void
}

/**
 * Render a boolean filter field
 */
function BooleanFilter({ fieldName, currentValue, onChange }: BooleanFilterProps) {
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

interface StringFilterProps {
  readonly fieldName: string
  readonly currentValue: any
  readonly onChange: (value: any) => void
}

/**
 * Render a string filter field
 */
function StringFilter({ fieldName, currentValue, onChange }: StringFilterProps) {
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
  const fieldInfo = getFieldInfo(fieldName, model, databaseModels)
  if (!fieldInfo) return null

  const { field, relatedEnumField, isRelatedEnum } = fieldInfo
  const currentValue = isRelatedEnum
    ? getRelatedEnumFieldValue(fieldName, filters)
    : getRegularFieldValue(fieldName, filters)

  // Handle related enum fields
  if (isRelatedEnum && relatedEnumField) {
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

  // Relation field filter
  if (field.relationName && !field.isList && !isRelatedEnum) {
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

  const fieldTypeLower = field.type.toLowerCase()

  // Date/DateTime filter
  if (fieldTypeLower === 'datetime' || fieldTypeLower === 'date') {
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
  if (['int', 'bigint', 'float', 'decimal'].includes(fieldTypeLower)) {
    return (
      <NumberRangeFilter
        key={fieldName}
        fieldName={fieldName}
        fieldType={fieldTypeLower}
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
  if (fieldTypeLower === 'boolean') {
    return <BooleanFilter fieldName={fieldName} currentValue={currentValue} onChange={onChange} />
  }

  // String filter (default)
  return <StringFilter fieldName={fieldName} currentValue={currentValue} onChange={onChange} />
}
