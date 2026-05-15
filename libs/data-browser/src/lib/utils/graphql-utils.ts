import React from 'react'
import { Link } from 'react-router'
import { type FormField, FormFieldClass } from '@nestledjs/forms-core'

import type { DatabaseModel } from '../types'
import type { DisplayFieldConfig } from '../context/AdminDataContext'
import { RelationFieldWrapper } from '../components/RelationFieldWrapper'
import { getPluralName } from './get-plural-names'
import { normalizeModelNameForDocument } from './string-utils'

/**
 * Dynamically get enum values from the SDK
 * This makes the utility portable across different projects by avoiding hardcoded enum imports
 */
function getEnumValues(sdk: any, enumType: string): string[] | null {
  try {
    // Try to get the enum from the SDK
    const enumObject = sdk[enumType]

    if (!enumObject || typeof enumObject !== 'object') {
      return null
    }

    // Check if this is a GraphQL DocumentNode (not an enum)
    if (enumObject.kind === 'Document' || enumObject.definitions) {
      return null
    }

    // Extract enum values (handle both string enums and numeric enums)
    const values = Object.values(enumObject).filter(value => typeof value === 'string')

    if (values.length === 0) {
      // Try to get values from Object.keys for string enums where keys === values
      const keys = Object.keys(enumObject).filter(key => Number.isNaN(Number(key)))
      return keys.length > 0 ? keys : null
    }

    return values as string[] // values is filtered to only strings above
  } catch (error) {
    console.error('Unexpected error:', error)
    return null
  }
}

/**
 * Get GraphQL documents for admin CRUD operations
 */
export function getAdminDocuments(sdk: any, model: DatabaseModel) {
  if (!model || !model.name) {
    throw new Error('Invalid model provided to getAdminDocuments')
  }

  // Normalize model name for document lookup (handles FAQ -> Faq, etc.)
  const normalizedModelName = normalizeModelNameForDocument(model.name)
  const normalizedPluralName = normalizeModelNameForDocument(getPluralName(model.name))

  // Expected document names in the SDK (with __ prefix for admin operations)
  const singleQueryDocumentName = `__Admin${normalizedModelName}` // Single item query
  const listQueryDocumentName = `__Admin${normalizedPluralName}` // List query
  const updateDocumentName = `__AdminUpdate${normalizedModelName}`
  const deleteDocumentName = `__AdminDelete${normalizedModelName}`
  const createDocumentName = `__AdminCreate${normalizedModelName}`

  const sdkRecord = sdk as Record<string, any>
  const documents = {
    query: sdkRecord[singleQueryDocumentName], // For single item
    listQuery: sdkRecord[listQueryDocumentName], // For lists
    update: sdkRecord[updateDocumentName],
    delete: sdkRecord[deleteDocumentName],
    create: sdkRecord[createDocumentName],
  }

  // Validate that required documents exist
  const missingDocuments: string[] = []
  if (!documents.query) missingDocuments.push(singleQueryDocumentName)
  if (!documents.listQuery) missingDocuments.push(listQueryDocumentName)
  if (!documents.create) missingDocuments.push(createDocumentName)
  if (!documents.update) missingDocuments.push(updateDocumentName)
  if (!documents.delete) missingDocuments.push(deleteDocumentName)

  if (missingDocuments.length > 0) {
    throw new Error(
      `Missing GraphQL documents for model "${model.name}": ${missingDocuments.join(', ')}. Please ensure the API server is running and the GraphQL schema is up to date.`,
    )
  }

  return documents
}

/**
 * Get the GraphQL mutation name for a given operation
 */
export function getMutationName(
  model: DatabaseModel,
  operation: 'create' | 'update' | 'delete',
): string {
  const modelName = model.name.charAt(0).toLowerCase() + model.name.slice(1)

  switch (operation) {
    case 'create':
      return `create${model.name}`
    case 'update':
      return `update${model.name}`
    case 'delete':
      return `delete${model.name}`
    default:
      return modelName
  }
}

/**
 * Convert model name to kebab-case for URLs
 */
