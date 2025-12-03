import React from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router'

interface AdminDataStateMessageProps {
  type: 'error' | 'loading' | 'not-found' | 'schema-error'
  title: string
  message: string
  basePath: string
  onRetry?: () => void
  backLinkText?: string
  backLinkPath?: string
}

/**
 * Reusable component for displaying error, loading, and other state messages
 * Extracted to reduce cognitive complexity in AdminDataEditPage
 */
export function AdminDataStateMessage({
  type,
  title,
  message,
  basePath,
  onRetry,
  backLinkText = 'Return to Data Browser',
  backLinkPath,
}: AdminDataStateMessageProps) {
  const iconColor = type === 'not-found' ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="flex flex-col justify-center py-12">
      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {type === 'loading' ? (
              <>
                <div className="mx-auto h-12 w-12 border-4 border-green-web border-t-transparent rounded-full animate-spin" />
                <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
              </>
            ) : (
              <>
                <ExclamationCircleIcon className={`mx-auto h-12 w-12 ${iconColor}`} />
                <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
                <div className="mt-6 space-y-3">
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-web hover:bg-green-web-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web"
                    >
                      Try Again
                    </button>
                  )}
                  <Link
                    to={backLinkPath || basePath}
                    className={`w-full flex justify-center py-2 px-4 border ${
                      onRetry ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50' : 'border-transparent text-white bg-green-web hover:bg-green-web-700'
                    } rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web`}
                  >
                    {backLinkText}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
