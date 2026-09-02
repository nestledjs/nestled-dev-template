import React, { useEffect, useMemo, useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/solid'
import { ErrorBoundary } from '@nestledjs/shared-components'
import { Form } from '@nestledjs/forms'
import { formatLocalDateTime } from '@nestledjs/forms-core'
import { useAdminDataContext } from '../context/AdminDataContext'
import { AdminDataStateMessage } from '../components/AdminDataStateMessage'

function toLowerCamelCase(name: string): string {
  if (!name) return ''
  return name.charAt(0).toLowerCase() + name.slice(1)
}

function getModelIdVariableName(modelName: string): string {
  return `${toLowerCamelCase(modelName)}Id`
}

function getModelResponseFieldName(modelName: string): string {
  return toLowerCamelCase(modelName)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

import { Link, useNavigate, useParams } from 'react-router'
import {
  buildFormFields,
  cleanFormInput,
  getAdminDocuments,
  sanitizeInput,
  toKebabCase,
  toReadableText,
} from '../utils/graphql-utils'

if (process.env.NODE_ENV !== 'production') {
  loadDevMessages()
  loadErrorMessages()
}

// =================================
// INITIAL VALUES EXTRACTION HELPERS
// =================================

/**
 * Process relation field value to extract foreign key ID
 */
function processRelationFieldValue(field: any, item: any): string {
  const relationFieldName = field.relationFromFields?.[0] || `${field.name}Id`
  let value = item[relationFieldName]

  // Try to get value from relation object if foreign key not found
  if (value === undefined) {
    const relationObject = item[field.name]
    if (relationObject && typeof relationObject === 'object' && relationObject.id) {
      value = relationObject.id
    }
  }

  // Extract ID from object if still an object
  if (value && typeof value === 'object') {
    value = value.id || ''
  }

  return value || ''
}

/**
 * Process date/datetime field value to proper format.
 *
 * The `datetime-local` input holds local wall-clock time and is submitted back as
 * `new Date(local).toISOString()`, so a datetime must be written into it in LOCAL components.
 * Using `toISOString()` here would put the UTC wall-clock into a local-reading input and shift the
 * stored instant by the viewer's UTC offset on every save. A calendar `date` carries no time,
 * is stored as UTC midnight and submitted as a bare 'YYYY-MM-DD', so it stays on the UTC day.
 */
function processDateFieldValue(field: any, value: any): string {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  const dateValue = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(dateValue.getTime())) {
    console.error('Unparseable date value for form field:', value)
    return ''
  }

  if (field.type.toLowerCase() === 'date') {
    return dateValue.toISOString().split('T')[0]
  }
  return formatLocalDateTime(dateValue)
}

/**
 * Sanitize field value to primitive types
 */
function sanitizeFieldValue(value: any, field: any): any {
  const fieldTypeLower = field.type.toLowerCase()

  // Handle null values
  if (value === null) {
    return fieldTypeLower === 'boolean' ? false : ''
  }

  // Handle boolean fields
  if (fieldTypeLower === 'boolean') {
    return Boolean(value)
  }

  // Extract ID from objects
  if (value !== null && typeof value === 'object' && 'id' in value) {
    return value.id || ''
  }

  // Convert remaining objects to empty string
  if (typeof value === 'object') {
    return ''
  }

  return value
}

/**
 * Perform final safety checks on all initial values
 */
function performFinalSafetyChecks(initialValues: Record<string, any>, model: any): void {
  for (const [key, value] of Object.entries(initialValues)) {
    if (value === undefined) {
      initialValues[key] = ''
      continue
    }

    if (value === null || typeof value !== 'object') {
      continue
    }

    // Extract ID from remaining objects
    if ('id' in value && typeof value.id === 'string') {
      initialValues[key] = value.id
    } else if (value instanceof Date) {
      const field = model.fields.find((f: any) => f.name === key)
      initialValues[key] = processDateFieldValue(field ?? { type: 'datetime' }, value)
    } else {
      initialValues[key] = ''
    }
  }
}

/**
 * Extract initial values from item for form fields
 */
function extractInitialValues(model: any, item: any): Record<string, any> {
  const initialValues: Record<string, any> = {}

  if (!item) {
    return initialValues
  }

  // Include ID field
  const idField = model.fields.find((f: any) => f.isId)
  if (idField) {
    initialValues[idField.name] = item[idField.name]
  }

  // Get editable fields
  const editableFields = model.fields.filter((field: any) => {
    if (field.isId || field.isReadOnly || field.isGenerated) return false
    if (field.isUpdatedAt || field.name === 'createdAt') return false
    if (field.relationName && field.isList) return false
    return true
  })

  // Process each field
  editableFields.forEach((field: any) => {
    let value = item[field.name]

    if (field.relationName && !field.isList) {
      const relationFieldName = field.relationFromFields?.[0] || `${field.name}Id`
      initialValues[relationFieldName] = processRelationFieldValue(field, item)
    } else {
      const fieldTypeLower = field.type.toLowerCase()

      // Handle enum arrays BEFORE sanitization (arrays are objects and would be converted to '')
      if (field.kind === 'enum' && field.isList) {
        // Ensure value is an array
        if (!Array.isArray(value)) {
          value = []
        }
        value = value.join(',')
      } else if (fieldTypeLower === 'datetime' || fieldTypeLower === 'date') {
        value = processDateFieldValue(field, value)
      } else {
        value = sanitizeFieldValue(value, field)
      }

      initialValues[field.name] = value
    }
  })

  // Final safety checks
  performFinalSafetyChecks(initialValues, model)

  return initialValues
}

// Validation functions moved into component to access databaseModels from context

const validateId = (id: string | undefined): string | null => {
  if (!id) return null

  const sanitized = sanitizeInput(id)
  if (!sanitized) return null

  // Basic ID format validation (adjust based on your ID format)
  if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
    return null
  }

  return sanitized
}