function toKebabCase(str: string): string {
  return str
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * Convert string to lowerCamelCase
 */
function toLowerCamelCase(str: string): string {
  if (!str) return ''
  return str.charAt(0).toLowerCase() + str.slice(1)
}

/**
 * Find the foreign key field name on a related model that points back to the current model
 * For list relations (one-to-many), we need to find the field on the related model
 */
function findForeignKeyFieldName(
  relatedModel: DatabaseModel | undefined,
  currentModelName: string,
  relationName?: string,
): string | null {
  if (!relatedModel) return null

  // Find the field on the related model that points back to the current model
  const foreignKeyField = relatedModel.fields.find((f: any) => {
    // Must be a relation field pointing to the current model
    if (f.type !== currentModelName) return false
    if (!f.relationName) return false
    if (f.isList) return false // Must be a single relation (foreign key side)

    // If we have a specific relation name (for multiple relations between same models), match it
    if (relationName && f.relationName !== relationName) return false

    return true
  })

  // Return the foreign key field name (e.g., "userId", "sentById", etc.)
  return foreignKeyField?.relationFromFields?.[0] || null
}

/**
 * Normalize a date/datetime field's initial value to the expected string format
 */
function normalizeDateInitialValue(value: unknown, fieldType: string): unknown {
  if (!(value instanceof Date) && !(value && typeof value === 'string')) return value
  try {
    const dateValue = value instanceof Date ? value : new Date(value as string)
    if (fieldType === 'date') return dateValue.toISOString().split('T')[0]
    return dateValue.toISOString().substring(0, 16)
  } catch (e) {
    console.error('Unexpected error:', e)
    return ''
  }
}

/**
 * Derive the initial value for a form field from the current item
 */
function getFieldInitialValue(field: any, currentItem: any, operation: string): unknown {
  let initialValue = currentItem && operation === 'update' ? currentItem[field.name] : undefined

  const fieldTypeLower = field.type.toLowerCase()
  if (fieldTypeLower === 'datetime' || fieldTypeLower === 'date') {
    initialValue = normalizeDateInitialValue(initialValue, fieldTypeLower)
  }

  if (initialValue && typeof initialValue === 'object' && !Array.isArray(initialValue) && field.relationName) {
    const rel = initialValue as Record<string, unknown>
    initialValue = rel.id && typeof rel.id === 'string' ? rel.id : ''
  }

  if (initialValue === null && fieldTypeLower !== 'boolean') {
    initialValue = ''
  }

  return initialValue
}

/**
 * Build a select-options array from enum string values
 */
function buildEnumSelectOptions(values: string[]): Array<{ value: string; label: string }> {
  return values.map(value => ({
    value,
    label: value.replaceAll('_', ' ').toLowerCase().replace(/^./, (s: string) => s.toUpperCase()),
  }))
}

/**
 * Merge query option results into an existing options list, avoiding duplicates, then sort
 */
function mergeAndSortOptions(
  initialOptions: Array<{ value: string; label: string }>,
  queryOptions: Array<{ value: string; label: string }>,
): Array<{ value: string; label: string }> {
  const merged = [...initialOptions]
  for (const option of queryOptions) {
    if (!merged.some(existing => existing.value === option.value)) {
      merged.push(option)
    }
  }
  merged.sort((a, b) => a.label.localeCompare(b.label))
  return merged
}

/**
 * Resolve the scalar value for a relation field from the current item.
 * Tries relationFieldName first, then falls back to the nested object's id.
 */
function resolveRelationValue(field: any, currentItem: any, operation: string): string | undefined {
  if (!currentItem || operation !== 'update') return undefined

  const relationFieldName = field.relationFromFields?.[0] || `${field.name}Id`
  let value: any = currentItem[relationFieldName]

  if (value === undefined) {
    const relObj = currentItem[field.name]
    if (relObj && typeof relObj === 'object' && relObj.id) value = relObj.id
  }

  if (value && typeof value === 'object' && (value as Record<string, unknown>).id) {
    value = (value as Record<string, unknown>).id
  }

  if (value === null) return ''
  return value
}

/**
 * Build the initial options array for a relation select field.
 */
function buildInitialOptions(
  field: any,
  currentItem: any,
  operation: string,
  getDisplayLabel: (item: any) => string,
): Array<{ value: string; label: string }> {
  if (!currentItem || operation !== 'update') return []
  const currentRelationData = currentItem[field.name]
  if (currentRelationData && typeof currentRelationData === 'object' && currentRelationData.id) {
    return [{ value: currentRelationData.id, label: getDisplayLabel(currentRelationData) }]
  }
  return []
}

/**
 * Build a relation (searchSelectApollo or text fallback) form field
 */
function buildRelationFormField(
  field: any,
  label: string,
  options: { label: string; required: boolean },
  currentItem: any,
  operation: string,
  sdk: any,
  basePath: string,
  displayFieldConfig?: DisplayFieldConfig,
): FormField {
  const relationFieldName = field.relationFromFields?.[0] || `${field.name}Id`
  const relationValue = resolveRelationValue(field, currentItem, operation)

  const properPluralName = getPluralName(field.type)
  const adminDocumentName = `__Admin${properPluralName}`
  const regularDocumentName = `${properPluralName}`
  const relationDocument = sdk[adminDocumentName] || sdk[regularDocumentName]

  if (!relationDocument) {
    return FormFieldClass.text(relationFieldName, {
      label: `${label} ID`,
      required: options.required,
      helpText: 'Enter the ID of the related record',
      ...(relationValue !== undefined && { value: relationValue }),
    })
  }

  const config = displayFieldConfig?.[field.type]
  const displayFields = config?.display || ['name', 'title']
  const searchFields = config?.search || displayFields

  const getDisplayLabel = (item: any) => {
    const allValues = displayFields.map((f: string) => item[f]).filter((v: unknown) => v != null && v !== '')
    return allValues.length > 0 ? allValues.join(' ') : item.id
  }

  const initialOptions = buildInitialOptions(field, currentItem, operation, getDisplayLabel)

  return FormFieldClass.searchSelectApollo(relationFieldName, {
    label,
    required: options.required,
    dataType: properPluralName.charAt(0).toLowerCase() + properPluralName.slice(1),
    document: relationDocument,
    searchFields,
    selectOptionsFunction: (items: unknown[]) => {
      const queryOptions = items.map((item: any) => ({
        value: item.id,
        label: getDisplayLabel(item),
      }))
      return mergeAndSortOptions(initialOptions, queryOptions)
    },
    ...(initialOptions.length > 0 && { initialOptions }),
    ...(relationValue !== undefined && { value: relationValue }),
    customWrapper: (fieldElement: React.ReactNode) =>
      React.createElement(
        RelationFieldWrapper,
        { relationType: field.type, initialValue: relationValue, fieldName: relationFieldName, basePath },
        fieldElement,
      ),
  })
}

/**
 * Build a FormField for a single regular (non-list-relation) field
 */
function buildRegularFormField(
  field: any,
  sdk: any,
  currentItem: any,
  operation: string,
  basePath: string,
  displayFieldConfig?: DisplayFieldConfig,
): FormField {
  const label = field.name
    .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (str: string) => str.toUpperCase())

  const initialValue = getFieldInitialValue(field, currentItem, operation)
  const isArrayField = Boolean(field.isList)
  const isRequired = isArrayField ? false : !field.isOptional
  const options = { label, required: isRequired, ...(initialValue !== undefined && { value: initialValue }) }

  switch (field.type.toLowerCase()) {
    case 'string':
      if (field.name.toLowerCase().includes('email')) return FormFieldClass.email(field.name, options)
      if (
        field.name.toLowerCase().includes('description') ||
        field.name.toLowerCase().includes('content') ||
        field.name.toLowerCase().includes('notes')
      ) return FormFieldClass.textArea(field.name, options)
      return FormFieldClass.text(field.name, options)

    case 'int':
    case 'bigint':
    case 'float':
    case 'decimal':
      return FormFieldClass.text(field.name, options)

    case 'boolean': {
      const booleanValue = currentItem && operation === 'update' ? Boolean(currentItem[field.name]) : false
      return FormFieldClass.checkbox(field.name, {
        ...options,
        required: false,
        ...(operation === 'update' && { value: booleanValue }),
      })
    }

    case 'datetime':
      return FormFieldClass.dateTimePicker(field.name, options)

    case 'date':
      return FormFieldClass.datePicker(field.name, options)

    default:
      return buildDefaultFormField(field, label, options, initialValue, sdk, currentItem, operation, basePath, displayFieldConfig)
  }
}

