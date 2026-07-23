import React, { useEffect, useMemo, useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { ErrorBoundary } from '@nestledjs/shared-components'
import { Form } from '@nestledjs/forms'
import { useAdminDataContext } from '../context/AdminDataContext'
import { Link, useNavigate, useParams } from 'react-router'
import {
  buildFormFields,
  cleanFormInput,
  getAdminDocuments,
  sanitizeInput,
  toKebabCase,
  toReadableText,
} from '../utils/graphql-utils'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function mutationErrorMessage(result: unknown): string | null {
  if (!isRecord(result)) {
    return null
  }

  if (isRecord(result.error) && typeof result.error.message === 'string') {
    return result.error.message
  }

  if (!Array.isArray(result.errors) || result.errors.length === 0) {
    return null
  }

  return result.errors
    .map(error => (isRecord(error) && typeof error.message === 'string' ? error.message : null))
    .filter((message): message is string => message !== null)
    .join(', ')
}

// Validation functions moved into component to access databaseModels from context

// Check if user has access to this data type (basic implementation)
function checkAccess(dataType: string): boolean {
  // For now, allow access to all data types in admin
  // In a real app, this would check user permissions
  return true
}

// =================================
// MAIN COMPONENT
// =================================

export function AdminDataCreatePage() {
  const { dataType } = useParams()
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

  // Validate data type against allowed models
  const validateDataType = (dataType: string | undefined): string | null => {
    const sanitized = sanitizeInput(dataType)
    if (!sanitized) return null

    // Convert kebab-case to PascalCase (course-chapter -> CourseChapter)
    const properCaseDataType = sanitized
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')

    // Check if this data type exists in our models
    return databaseModels.some(m => m.name === properCaseDataType) ? properCaseDataType : null
  }

  // Security validation
  const validatedDataType = validateDataType(dataType)

  // Determine what to render based on validation
  const shouldShowUnauthorized = !validatedDataType
  const shouldShowAccessDenied = validatedDataType && !checkAccess(validatedDataType)
  const model = validatedDataType ? findModelByName(validatedDataType) : null
  const shouldShowModelNotFound = validatedDataType && !shouldShowAccessDenied && !model

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
                Invalid data type or insufficient permissions.
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

  if (shouldShowAccessDenied) {
    return (
      <div className="flex flex-col justify-center py-12">
        <div className="mt-8 mx-auto w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                Access Denied
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                You don't have permission to create {toReadableText(validatedDataType ?? '')}{' '}
                records.
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
  if (!model) return null
  return (
    <AdminDataCreatePageContent
      model={model}
      basePath={basePath}
      formTheme={formTheme}
      displayFieldConfig={displayFieldConfig}
    />
  )
}

// =================================
// CONTENT COMPONENT
// =================================

function AdminDataCreatePageContent({
  model,
  basePath,
  formTheme,
  displayFieldConfig,
}: Readonly<{ model: any; basePath: string; formTheme: any; displayFieldConfig?: any }>) {
  const navigate = useNavigate()
  const { sdk, databaseModels } = useAdminDataContext()

  // State
  const [submissionState, setSubmissionState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error'
    message?: string
  }>({ status: 'idle' })

  // Get GraphQL documents with error handling (memoized to prevent render loops)
  const documents = useMemo(() => {
    try {
      return getAdminDocuments(sdk, model)
    } catch (error) {
      console.error('Unexpected error:', error)
      return null
    }
  }, [sdk, model])

  const CREATE_MUTATION = useMemo(() => {
    if (!documents?.create) return null
    try {
      // Check if it's already a parsed GraphQL document (TypedDocumentNode)
      if (documents.create?.kind === 'Document' && documents.create?.definitions) {
        return documents.create
      }

      return gql(documents.create)
    } catch (error) {
      console.error('Unexpected error:', error)
      return null
    }
  }, [documents])

  // Create mutation - call BEFORE any early returns to maintain hook order
  const [createMutation] = useMutation(
    CREATE_MUTATION ||
      gql`
        mutation PlaceholderCreate {
          __typename
        }
      `,
  )

  // Navigate to list after successful create
  useEffect(() => {
    if (submissionState.status !== 'success') return
    const timer = setTimeout(() => {
      navigate(`${basePath}/${toKebabCase(model.pluralName)}`)
    }, 1500)
    return () => clearTimeout(timer)
  }, [submissionState.status, navigate, basePath, model.pluralName])

  // Clear submission state after errors
  useEffect(() => {
    if (submissionState.status === 'error') {
      const timer = setTimeout(() => {
        setSubmissionState({ status: 'idle' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [submissionState.status])

  // Early return AFTER all hooks are called
  if (!documents || !CREATE_MUTATION) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                GraphQL Schema Error
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Unable to load GraphQL documents for this model. Please ensure the API server is
                running and the GraphQL schema is up to date.
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

  // Build form fields
  const formFields = buildFormFields(sdk, model, 'create', {
    isSubmitting: submissionState.status === 'loading',
    basePath,
    databaseModels,
    displayFieldConfig,
  })

  // Handle form submission
  const handleSubmit = async (formData: Record<string, unknown>) => {
    try {
      setSubmissionState({ status: 'loading' })

      // Clean the form input
      const cleanedInput = cleanFormInput(formData, model)

      // Execute mutation
      const result = await createMutation({
        variables: {
          input: cleanedInput,
        },
      })

      const mutationError = mutationErrorMessage(result)
      if (mutationError) {
        setSubmissionState({
          status: 'error',
          message: mutationError,
        })
        return
      }

      setSubmissionState({
        status: 'success',
        message: `${toReadableText(model.name)} created successfully!`,
      })
    } catch (error) {
      setSubmissionState({
        status: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    }
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
                <span className="ml-4 text-gray-500 dark:text-gray-400">Create New</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create {toReadableText(model.name)}
        </h1>
      </div>

      {/* Submission Status */}
      {submissionState.status !== 'idle' &&
        (() => {
          const isSuccess = submissionState.status === 'success'
          const isError = submissionState.status === 'error'
          let bgClass = 'bg-blue-50 border border-blue-200'
          if (isSuccess) bgClass = 'bg-green-50 border border-green-200'
          else if (isError) bgClass = 'bg-red-50 border border-red-200'
          let textClass = 'text-blue-800'
          if (isSuccess) textClass = 'text-green-800'
          else if (isError) textClass = 'text-red-800'
          let icon = (
            <div className="h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          )
          if (isSuccess) icon = <CheckCircleIcon className="h-5 w-5 text-green-400" />
          else if (isError) icon = <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
          const message =
            submissionState.status === 'loading'
              ? `Creating ${toReadableText(model.name)}...`
              : submissionState.message
          return (
            <div className={`mb-6 rounded-md p-4 ${bgClass}`}>
              <div className="flex">
                <div className="flex-shrink-0">{icon}</div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${textClass}`}>{message}</p>
                </div>
              </div>
            </div>
          )
        })()}

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <div className="px-6 py-8">
          <Form
            id={`create-${model.name.toLowerCase()}-form`}
            fields={formFields}
            submit={handleSubmit}
            disabled={submissionState.status === 'loading'}
            theme={formTheme}
          />
        </div>
      </div>
    </div>
  )
}

export function AdminDataCreateErrorBoundary({ error }: Readonly<{ error: Error }>) {
  return <ErrorBoundary error={error} />
}
