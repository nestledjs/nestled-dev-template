import { gql, useMutation, useQuery } from '@apollo/client'
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/solid'
import { DATABASE_MODELS } from '@nestled-template/shared/sdk'
// Helper functions for admin data management
function findModelByName(name: string) {
  return DATABASE_MODELS.find(model => model.name === name)
}

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

function toReadableText(text: string): string {
  return text.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())
}
import { WebUiErrorBoundary } from '@nestled-template/web-ui'
import { Form } from '@nestledjs/forms'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { buildFormFields, cleanFormInput, getAdminDocuments } from '../utils/graphql-utils' // Load Apollo error messages in development

// Load Apollo error messages in development
if (process.env.NODE_ENV !== 'production') {
  loadDevMessages()
  loadErrorMessages()
}

// Security validation utilities
const sanitizeInput = (input: string | undefined): string => {
  if (!input || typeof input !== 'string') return ''

  // Remove potentially dangerous characters and limit length
  return input
    .replace(/[<>"'%;()&+]/g, '') // Remove common injection characters
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 100) // Limit length to prevent DoS
}

// Convert PascalCase to kebab-case for URLs (CourseChapter -> course-chapter)
const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert dash between lowercase and uppercase
    .toLowerCase() // Convert to lowercase
}

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
  const model = DATABASE_MODELS.find(m => m.name === properCaseDataType)
  if (!model) {
    console.warn(`[Security] Invalid dataType attempted: ${dataType}`)
    return null
  }

  return properCaseDataType
}

const validateId = (id: string | undefined): string | null => {
  if (!id) return null

  const sanitized = sanitizeInput(id)
  if (!sanitized) return null

  // Basic ID format validation (adjust based on your ID format)
  if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
    console.warn(`[Security] Invalid ID format attempted: ${id}`)
    return null
  }

  return sanitized
}

export function AdminDataEditPage() {
  const { dataType, id } = useParams()

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
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">Unauthorized</h2>
              <p className="mt-2 text-sm text-gray-600">
                Invalid data type, ID, or insufficient permissions.
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/data"
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
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto h-12 w-12 text-yellow-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">Model Not Found</h2>
              <p className="mt-2 text-sm text-gray-600">
                The data model for "{validatedDataType}" could not be found.
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/data"
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
  return <AdminDataEditPageContent model={model!} id={validatedId!} />
}

// =================================
// CONTENT COMPONENT
// =================================