/**
 * Build a FormField for the 'default' switch case (enums and relations)
 */
function buildDefaultFormField(
  field: any,
  label: string,
  options: { label: string; required: boolean; value?: unknown },
  initialValue: unknown,
  sdk: any,
  currentItem: any,
  operation: string,
  basePath: string,
  displayFieldConfig?: DisplayFieldConfig,
): FormField {
  const enumValues = getEnumValues(sdk, field.type)
  if (enumValues) {
    if (field.isList) {
      let defaultValue = ''
      if (Array.isArray(initialValue) && initialValue.length > 0) defaultValue = initialValue.join(',')
      const checkboxOptions = enumValues.map((value: string) => ({
        key: value,
        value,
        label: value.replaceAll('_', ' ').toLowerCase().replace(/^./, (s: string) => s.toUpperCase()),
      }))
      return FormFieldClass.checkboxGroup(field.name, {
        label: options.label,
        required: options.required,
        checkboxOptions,
        checkboxDirection: 'column',
        ...(operation !== 'update' && defaultValue && { defaultValue }),
      })
    }

    const selectOptions = buildEnumSelectOptions(enumValues)
    const enumOptions = operation === 'update'
      ? { label: options.label, required: options.required, options: selectOptions }
      : { ...options, options: selectOptions }
    return FormFieldClass.select(field.name, enumOptions)
  }

  if (field.relationName && !field.isList) {
    return buildRelationFormField(field, label, options, currentItem, operation, sdk, basePath, displayFieldConfig)
  }

  if (field.kind === 'enum' && field.enumValues) {
    const selectOptions = field.enumValues.map((value: string) => ({
      value,
      label: value.replaceAll('_', ' ').toLowerCase().replace(/^./, (s: string) => s.toUpperCase()),
    }))
    return FormFieldClass.select(field.name, { ...options, options: selectOptions })
  }

  return FormFieldClass.text(field.name, options)
}