export function AdminDataEditPage() {
  const { dataType, id } = useParams()
  const {
    databaseModels,
    basePath = '/admin/data',
    formTheme,
    displayFieldConfig,
  } = useAdminDataContext()

  // Helper function to find model by name
  const findModelByName = (name: string) => {
    return databaseModels.find(model => model.name === name)
  }

  // Validate data type
  const validateDataType = (dataType: string | undefined): string | null => {
    if (!dataType) return null

    const sanitized = sanitizeInput(dataType)
    if (!sanitized) return null

    // Convert kebab-case to PascalCase (course-chapter -> CourseChapter)
    const properCaseDataType = sanitized
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')

    // Check if this data type exists in our models
    if (!databaseModels.some(m => m.name === properCaseDataType)) {
      return null
    }

    return properCaseDataType
  }

  // Security validation
  const validatedDataType = validateDataType(dataType)
  const validatedId = validateId(id)

  // Determine what to render based on validation
  const shouldShowUnauthorized = !validatedDataType || !validatedId
  const model = validatedDataType ? findModelByName(validatedDataType) : null
  const shouldShowModelNotFound = validatedDataType && validatedId && !model

  // Render error states
  if (shouldShowUnauthorized) {
    return (
      <div className="flex flex-col justify-center py-12">
        <div className="mt-8 mx-auto w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                Unauthorized
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Invalid data type, ID, or insufficient permissions.
              </p>
              <div className="mt-6">
                <Link
                  to={basePath}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-web hover:bg-green-web-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web"
                >
                  Return to Data Browser
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (shouldShowModelNotFound) {
    return (
      <div className="flex flex-col justify-center py-12">
        <div className="mt-8 mx-auto w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto h-12 w-12 text-yellow-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                Model Not Found
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                The data model for "{validatedDataType}" could not be found.
              </p>
              <div className="mt-6">
                <Link
                  to={basePath}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-web hover:bg-green-web-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web"
                >
                  Return to Data Browser
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // At this point we know model exists and is valid
  return (
    <AdminDataEditPageContent
      model={model}
      id={validatedId}
      basePath={basePath}
      formTheme={formTheme}
      displayFieldConfig={displayFieldConfig}
    />
  )
}

// =================================
// SUB-COMPONENTS
// =================================

interface DeleteConfirmModalProps {
  readonly show: boolean
  readonly modelName: string
  readonly isDeleting: boolean
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

function DeleteConfirmModal({
  show,
  modelName,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Delete {toReadableText(modelName)}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this {toReadableText(modelName).toLowerCase()}? This
                action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

type StatusType = 'idle' | 'loading' | 'success' | 'error'

interface StatusMessageProps {
  readonly submissionStatus: StatusType
  readonly deleteStatus: StatusType
  readonly submissionMessage?: string
  readonly deleteMessage?: string
  readonly modelName: string
}

function getStatusColors(
  isSuccess: boolean,
  isError: boolean,
): { bgColor: string; textColor: string } {
  if (isSuccess) {
    return {
      bgColor: 'bg-green-50 border border-green-200',
      textColor: 'text-green-800',
    }
  }
  if (isError) {
    return {
      bgColor: 'bg-red-50 border border-red-200',
      textColor: 'text-red-800',
    }
  }
  return {
    bgColor: 'bg-blue-50 border border-blue-200',
    textColor: 'text-blue-800',
  }
}

function getStatusIcon(isSuccess: boolean, isError: boolean): React.ReactElement {
  if (isSuccess) {
    return <CheckCircleIcon className="h-5 w-5 text-green-400" />
  }
  if (isError) {
    return <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
  }
  return (
    <div className="h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
  )
}

function StatusMessage({
  submissionStatus,
  deleteStatus,
  submissionMessage,
  deleteMessage,
  modelName,
}: StatusMessageProps) {
  if (submissionStatus === 'idle' && deleteStatus === 'idle') return null

  const isSuccess = submissionStatus === 'success' || deleteStatus === 'success'
  const isError = submissionStatus === 'error' || deleteStatus === 'error'
  const isLoading = submissionStatus === 'loading' || deleteStatus === 'loading'

  const { bgColor, textColor } = getStatusColors(isSuccess, isError)

  const loadingMessage =
    submissionStatus === 'loading'
      ? `Updating ${toReadableText(modelName)}...`
      : `Deleting ${toReadableText(modelName)}...`
  const message = isLoading ? loadingMessage : submissionMessage || deleteMessage

  return (
    <div className={`mb-6 rounded-md p-4 ${bgColor}`}>
      <div className="flex">
        <div className="flex-shrink-0">{getStatusIcon(isSuccess, isError)}</div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
      </div>
    </div>
  )
}

// =================================
// HELPER FUNCTIONS
// =================================

async function executeUpdateMutation(
  updateMutation: any,
  formData: Record<string, unknown>,
  model: any,
  id: string,
  idVariableName: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanedInput = cleanFormInput(formData, model)
    const result = await updateMutation({
      variables: {
        input: cleanedInput,
        [idVariableName]: id,
      },
    })

    if (result.errors) {
      return {
        success: false,
        message: result.errors.map((err: any) => err.message).join(', '),
      }
    }

    return {
      success: true,
      message: `${toReadableText(model.name)} updated successfully!`,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

async function executeDeleteMutation(
  deleteMutation: any,
  id: string,
  idVariableName: string,
  model: any,
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await deleteMutation({
      variables: {
        [idVariableName]: id,
      },
    })

    if (result.errors) {
      return {
        success: false,
        message: result.errors.map((err: any) => err.message).join(', '),
      }
    }

    return {
      success: true,
      message: `${toReadableText(model.name)} deleted successfully!`,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

// =================================
// CONTENT COMPONENT
// =================================

function AdminDataEditPageContent({
  model,
  id,
  basePath,
  formTheme,
  displayFieldConfig,
}: Readonly<{
  model: any
  id: string
  basePath: string
  formTheme: any
  displayFieldConfig?: any
}>) {
  const navigate = useNavigate()
  const { sdk, databaseModels } = useAdminDataContext()

  // State
  const [submissionState, setSubmissionState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error'
    message?: string
  }>({ status: 'idle' })

  const [deleteState, setDeleteState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error'
    message?: string
  }>({ status: 'idle' })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Get GraphQL documents with error handling (memoized to prevent render loops)
  const documents = useMemo(() => {
    try {
      return getAdminDocuments(sdk, model)
    } catch (error) {
      console.error('Unexpected error:', error)
      return null
    }
  }, [sdk, model])

  const QUERY = useMemo(() => {
    if (!documents?.query) return null
    try {
      // Check if it's already a parsed GraphQL document (TypedDocumentNode)
      if (documents.query?.kind === 'Document' && documents.query?.definitions) {
        return documents.query
      }
      return gql(documents.query)
    } catch (error) {
      console.error('Unexpected error:', error)
      return null
    }
  }, [documents])

  const UPDATE_MUTATION = useMemo(() => {
    if (!documents?.update) return null
    try {
      // Check if it's already a parsed GraphQL document (TypedDocumentNode)
      if (documents.update?.kind === 'Document' && documents.update?.definitions) {
        return documents.update
      }
      return gql(documents.update)
    } catch (error) {
      console.error('Unexpected error:', error)
      return null
    }
  }, [documents])

  const DELETE_MUTATION = useMemo(() => {
    if (!documents?.delete) return null
    try {
      // Check if it's already a parsed GraphQL document (TypedDocumentNode)
      if (documents.delete?.kind === 'Document' && documents.delete?.definitions) {
        return documents.delete
      }
      return gql(documents.delete)
    } catch (error) {
      console.error('Unexpected error:', error)
      return null
    }
  }, [documents])

  // Variables for GraphQL operations
  const idVariableName = getModelIdVariableName(model.name)
  const responseFieldName = getModelResponseFieldName(model.name)

  // Query for existing data - use skip to prevent running when documents are missing
  const { data, loading, error, refetch } = useQuery(
    QUERY ||
      gql`
        query PlaceholderQuery {
          __typename
        }
      `,
    {
      variables: { [idVariableName]: id },
      errorPolicy: 'all',
      skip: !QUERY || !id,
    },
  )

  // Mutations - provide placeholder mutations to prevent hook order issues
  const [updateMutation] = useMutation(
    UPDATE_MUTATION ||
      gql`
        mutation PlaceholderUpdate {
          __typename
        }
      `,
  )
  const [deleteMutation] = useMutation(
    DELETE_MUTATION ||
      gql`
        mutation PlaceholderDelete {
          __typename
        }
      `,
  )

  // ALL useEffect hooks MUST be called before any early returns
  // Navigate to list after successful delete
  useEffect(() => {
    if (deleteState.status !== 'success') return
    const timer = setTimeout(() => {
      navigate(`${basePath}/${toKebabCase(model.pluralName)}`)
    }, 1500)
    return () => clearTimeout(timer)
  }, [deleteState.status, navigate, basePath, model.pluralName])

  // Clear submission state after errors
  useEffect(() => {
    if (submissionState.status === 'error') {
      const timer = setTimeout(() => {
        setSubmissionState({ status: 'idle' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [submissionState.status])

  useEffect(() => {
    if (deleteState.status === 'error') {
      const timer = setTimeout(() => {
        setDeleteState({ status: 'idle' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [deleteState.status])

  // Early returns after ALL hooks are called
  if (!documents || !QUERY || !UPDATE_MUTATION || !DELETE_MUTATION) {
    return (
      <AdminDataStateMessage
        type="schema-error"
        title="GraphQL Schema Error"
        message="Unable to load GraphQL documents for this model. Please ensure the API server is running and the GraphQL schema is up to date."
        basePath={basePath}
      />
    )
  }

  // Handle query errors
  if (error) {
    return (
      <AdminDataStateMessage
        type="error"
        title="Error Loading Data"
        message={error.message}
        basePath={basePath}
        onRetry={() => refetch()}
        backLinkText="Back to List"
        backLinkPath={`${basePath}/${toKebabCase(model.pluralName)}`}
      />
    )
  }

  // Show loading state
  if (loading) {
    return (
      <AdminDataStateMessage
        type="loading"
        title="Loading..."
        message={`Loading ${toReadableText(model.name)} data...`}
        basePath={basePath}
      />
    )
  }

  // Get the item data
  const item = isRecord(data) ? data[responseFieldName] : undefined

  if (!isRecord(item)) {
    return (
      <AdminDataStateMessage
        type="not-found"
        title="Not Found"
        message={`The ${toReadableText(model.name)} you're looking for doesn't exist or has been deleted.`}
        basePath={basePath}
        backLinkText="Back to List"
        backLinkPath={`${basePath}/${toKebabCase(model.pluralName)}`}
      />
    )
  }

  // Build form fields without values (we'll use defaultValues prop instead)
  const formFields = buildFormFields(sdk, model, 'update', {
    currentItem: item,
    isSubmitting: submissionState.status === 'loading',
    basePath,
    databaseModels,
    displayFieldConfig,
  })

  // Extract initial values for the Form component
  const initialValues = extractInitialValues(model, item)

  // Handle form submission
  const handleSubmit = async (formData: Record<string, unknown>) => {
    setSubmissionState({ status: 'loading' })

    const result = await executeUpdateMutation(updateMutation, formData, model, id, idVariableName)

    setSubmissionState({
      status: result.success ? 'success' : 'error',
      message: result.message,
    })

    if (globalThis.window !== undefined) {
      globalThis.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (result.success) {
      await refetch()
    }
  }

  // Handle delete
  const handleDelete = async () => {
    setDeleteState({ status: 'loading' })

    const result = await executeDeleteMutation(deleteMutation, id, idVariableName, model)

    setDeleteState({
      status: result.success ? 'success' : 'error',
      message: result.message,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link
                to={basePath}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
              >
                Data Browser
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300 dark:text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <Link
                  to={`${basePath}/${toKebabCase(model.pluralName)}`}
                  className="ml-4 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                >
                  {toReadableText(model.pluralName)}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300 dark:text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-4 text-gray-500 dark:text-gray-400">Edit</span>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Edit {toReadableText(model.name)}
          </h1>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleteState.status === 'loading'}
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={showDeleteConfirm}
        modelName={model.name}
        isDeleting={deleteState.status === 'loading'}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Submission Status */}
      <StatusMessage
        submissionStatus={submissionState.status}
        deleteStatus={deleteState.status}
        submissionMessage={submissionState.message}
        deleteMessage={deleteState.message}
        modelName={model.name}
      />

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <div className="px-6 py-8">
          <Form
            id={`edit-${model.name.toLowerCase()}-form`}
            fields={formFields}
            submit={handleSubmit}
            disabled={submissionState.status === 'loading' || deleteState.status === 'loading'}
            defaultValues={initialValues}
            theme={formTheme}
          />
        </div>
      </div>
    </div>
  )
}

export function AdminDataEditErrorBoundary({ error }: Readonly<{ error: Error }>) {
  return <ErrorBoundary error={error} />
}