function AdminDataEditPageContent({ model, id }: Readonly<{ model: any; id: string }>) {
  const navigate = useNavigate()

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
      return getAdminDocuments(model)
    } catch (error) {
      console.error('[AdminDataEditPage] Error getting documents:', error)
      return null
    }
  }, [model])

  const QUERY = useMemo(() => {
    if (!documents?.query) return null
    try {
      // Check if it's already a parsed GraphQL document
      if (documents.query?.definitions && documents.query?.loc) {
        return documents.query
      }
      return gql(documents.query)
    } catch (error) {
      console.error('[AdminDataEditPage] Error parsing QUERY:', error)
      return null
    }
  }, [documents])

  const UPDATE_MUTATION = useMemo(() => {
    if (!documents?.update) return null
    try {
      // Check if it's already a parsed GraphQL document
      if (documents.update?.definitions && documents.update?.loc) {
        return documents.update
      }
      return gql(documents.update)
    } catch (error) {
      console.error('[AdminDataEditPage] Error parsing UPDATE mutation:', error)
      return null
    }
  }, [documents])

  const DELETE_MUTATION = useMemo(() => {
    if (!documents?.delete) return null
    try {
      // Check if it's already a parsed GraphQL document
      if (documents.delete?.definitions && documents.delete?.loc) {
        return documents.delete
      }
      return gql(documents.delete)
    } catch (error) {
      console.error('[AdminDataEditPage] Error parsing DELETE mutation:', error)
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
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">GraphQL Schema Error</h2>
              <p className="mt-2 text-sm text-gray-600">
                Unable to load GraphQL documents for this model. Please ensure the API server is
                running and the GraphQL schema is up to date.
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/data"
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

  // Handle query errors
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">Error Loading Data</h2>
              <p className="mt-2 text-sm text-gray-600">{error.message}</p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => refetch()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-web hover:bg-green-web-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web"
                >
                  Try Again
                </button>
                <Link
                  to={`/admin/data/${toKebabCase(model.pluralName)}`}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web"
                >
                  Back to List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 border-4 border-green-web border-t-transparent rounded-full animate-spin" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">Loading...</h2>
              <p className="mt-2 text-sm text-gray-600">
                Loading {toReadableText(model.name)} data...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get the item data
  const item = data?.[responseFieldName]

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto h-12 w-12 text-yellow-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">Not Found</h2>
              <p className="mt-2 text-sm text-gray-600">
                The {toReadableText(model.name)} you're looking for doesn't exist or has been
                deleted.
              </p>
              <div className="mt-6">
                <Link
                  to={`/admin/data/${toKebabCase(model.pluralName)}`}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-web hover:bg-green-web-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web"
                >
                  Back to List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Build form fields with initial values
  const formFields = buildFormFields(model, 'update', item)

  // Extract initial values for the Form component
  const initialValues: Record<string, any> = {}
  if (item) {
    // Get editable fields and map their current values
    const editableFields = model.fields.filter((field: any) => {
      if (field.isId && false) return false // Keep ID for edit
      if (field.isReadOnly || field.isGenerated) return false
      if (field.isUpdatedAt || field.name === 'createdAt') return false
      if (field.relationName && field.isList) return false
      return true
    })

    editableFields.forEach((field: any) => {
      let value = item[field.name]

      // Handle relation fields - get the foreign key value
      if (field.relationName && !field.isList) {
        const relationFieldName = field.relationFromFields?.[0] || field.name
        value = item[relationFieldName]
        if (value && typeof value === 'object' && value.id) {
          value = value.id
        }
        initialValues[relationFieldName] = value || ''
      } else {
        // Convert null to empty string for form fields
        if (value === null && field.type.toLowerCase() !== 'boolean') {
          value = ''
        }
        // For boolean fields, ensure we have a proper boolean
        if (field.type.toLowerCase() === 'boolean') {
          value = Boolean(value)
        }
        initialValues[field.name] = value
      }
    })
  }

  // Handle form submission
  const handleSubmit = async (formData: Record<string, unknown>) => {
    try {
      setSubmissionState({ status: 'loading' })

      // Clean the form input
      const cleanedInput = cleanFormInput(formData, model)

      // Execute mutation
      const result = await updateMutation({
        variables: {
          input: cleanedInput,
          [idVariableName]: id,
        },
      })

      if (result.errors) {
        console.error('GraphQL errors:', result.errors)
        setSubmissionState({
          status: 'error',
          message: result.errors.map(err => err.message).join(', '),
        })
        return
      }

      setSubmissionState({
        status: 'success',
        message: `${toReadableText(model.name)} updated successfully!`,
      })

      // Refetch the data to show updated values
      await refetch()
    } catch (error) {
      console.error('Error updating record:', error)
      setSubmissionState({
        status: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    }
  }

  // Handle delete
  const handleDelete = async () => {
    try {
      setDeleteState({ status: 'loading' })

      const result = await deleteMutation({
        variables: {
          [idVariableName]: id,
        },
      })

      if (result.errors) {
        console.error('GraphQL errors:', result.errors)
        setDeleteState({
          status: 'error',
          message: result.errors.map(err => err.message).join(', '),
        })
        return
      }

      setDeleteState({
        status: 'success',
        message: `${toReadableText(model.name)} deleted successfully!`,
      })

      // Redirect after a brief delay
      setTimeout(() => {
        navigate(`/admin/data/${toKebabCase(model.pluralName)}`)
      }, 1500)
    } catch (error) {
      console.error('Error deleting record:', error)
      setDeleteState({
        status: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/admin/data" className="text-gray-400 hover:text-gray-500">
                  Data Browser
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
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
                    to={`/admin/data/${toKebabCase(model.pluralName)}`}
                    className="ml-4 text-gray-400 hover:text-gray-500"
                  >
                    {toReadableText(model.pluralName)}
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-4 text-gray-500">Edit</span>
                </div>
              </li>
            </ol>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Edit {toReadableText(model.name)}</h1>
            <button
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
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Delete {toReadableText(model.name)}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this{' '}
                      {toReadableText(model.name).toLowerCase()}? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleDelete}
                  disabled={deleteState.status === 'loading'}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteState.status === 'loading' ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteState.status === 'loading'}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submission Status */}
        {(submissionState.status !== 'idle' || deleteState.status !== 'idle') && (
          <div
            className={`mb-6 rounded-md p-4 ${
              submissionState.status === 'success' || deleteState.status === 'success'
                ? 'bg-green-50 border border-green-200'
                : submissionState.status === 'error' || deleteState.status === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {submissionState.status === 'success' || deleteState.status === 'success' ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                ) : submissionState.status === 'error' || deleteState.status === 'error' ? (
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                ) : (
                  <div className="h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    submissionState.status === 'success' || deleteState.status === 'success'
                      ? 'text-green-800'
                      : submissionState.status === 'error' || deleteState.status === 'error'
                        ? 'text-red-800'
                        : 'text-blue-800'
                  }`}
                >
                  {submissionState.status === 'loading'
                    ? `Updating ${toReadableText(model.name)}...`
                    : deleteState.status === 'loading'
                      ? `Deleting ${toReadableText(model.name)}...`
                      : submissionState.message || deleteState.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-8">
            <Form
              id={`edit-${model.name.toLowerCase()}-form`}
              fields={formFields}
              submit={handleSubmit}
              disabled={submissionState.status === 'loading' || deleteState.status === 'loading'}
              defaultValues={initialValues}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminDataEditErrorBoundary({ error }: Readonly<{ error: Error }>) {
  return <WebUiErrorBoundary error={error} />
}
