import * as Sdk from '@biztobiz/shared/sdk'
import dayjs from 'dayjs'
import { type FormField, FormFieldClass } from '@nestledjs/forms'
import { getPluralName } from '@biztobiz/shared/utils'
import type { DatabaseModel } from '../types'
import { RelationFieldWrapper } from '../components/shared/RelationFieldWrapper'
import React from 'react'
import { DATABASE_MODELS } from '@biztobiz/shared/sdk'

/**
 * Dynamically get enum values from the SDK
 * This makes the utility portable across different projects by avoiding hardcoded enum imports
 */
function getEnumValues(enumType: string): string[] | null {
  try {
    // Try to get the enum from the SDK
    const enumObject = (Sdk as any)[enumType]

    if (!enumObject || typeof enumObject !== 'object') {
      return null
    }

    // Extract enum values (handle both string enums and numeric enums)
    const values = Object.values(enumObject).filter(value => typeof value === 'string')

    if (values.length === 0) {
      // Try to get values from Object.keys for string enums where keys === values
      const keys = Object.keys(enumObject).filter(key => isNaN(Number(key)))
      return keys.length > 0 ? keys : null
    }

    return values as string[]
  } catch (error) {
    console.warn(`Failed to get enum values for type ${enumType}:`, error)
    return null
  }
}

/**
 * Smart normalization for GraphQL document names
 * Automatically handles acronyms without manual mapping
 */
function normalizeModelNameForDocument(modelName: string): string {
  // If it's all uppercase (likely an acronym), convert to proper case
  if (modelName === modelName.toUpperCase() && modelName.length > 1) {
    // For acronyms, only capitalize the first letter for document names
    return modelName.charAt(0).toUpperCase() + modelName.slice(1).toLowerCase()
  }

  // For normal PascalCase names, return as-is
  return modelName
}

/**
 * Get GraphQL documents for admin CRUD operations
 */