/**
 * Build a FormField for a list relation field (shows a "See Related" link)
 */
function buildListRelationFormField(
  field: any,
  model: DatabaseModel,
  currentItem: any,
  databaseModels: DatabaseModel[] | undefined,
  basePath: string,
): ReturnType<typeof FormFieldClass.content> | null {
  const label = field.name
    .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (str: string) => str.toUpperCase())

  const pluralModelName = getPluralName(field.type)
  const relatedModelKebab = toKebabCase(pluralModelName)
  const displayName = field.type.replaceAll(/([a-z])([A-Z])/g, '$1 $2')
  const pluralDisplayName = getPluralName(displayName)

  const relatedModel = databaseModels?.find((m: DatabaseModel) => m.name === field.type)
  const foreignKeyFieldName =
    findForeignKeyFieldName(relatedModel, model.name, field.relationName) ||
    `${toLowerCamelCase(model.name)}Id`

  const filterUrl = `${basePath}/${relatedModelKebab}?${foreignKeyFieldName}=${currentItem.id}`

  const countData = currentItem._count?.[field.name]
  const countText = countData === undefined ? '' : ` (${countData})`

  return FormFieldClass.content(field.name, {
    content: React.createElement('div', { className: 'py-2' }, [
      React.createElement(
        'label',
        {
          key: 'label',
          className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
        },
        label,
      ),
      React.createElement(
        Link,
        {
          key: 'link',
          to: filterUrl,
          className:
            'inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline',
        },
        [
          React.createElement(
            'svg',
            {
              key: 'icon',
              className: 'h-4 w-4 mr-1',
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24',
              xmlns: 'http://www.w3.org/2000/svg',
            },
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
            }),
          ),
          `See Related ${pluralDisplayName}${countText}`,
        ],
      ),
    ]),
  })
}

