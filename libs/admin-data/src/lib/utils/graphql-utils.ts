import { type FormField, FormFieldClass } from '@nestledjs/forms'
import { getPluralName } from '@nestledjs/helpers'
import type { DatabaseModel } from '../types'

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
 * Build form fields for a model and operation
 */
export function buildFormFields(
  sdk: any,
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
        return FormFieldClass.dateTimePicker(field.name, options)

      case 'date':
        return FormFieldClass.datePicker(field.name, options)

      default:
        // Handle enum fields first (check if field type exists in the SDK)
        const enumValues = getEnumValues(sdk, field.type)
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
          const adminDocumentName = `__Admin${field.type}sDocument` // e.g., __AdminCoursesDocument
          const regularDocumentName = `${field.type}sDocument` // e.g., CoursesDocument (fallback)
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

            return FormFieldClass.searchSelectApollo(relationFieldName, {
              label: label, // Remove "ID" suffix - just use the field name
              required: options.required,
              dataType: field.type.toLowerCase() + 's', // e.g., Course → courses
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
            })
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
