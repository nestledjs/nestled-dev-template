import React from 'react'
import { Link } from 'react-router'
import { type FormField, FormFieldClass } from '@nestledjs/forms'
import { getPluralName } from '@nestledjs/helpers'
import type { DatabaseModel } from '../types'
import { RelationFieldWrapper } from '../components/RelationFieldWrapper'

/**
 * Dynamically get enum values from the SDK
 * This makes the utility portable across different projects by avoiding hardcoded enum imports
 */
function getEnumValues(sdk: any, enumType: string): string[] | null {
  try {
    // Try to get the enum from the SDK
    const enumObject = (sdk as any)[enumType]

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
export function getAdminDocuments(sdk: any, model: DatabaseModel) {
  if (!model || !model.name) {
    throw new Error('Invalid model provided to getAdminDocuments')
  }

  // Normalize model name for document lookup (handles FAQ -> Faq, etc.)
  const normalizedModelName = normalizeModelNameForDocument(model.name)
  const normalizedPluralName = normalizeModelNameForDocument(getPluralName(model.name))

  // Expected document names in the SDK (with __ prefix for admin operations)
  const singleQueryDocumentName = `__Admin${normalizedModelName}Document` // Single item query
  const listQueryDocumentName = `__Admin${normalizedPluralName}Document` // List query
  const updateDocumentName = `__AdminUpdate${normalizedModelName}Document`
  const deleteDocumentName = `__AdminDelete${normalizedModelName}Document`
  const createDocumentName = `__AdminCreate${normalizedModelName}Document`

  const documents = {
    query: (sdk as Record<string, any>)[singleQueryDocumentName], // For single item
    listQuery: (sdk as Record<string, any>)[listQueryDocumentName], // For lists
    update: (sdk as Record<string, any>)[updateDocumentName],
    delete: (sdk as Record<string, any>)[deleteDocumentName],
    create: (sdk as Record<string, any>)[createDocumentName],
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
      availableDocuments: Object.keys(sdk).filter(
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

/**
 * Convert model name to kebab-case for URLs
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
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
 * Build form fields for a model and operation
 */
export function buildFormFields(
  sdk: any,
  model: DatabaseModel,
  operation: 'create' | 'update',
  currentItem?: any,
  isSubmitting?: boolean,
  basePath: string = '/admin/data',
  databaseModels?: DatabaseModel[],
): FormField[] {
  // Filter out computed/readonly fields for forms
  const editableFields = model.fields.filter((field: any) => {
    // Skip ID field for create operations
    if (operation === 'create' && field.isId) return false

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

  // Process regular fields first
  regularFields.forEach((field: any) => {
    const label = field.name
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str: string) => str.toUpperCase())

    // Get initial value from currentItem for update operations
    let initialValue = currentItem && operation === 'update' ? currentItem[field.name] : undefined

    // Convert Date objects to proper format for date/datetime fields
    if (field.type.toLowerCase() === 'datetime' || field.type.toLowerCase() === 'date') {
      if (initialValue instanceof Date || (initialValue && typeof initialValue === 'string')) {
        try {
          const dateValue = initialValue instanceof Date ? initialValue : new Date(initialValue)

          if (field.type.toLowerCase() === 'date') {
            // Date fields: YYYY-MM-DD format
            initialValue = dateValue.toISOString().split('T')[0]
          } else {
            // DateTime fields: YYYY-MM-DDTHH:mm format (for datetime-local input)
            const isoString = dateValue.toISOString()
            // Extract YYYY-MM-DDTHH:mm (remove seconds and timezone)
            initialValue = isoString.substring(0, 16)
          }
        } catch (e) {
          console.warn(`Failed to convert date value for field ${field.name}:`, e)
          initialValue = ''
        }
      }
    }

    // Convert relation objects to their ID strings
    if (initialValue && typeof initialValue === 'object' && !Array.isArray(initialValue) && field.relationName) {
      const relationObj = initialValue as Record<string, unknown>
      if (relationObj.id && typeof relationObj.id === 'string') {
        initialValue = relationObj.id
      } else {
        initialValue = ''
      }
    }

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
    let formField: FormField

    switch (field.type.toLowerCase()) {
      case 'string':
        if (field.name.toLowerCase().includes('email')) {
          formField = FormFieldClass.email(field.name, options)
        }
        // For long text fields, use textarea
        else if (
          field.name.toLowerCase().includes('description') ||
          field.name.toLowerCase().includes('content') ||
          field.name.toLowerCase().includes('notes')
        ) {
          formField = FormFieldClass.textArea(field.name, options)
        } else {
          formField = FormFieldClass.text(field.name, options)
        }
        break

      case 'int':
      case 'bigint':
        formField = FormFieldClass.text(field.name, options)
        break

      case 'float':
      case 'decimal':
        formField = FormFieldClass.text(field.name, options)
        break

      case 'boolean': {
        // Boolean fields should never be "required" in forms, even if required in DB
        // Required in DB means "must have value (true OR false)", not "must be true"
        // For boolean fields, convert null/undefined to false for checkbox display
        const booleanValue =
          currentItem && operation === 'update' ? Boolean(currentItem[field.name]) : false
        formField = FormFieldClass.checkbox(field.name, {
          ...options,
          required: false,
          ...(operation === 'update' && { value: booleanValue }),
        })
        break
      }

      case 'datetime':
        formField = FormFieldClass.dateTimePicker(field.name, options)
        break

      case 'date':
        formField = FormFieldClass.datePicker(field.name, options)
        break

      default: {
        // Handle enum fields (check if field type exists in the SDK)
        const enumValues = getEnumValues(sdk, field.type)
        if (enumValues) {
          const selectOptions = enumValues.map((value: string) => ({
            value,
            label: value
              .replace(/_/g, ' ')
              .toLowerCase()
              .replace(/^./, (str: string) => str.toUpperCase()),
          }))

          formField = FormFieldClass.select(field.name, {
            ...options,
            options: selectOptions,
          })
          break
        }

        // Handle relation fields with Apollo-powered select dropdowns
        if (field.relationName && !field.isList) {
          const relationFieldName = field.relationFromFields?.[0] || field.name
          // For relation fields, get the foreign key value or extract ID from relation object
          let relationValue =
            currentItem && operation === 'update' ? currentItem[relationFieldName] : undefined

          // If relationValue is an object (like {__typename: 'Course', id: '...' }), extract the ID
          if (relationValue && typeof relationValue === 'object' && relationValue.id) {
            relationValue = relationValue.id
          }

          // Convert null to empty string
          if (relationValue === null) {
            relationValue = ''
          }

          // Use Apollo-powered select for relationships
          // Try to get the Admin GraphQL document for the relation type (with __ prefix)
          // Use proper pluralization from getPluralName helper
          const properPluralName = getPluralName(field.type)
          const adminDocumentName = `__Admin${properPluralName}Document` // e.g., __AdminCoursesDocument
          const regularDocumentName = `${properPluralName}Document` // e.g., CoursesDocument (fallback)
          const relationDocument =
            (sdk as any)[adminDocumentName] || (sdk as any)[regularDocumentName]

          if (relationDocument) {
            // Use single field based on model type (like existing working examples)
            let searchField = 'id' // Safe fallback

            if (field.type === 'Course') {
              searchField = 'title' // Course has title
            } else if (field.type === 'User') {
              searchField = 'name' // User likely has name
            } else if (field.type === 'Program') {
              searchField = 'name' // Program has name
            } else {
              // Try title first, then name, then id
              searchField = 'title' // Most common
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
                const displayLabel =
                  currentRelationData[searchField] ||
                  currentRelationData.title ||
                  currentRelationData.name ||
                  currentRelationData.id
                initialOptions = [
                  {
                    value: currentRelationData.id,
                    label: displayLabel,
                  },
                ]
              }
            }

            formField = FormFieldClass.searchSelectApollo(relationFieldName, {
              label: label, // Remove "ID" suffix - just use the field name
              required: options.required,
              dataType: properPluralName.charAt(0).toLowerCase() + properPluralName.slice(1), // e.g., Course → courses (camelCase)
              document: relationDocument,
              searchFields: [searchField], // For searching
              selectOptionsFunction: (items: unknown[]) => {
                // Combine initial options with query results (avoiding duplicates)
                const queryOptions = items.map((item: any) => ({
                  value: item.id,
                  label: item[searchField] || item.title || item.name || item.id,
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
              customWrapper: (fieldElement: React.ReactNode) => {
                return React.createElement(
                  RelationFieldWrapper,
                  {
                    relationType: field.type,
                    initialValue: relationValue,
                    fieldName: relationFieldName,
                    basePath,
                  },
                  fieldElement
                )
              },
            })
            break
          } else {
            // Fallback to text input if document not found
            console.warn(
              `GraphQL document ${adminDocumentName} or ${regularDocumentName} not found for relation ${field.type}. Using text input instead.`,
            )
            formField = FormFieldClass.text(relationFieldName, {
              label: `${label} ID`,
              required: options.required,
              helpText: 'Enter the ID of the related record',
              ...(relationValue !== undefined && { value: relationValue }),
            })
            break
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

          formField = FormFieldClass.select(field.name, {
            ...options,
            options: selectOptions,
          })
          break
        }

        formField = FormFieldClass.text(field.name, options)
        break
      }
    }

    // Push the form field
    formFields.push(formField)
  })

  // Now process list relationship fields (they go at the bottom)
  listRelationFields.forEach((field: any) => {
    const label = field.name
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str: string) => str.toUpperCase())

    // Only show list relationships on update operations
    if (operation === 'update' && currentItem) {
      const pluralModelName = getPluralName(field.type)
      const relatedModelKebab = toKebabCase(pluralModelName)
      const displayName = field.type.replace(/([a-z])([A-Z])/g, '$1 $2')
      const pluralDisplayName = getPluralName(displayName)

      // Determine the foreign key field name on the related model
      // Look up the related model and find the actual foreign key field
      const relatedModel = databaseModels?.find((m: DatabaseModel) => m.name === field.type)
      const foreignKeyFieldName =
        findForeignKeyFieldName(relatedModel, model.name, field.relationName) ||
        `${toLowerCamelCase(model.name)}Id` // Fallback to convention

      // Create the filter URL with the foreign key
      const filterUrl = `${basePath}/${relatedModelKebab}?${foreignKeyFieldName}=${currentItem.id}`

      // Get count if available in the current item data
      const countData = currentItem._count?.[field.name]
      const countText = countData !== undefined ? ` (${countData})` : ''

      const formField = FormFieldClass.content(field.name, {
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

      formFields.push(formField)
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
      console.warn(`Failed to convert datetime-local value: ${value}`)
      return value
    }
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

  // Get boolean field names for special handling
  const booleanFields = new Set(
    model?.fields
      ?.filter(field => field.type.toLowerCase() === 'boolean')
      ?.map(field => field.name) || [],
  )

  for (const [key, value] of Object.entries(input)) {
    // Special handling for boolean fields: convert undefined to false
    if (booleanFields.has(key) && value === undefined) {
      cleaned[key] = false
      continue
    }

    // Skip system fields and undefined values
    if (shouldSkipValue(key, value)) {
      continue
    }

    // Handle string values with type conversion
    if (typeof value === 'string') {
      // Find the field definition to help with type conversion
      const field = model?.fields?.find((f: any) => f.name === key)
      const convertedValue = convertStringValue(value, field)
      if (convertedValue !== null) {
        cleaned[key] = convertedValue
      }
      continue
    }

    // Handle searchSelectApollo option objects: {value: "id", label: "name"}
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>

      // Check if this looks like a searchSelectApollo option object
      if (obj.value !== undefined && obj.label !== undefined && typeof obj.value === 'string') {
        // Extract just the value (the ID) for GraphQL mutations
        cleaned[key] = obj.value
        continue
      }

      // Handle other nested objects
      const processedNested = processNestedObject(obj, model)
      if (processedNested !== null) {
        cleaned[key] = processedNested
      }
      continue
    }

    // Pass through other values as-is
    cleaned[key] = value
  }

  return cleaned
}