/**
 * Options for building form fields
 */
export interface BuildFormFieldsOptions {
  currentItem?: any
  isSubmitting?: boolean
  basePath?: string
  databaseModels?: DatabaseModel[]
  displayFieldConfig?: DisplayFieldConfig
}

/**
 * Build form fields for a model and operation
 */
export function buildFormFields(
  sdk: any,
  model: DatabaseModel,
  operation: 'create' | 'update',
  options: BuildFormFieldsOptions = {},
): FormField[] {
  const {
    currentItem,
    isSubmitting = false,
    basePath = '/admin/data',
    databaseModels,
    displayFieldConfig,
  } = options
  // Filter out computed/readonly fields for forms
  const editableFields = model.fields.filter((field: any) => {
    // Skip ID field - IDs should be immutable
    if (field.isId) return false

    // Skip computed fields
    if (field.isReadOnly || field.isGenerated) return false

    // Skip timestamps for manual editing (they're auto-managed)
    if (field.isUpdatedAt || field.name === 'createdAt') return false

    // Keep list relations for special handling (we'll show "See Related" links)
    // Keep single relations for dropdown handling

    return true
  })

  // Separate list relationships from regular fields
  const regularFields = editableFields.filter((f: any) => !(f.relationName && f.isList))
  const listRelationFields = editableFields.filter((f: any) => f.relationName && f.isList)

  // Convert to form field format using FormFieldClass
  const formFields: FormField[] = []

  // For update operations, add the ID as a read-only display field at the top
  if (operation === 'update' && currentItem) {
    const idField = model.fields.find((f: any) => f.isId)
    if (idField) {
      formFields.push(
        FormFieldClass.text(idField.name, {
          label: idField.name.replaceAll(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str: string) => str.toUpperCase()),
          disabled: true,
          helpText: 'ID fields are immutable and cannot be changed',
        })
      )
    }
  }

  // Process regular fields first
  regularFields.forEach((field: any) => {
    formFields.push(
      buildRegularFormField(field, sdk, currentItem, operation, basePath, displayFieldConfig),
    )
  })

  // Now process list relationship fields (they go at the bottom)
  if (operation === 'update' && currentItem) {
    listRelationFields.forEach((field: any) => {
      const formField = buildListRelationFormField(field, model, currentItem, databaseModels, basePath)
      if (formField) formFields.push(formField)
    })
  }

  // Add submit button with loading state
  const loadingText = operation === 'create' ? 'Creating...' : 'Updating...'
  const defaultText = operation === 'create' ? 'Create' : 'Update'
  const buttonText = isSubmitting ? loadingText : defaultText

  formFields.push(
    FormFieldClass.button('submit', {
      text: buttonText,
      type: 'submit',
      variant: 'primary',
      disabled: isSubmitting,
    }),
  )

  return formFields
}

// Fields that should never be sent to mutations
const SYSTEM_FIELDS = new Set([
  '__typename', // Apollo type annotation
  'id', // Usually passed as separate variable
  'createdAt', // Auto-managed timestamp
  'updatedAt', // Auto-managed timestamp
  '_count', // Prisma count metadata
  '_meta', // Prisma metadata
])

/**
 * Check if a value should be skipped during form cleaning
 */
function shouldSkipValue(key: string, value: unknown): boolean {
  return SYSTEM_FIELDS.has(key) || value === undefined
}

/**
 * Process a single enum-array field entry, returning the cleaned value
 */
function cleanEnumArrayValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.split(',').filter(v => v.trim() !== '')
  }
  if (Array.isArray(value)) return value
  return []
}