export function getAdminDocuments(model: DatabaseModel) {
  if (!model || !model.name) {
    throw new Error('Invalid model provided to getAdminDocuments')
  }

  // Normalize model name for document lookup (handles FAQ -> Faq, etc.)
  const normalizedModelName = normalizeModelNameForDocument(model.name)
  const normalizedPluralName = normalizeModelNameForDocument(getPluralName(model.name))

  // Expected document names in the SDK
  const singleQueryDocumentName = `Admin${normalizedModelName}Document` // Single item query
  const listQueryDocumentName = `Admin${normalizedPluralName}Document` // List query
  const updateDocumentName = `AdminUpdate${normalizedModelName}Document`
  const deleteDocumentName = `AdminDelete${normalizedModelName}Document`
  const createDocumentName = `AdminCreate${normalizedModelName}Document`

  const documents = {
    query: (Sdk as Record<string, any>)[singleQueryDocumentName], // For single item
    listQuery: (Sdk as Record<string, any>)[listQueryDocumentName], // For lists
    update: (Sdk as Record<string, any>)[updateDocumentName],
    delete: (Sdk as Record<string, any>)[deleteDocumentName],
    create: (Sdk as Record<string, any>)[createDocumentName],
  }

  // Validate that required documents exist
  const missingDocuments: string[] = []
  if (!documents.query) missingDocuments.push(singleQueryDocumentName)
  if (!documents.listQuery) missingDocuments.push(listQueryDocumentName)
  if (!documents.create) missingDocuments.push(createDocumentName)
  if (!documents.update) missingDocuments.push(updateDocumentName)
  if (!documents.delete) missingDocuments.push(deleteDocumentName)

  if (missingDocuments.length > 0) {
    console.error(`[GraphQL Documents] Missing documents for model "${model.name}":`, {
      model: model.name,
      normalizedModelName,
      normalizedPluralName,
      missingDocuments,
      availableDocuments: Object.keys(Sdk).filter(
        key => key.includes('Admin') && key.includes('Document'),
      ),
    })

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

// Cache string field name sets per model to avoid recomputation
const stringFieldsCache = new WeakMap<DatabaseModel, Set<string>>()

function getStringFieldNamesForModel(model?: DatabaseModel): Set<string> {
  if (!model) return new Set<string>()
  const cached = stringFieldsCache.get(model)
  if (cached) return cached
  const names = new Set(
    model.fields?.filter(f => f.type.toLowerCase() === 'string').map(f => f.name) || [],
  )
  stringFieldsCache.set(model, names)
  return names
}

/**
 * Get the foreign key field name for a relation field
 * @param field - The field definition from the model
 * @returns The foreign key field name (e.g., 'chapterId' for a 'chapter' relation)
 */
function getForeignKeyFieldName(field: any): string {
  return field.relationFromFields?.[0] || `${field.name}Id`
}

/**
 * Build form fields for a model and operation
 */
export function buildFormFields(
  model: DatabaseModel,
  operation: 'create' | 'update',
  currentItem?: any,
  isSubmitting?: boolean,
): FormField[] {
  // Filter out computed/readonly fields for forms
  const editableFields = model.fields.filter((field: any) => {
    // Skip ID field for create operations
    if (operation === 'create' && field.isId) return false

    // Skip computed fields
    if (field.isReadOnly || field.isGenerated) return false

    // Skip timestamps for manual editing (they're auto-managed)
    if (field.isUpdatedAt || field.name === 'createdAt') return false

    // Skip relation fields for now (they need special handling)
    if (field.relationName && field.isList) return false

    return true
  })

  // Convert to form field format using FormFieldClass
  const formFields = editableFields.map((field: any) => {
    const label = field.name
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str: string) => str.toUpperCase())

    // Get initial value from currentItem for update operations
    let initialValue = currentItem && operation === 'update' ? currentItem[field.name] : undefined

    // Convert null to empty string for form fields (except boolean fields)
    if (initialValue === null && field.type.toLowerCase() !== 'boolean') {
      initialValue = ''
    }

    // Arrays (isList) should be optional in forms regardless of model optionality
    const isArrayField = Boolean(field.isList)
    const isRequired = isArrayField ? false : !field.isOptional

    const options = {
      label,
      required: isRequired,
      ...(initialValue !== undefined && { value: initialValue }),
    }

    // Determine field type based on Prisma type
    switch (field.type.toLowerCase()) {
      case 'string':
        if (field.name.toLowerCase().includes('email')) {
          return FormFieldClass.email(field.name, options)
        }
        // For long text fields, use textarea
        if (
          field.name.toLowerCase().includes('description') ||
          field.name.toLowerCase().includes('content') ||
          field.name.toLowerCase().includes('notes')
        ) {
          return FormFieldClass.textArea(field.name, options)
        }
        return FormFieldClass.text(field.name, options)

      case 'int':
      case 'bigint':
        return FormFieldClass.text(field.name, options)

      case 'float':
      case 'decimal':
        return FormFieldClass.text(field.name, options)

      case 'boolean': {
        // Boolean fields should never be "required" in forms, even if required in DB
        // Required in DB means "must have value (true OR false)", not "must be true"
        // For boolean fields, convert null/undefined to false for checkbox display
        const booleanValue =
          currentItem && operation === 'update' ? Boolean(currentItem[field.name]) : false
        return FormFieldClass.checkbox(field.name, {
          ...options,
          required: false,
          ...(operation === 'update' && { value: booleanValue }),
        })
      }

      case 'datetime':
      case 'date': {
        const formatted =
          initialValue && dayjs(initialValue).isValid()
            ? dayjs(initialValue).format('YYYY-MM-DD')
            : undefined
        return FormFieldClass.datePicker(field.name, {
          ...options,
          ...(formatted !== undefined && { value: formatted }),
        })
      }

      default:
        // Handle enum fields first (check if field type exists in the SDK)
        const enumValues = getEnumValues(field.type)
        if (enumValues) {
          const selectOptions = enumValues.map((value: string) => ({
            value,
            label: value
              .replace(/_/g, ' ')
              .toLowerCase()
              .replace(/^./, (str: string) => str.toUpperCase()),
          }))

          return FormFieldClass.select(field.name, {
            ...options,
            options: selectOptions,
          })
        }

        // Handle relation fields with Apollo-powered select dropdowns
        if (field.relationName && !field.isList) {
          // Check if this is a reverse relation (no foreign key on this model)
          const isReverseRelation = !field.relationFromFields || field.relationFromFields.length === 0

          let relationFieldName: string
          let relationValue: any = undefined

          if (isReverseRelation) {
            // For reverse relations, create a read-only display with link instead of editable field
            const relationObject = currentItem && operation === 'update' ? currentItem[field.name] : null
            relationValue = relationObject?.id || undefined

            // Helper function to create a display label from an item
            const createDisplayLabel = (item: any): string => {
              if (!item) return 'None'

              // Special handling for User/Member types with firstName/lastName
              if ((field.type === 'User' || field.type === 'Member')) {
                const parts = []
                if (item.firstName) parts.push(item.firstName)
                if (item.lastName) parts.push(item.lastName)
                if (parts.length > 0) {
                  return parts.join(' ')
                }
                // Fall back to email if no name parts available
                if (item.email) {
                  return item.email
                }
              }

              // Try common display fields in order of preference
              const displayValue = item.title || item.name || item.label || item.displayName || item.email || item.originalFilename
              if (displayValue) return displayValue

              // Last resort: use ID
              return item.id || 'Unknown'
            }

            const displayLabel = createDisplayLabel(relationObject)

            // Convert PascalCase to kebab-case for URLs (CourseChapter -> course-chapter)
            const toKebabCase = (str: string): string => {
              return str
                .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert dash between lowercase and uppercase
                .toLowerCase() // Convert to lowercase
            }

            // Create read-only content field with link
            return FormFieldClass.content(field.name, {
              content: React.createElement('div', { className: 'py-2' }, [
                React.createElement('label', {
                  key: 'label',
                  className: 'block text-sm font-medium text-gray-700 mb-1'
                }, label),
                React.createElement('div', {
                  key: 'content',
                  className: 'text-sm text-gray-900'
                }, [
                  relationObject ? React.createElement('span', { key: 'text' }, displayLabel) : React.createElement('span', {
                    key: 'empty',
                    className: 'text-gray-500 italic'
                  }, 'None'),
                  relationObject && relationValue ? React.createElement('div', { key: 'link', className: 'mt-1' },
                    React.createElement('a', {
                      href: `/admin/data/${toKebabCase(field.type)}/${relationValue}`,
                      className: 'inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline',
                      target: '_blank',
                      rel: 'noopener noreferrer'
                    }, [
                      React.createElement('svg', {
                        key: 'icon',
                        className: 'h-3 w-3 mr-1',
                        fill: 'none',
                        stroke: 'currentColor',
                        viewBox: '0 0 24 24'
                      }, React.createElement('path', {
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeWidth: 2,
                        d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      })),
                      `View ${field.type} record`
                    ])
                  ) : null
                ])
              ])
            })
          } else {
            // For normal relations, use the foreign key field name (e.g., 'chapterId')
            relationFieldName = getForeignKeyFieldName(field)
            relationValue = currentItem && operation === 'update' ? currentItem[relationFieldName] : undefined

            // If relationValue is an object (like {__typename: 'Course', id: '...' }), extract the ID
            if (relationValue && typeof relationValue === 'object' && relationValue.id) {
              relationValue = relationValue.id
            }
          }

          // Convert null to empty string for forward relations
          if (relationValue === null) {
            relationValue = ''
          }

          // Only create editable fields for forward relations (not reverse relations)
          if (!isReverseRelation) {
            // Use Apollo-powered select for relationships
            // Try to get the Admin GraphQL document for the relation type
            const adminDocumentName = `Admin${field.type}sDocument` // e.g., AdminCoursesDocument
            const regularDocumentName = `${field.type}sDocument` // e.g., CoursesDocument
            const relationDocument =
              (Sdk as any)[adminDocumentName] || (Sdk as any)[regularDocumentName]

              if (relationDocument) {
                // Dynamically determine search fields based on what exists on the related model
                let searchFields: string[] = []

                // Try to find the related model to check what fields actually exist
                const relatedModel = (model.fields || []).find((f: any) => f.type === field.type)?.model ||
                                    DATABASE_MODELS.find(m => m.name === field.type)

                if (relatedModel && relatedModel.fields) {
                  // Get all string fields from the related model
                  const availableStringFields = new Set(
                    relatedModel.fields
                      .filter((f: any) => f.type.toLowerCase() === 'string' && !f.isGenerated && !f.isReadOnly)
                      .map((f: any) => f.name)
                  )

                  // Define preferred search fields in order of preference
                  const preferredFields = ['name', 'title', 'firstName', 'lastName', 'email', 'label', 'displayName', 'originalFilename']

                  // Only include fields that actually exist on the model
                  searchFields = preferredFields.filter(fieldName => availableStringFields.has(fieldName))

                  // Always include 'id' as fallback
                  if (!searchFields.includes('id')) {
                    searchFields.push('id')
                  }
                } else {
                  // Fallback: if we can't determine the model structure, just use id
                  searchFields = ['id']
                }

                // Helper function to create a display label from an item
                const createDisplayLabel = (item: any): string => {
                  if (!item) return ''

                  // Special handling for User/Member types with firstName/lastName
                  if ((field.type === 'User' || field.type === 'Member')) {
                    const parts = []
                    if (item.firstName) parts.push(item.firstName)
                    if (item.lastName) parts.push(item.lastName)
                    if (parts.length > 0) {
                      return parts.join(' ')
                    }
                    // Fall back to email if no name parts available
                    if (item.email) {
                      return item.email
                    }
                  }

                  // Try common display fields in order of preference
                  const displayValue = item.title || item.name || item.label || item.displayName || item.email
                  if (displayValue) return displayValue

                  // Last resort: use ID
                  return item.id || 'Unknown'
                }

                // Create initial option from current item if we're in edit mode
                let initialOptions: Array<{ value: string; label: string }> = []
                if (currentItem && operation === 'update') {
                  const currentRelationData = currentItem[field.name] // e.g., course: {__typename: 'Course', id: '...'}
                  if (
                    currentRelationData &&
                    typeof currentRelationData === 'object' &&
                    currentRelationData.id
                  ) {
                    const displayLabel = createDisplayLabel(currentRelationData)
                    initialOptions = [
                      {
                        value: currentRelationData.id,
                        label: displayLabel,
                      },
                    ]
                  }
                }

                const selectField = FormFieldClass.searchSelectApollo(relationFieldName, {
                  label: label, // Remove "ID" suffix - just use the field name
                  required: options.required,
                  dataType: field.type.toLowerCase() + 's', // e.g., Course → courses
                  document: relationDocument,
                  searchFields: searchFields, // Use multiple fields for searching
                  selectOptionsFunction: (items: unknown[]) => {
                    // Combine initial options with query results (avoiding duplicates)
                    const queryOptions = items.map((item: any) => ({
                      value: item.id,
                      label: createDisplayLabel(item),
                    }))

                    // Add initial option if it's not already in the query results
                    const allOptions = [...initialOptions]
                    queryOptions.forEach(option => {
                      if (!allOptions.find(existing => existing.value === option.value)) {
                        allOptions.push(option)
                      }
                    })

                    return allOptions
                  },
                  ...(initialOptions.length > 0 && { initialOptions }), // Provide initial options if available
                  ...(relationValue !== undefined && { value: relationValue }),
                  // Add custom wrapper to show view record link
                  customWrapper: (fieldElement: any) => {
                    return React.createElement(
                      RelationFieldWrapper,
                      {
                        relationType: field.type,
                        initialValue: relationValue,
                        fieldName: relationFieldName,
                      },
                      fieldElement
                    )
                  },
                })

                return selectField
              } else {
                // Fallback to text input if document not found
                console.warn(
                  `GraphQL document ${adminDocumentName} or ${regularDocumentName} not found for relation ${field.type}. Using text input instead.`,
                )
                return FormFieldClass.text(relationFieldName, {
                  label: `${label} ID`,
                  required: options.required,
                  helpText: 'Enter the ID of the related record',
                  ...(relationValue !== undefined && { value: relationValue }),
                })
              }
        }
        }

        // Handle legacy enum fields (with enumValues property)
        if (field.kind === 'enum' && field.enumValues) {
          const selectOptions = field.enumValues.map((value: string) => ({
            value,
            label: value
              .replace(/_/g, ' ')
              .toLowerCase()
              .replace(/^./, (str: string) => str.toUpperCase()),
          }))

          return FormFieldClass.select(field.name, {
            ...options,
            options: selectOptions,
          })
        }

        return FormFieldClass.text(field.name, options)
    }
  })

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
 * Convert string values to appropriate types (number, boolean, null)
 */
function convertStringValue(value: string): string | number | boolean | null {
  // Convert empty strings to null for optional fields
  if (value === '') {
    return null
  }

  // Handle boolean strings
  if (value === 'true') return true
  if (value === 'false') return false

  // Handle numeric strings (from form inputs)
  const numericPattern = /^\d+(\.\d+)?$/
  if (numericPattern.test(value)) {
    const numericValue = Number(value)
    if (!isNaN(numericValue)) {
      return numericValue
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
  const stringFieldNames = getStringFieldNamesForModel(model)

  // Get boolean field names for special handling
  const booleanFields = new Set(
    model?.fields
      ?.filter(field => field.type.toLowerCase() === 'boolean')
      ?.map(field => field.name) || [],
  )

  // Build a map of relation field names to their foreign key field names
  // Only for normal relations, not reverse relations
  const relationToForeignKeyMap = new Map<string, string>()
  if (model?.fields) {
    for (const field of model.fields) {
      if (field.relationName && !field.isList) {
        const isReverseRelation = !field.relationFromFields || field.relationFromFields.length === 0
        if (!isReverseRelation) {
          // Only map normal relations to their foreign key field (e.g., 'chapter' -> 'chapterId')
          relationToForeignKeyMap.set(field.name, getForeignKeyFieldName(field))
        }
        // For reverse relations, we keep the field name as-is (e.g., 'chapter' stays 'chapter')
      }
    }
  }

  for (const [key, value] of Object.entries(input)) {
    // Check if this key is a relation field that needs to be mapped to its foreign key
    const foreignKeyField = relationToForeignKeyMap.get(key)
    const actualKey = foreignKeyField || key

    // Special handling for boolean fields: convert undefined to false
    if (booleanFields.has(actualKey) && value === undefined) {
      cleaned[actualKey] = false
      continue
    }

    // Skip system fields and undefined values
    if (shouldSkipValue(actualKey, value)) {
      continue
    }

    // Handle string values with type conversion
    if (typeof value === 'string') {
      // For fields typed as String in the model, keep as string even if numeric-looking
      if (stringFieldNames.has(actualKey)) {
        cleaned[actualKey] = value === '' ? null : value
      } else {
        const convertedValue = convertStringValue(value)
        if (convertedValue !== null) {
          cleaned[actualKey] = convertedValue
        }
      }
      continue
    }

    // Handle searchSelectApollo option objects: {value: "id", label: "name"}
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>

      // Check if this looks like a searchSelectApollo option object
      if (obj.value !== undefined && obj.label !== undefined && typeof obj.value === 'string') {
        // Extract just the value (the ID) for GraphQL mutations
        cleaned[actualKey] = obj.value
        continue
      }

      // Handle other nested objects
      const processedNested = processNestedObject(obj, model)
      if (processedNested !== null) {
        cleaned[actualKey] = processedNested
      }
      continue
    }

    // Pass through other values as-is
    cleaned[actualKey] = value
  }

  return cleaned
}