/**
 * Process a single object entry, extracting ID from Apollo option objects or cleaning nested objects
 */
function cleanObjectValue(
  obj: Record<string, unknown>,
  model: Parameters<typeof cleanFormInput>[1],
): unknown {
  if (obj.value !== undefined && obj.label !== undefined && typeof obj.value === 'string') {
    return obj.value
  }
  return processNestedObject(obj, model) ?? undefined
}

/**
 * Process a single input entry, returning [key, cleanedValue] or null to skip
 */
function cleanInputEntry(
  key: string,
  value: unknown,
  booleanFields: Set<string>,
  enumArrayFields: Set<string>,
  requiredArrayFields: Set<string>,
  model: Parameters<typeof cleanFormInput>[1],
): [string, unknown] | null {
  if (booleanFields.has(key) && value === undefined) return [key, false]

  if (enumArrayFields.has(key)) return [key, cleanEnumArrayValue(value)]

  if (requiredArrayFields.has(key) && (value === undefined || value === null || value === '')) {
    return [key, []]
  }

  if (shouldSkipValue(key, value)) return null

  if (typeof value === 'string') {
    const field = model?.fields?.find((f: any) => f.name === key)
    return [key, convertStringValue(value, field)]
  }

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const cleaned = cleanObjectValue(value as Record<string, unknown>, model) // required narrowing for unknown
    if (cleaned === undefined) return null
    return [key, cleaned]
  }

  return [key, value]
}

/**
 * Convert string values to appropriate types (number, boolean, null, datetime)
 */
function convertStringValue(value: string, field?: any): string | number | boolean | null {
  // Convert empty strings to null for optional fields
  if (value === '') {
    return null
  }

  // Handle datetime-local format (YYYY-MM-DDTHH:mm) - convert to ISO string
  if (field?.type.toLowerCase() === 'datetime' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    try {
      // datetime-local values are in local time, convert to ISO string
      const date = new Date(value)
      return date.toISOString()
    } catch (e) {
      return value
    }
  }

  // Handle boolean strings
  if (value === 'true') return true
  if (value === 'false') return false

  // Only convert to number if the field type is numeric
  // Check field type to avoid converting String fields that contain numbers (like lat/long stored as strings)
  const fieldType = field?.type?.toLowerCase()
  const isNumericField = fieldType && ['int', 'bigint', 'float', 'decimal'].includes(fieldType)

  // Handle numeric strings (from form inputs) - only if field type is numeric
  if (isNumericField) {
    const numericPattern = /^-?\d+(\.\d+)?$/
    if (numericPattern.test(value)) {
      const numericValue = Number(value)
      if (!Number.isNaN(numericValue)) {
        return numericValue
      }
    }
  }

  // Return string as-is
  return value
}

/**
 * Process nested objects recursively
 */
function processNestedObject(
  value: Record<string, unknown>,
  model?: DatabaseModel,
): Record<string, unknown> | null {
  const cleanedNested = cleanFormInput(value, model)
  // Only include if the nested object has any fields after cleaning
  return Object.keys(cleanedNested).length > 0 ? cleanedNested : null
}

/**
 * Clean form input data for GraphQL mutations
 * Removes Apollo metadata and system fields
 */
export function cleanFormInput(
  input: Record<string, unknown>,
  model?: DatabaseModel,
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}

  const booleanFields = new Set(
    model?.fields?.filter(field => field.type.toLowerCase() === 'boolean')?.map(field => field.name) || [],
  )
  const requiredArrayFields = new Set(
    model?.fields?.filter(field => field.isList && !field.isOptional && !field.relationName)?.map(field => field.name) || [],
  )
  const enumArrayFields = new Set(
    model?.fields?.filter(field => field.isList && field.kind === 'enum')?.map(field => field.name) || [],
  )

  for (const [key, value] of Object.entries(input)) {
    const entry = cleanInputEntry(key, value, booleanFields, enumArrayFields, requiredArrayFields, model)
    if (entry !== null) {
      cleaned[entry[0]] = entry[1]
    }
  }

  return cleaned
}
