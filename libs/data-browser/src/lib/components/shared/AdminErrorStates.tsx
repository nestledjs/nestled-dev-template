import React from 'react'
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

export type ErrorSeverity = 'warning' | 'error' | 'critical'

export interface AdminErrorStateProps {
  readonly title: string
  readonly message?: string
  readonly severity?: ErrorSeverity
  readonly onRetry?: () => void
  readonly onDismiss?: () => void
  readonly className?: string
  readonly showIcon?: boolean
}

export interface AdminEmptyStateProps {
  readonly title: string
  readonly message?: string
  readonly actionLabel?: string
  readonly onAction?: () => void
  readonly className?: string
  readonly icon?: React.ComponentType<{ className?: string }>
}

export interface AdminLoadingStateProps {
  readonly title?: string
  readonly message?: string
  readonly className?: string
  readonly size?: 'small' | 'medium' | 'large'
}

const getSeverityConfig = (severity: ErrorSeverity) => {
  const configs = {
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
      buttonColor: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    },
    error: {
      icon: ExclamationCircleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-400',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      buttonColor: 'bg-red-100 text-red-800 hover:bg-red-200',
    },
    critical: {
      icon: XCircleIcon,
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
      iconColor: 'text-red-500',
      titleColor: 'text-red-900',
      messageColor: 'text-red-800',
      buttonColor: 'bg-red-200 text-red-900 hover:bg-red-300',
    },
  }
  return configs[severity]
}

export function AdminErrorState({
  title,
  message,
  severity = 'error',
  onRetry,
  onDismiss,
  className = '',
  showIcon = true,
}: Readonly<AdminErrorStateProps>) {
  const config = getSeverityConfig(severity)
  const IconComponent = config.icon

  return (
    <div className={`rounded-md border p-4 ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <IconComponent className={`h-5 w-5 ${config.iconColor}`} aria-hidden="true" />
          </div>
        )}
        <div className={showIcon ? 'ml-3' : ''}>
          <h3 className={`text-sm font-medium ${config.titleColor}`}>{title}</h3>
          {message && (
            <div className={`mt-2 text-sm ${config.messageColor}`}>
              <p>{message}</p>
            </div>
          )}
          {(onRetry || onDismiss) && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className={`rounded-md px-2 py-1.5 text-sm font-medium ${config.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                  >
                    Try Again
                  </button>
                )}
                {onDismiss && (
                  <button
                    type="button"
                    onClick={onDismiss}
                    className={`ml-3 rounded-md px-2 py-1.5 text-sm font-medium ${config.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AdminEmptyState({
  title,
  message,
  actionLabel,
  onAction,
  className = '',
  icon: IconComponent,
}: Readonly<AdminEmptyStateProps>) {
  return (
    <div className={`text-center ${className}`}>
      {IconComponent && <IconComponent className="mx-auto h-12 w-12 text-gray-400" />}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
      {actionLabel && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center rounded-md bg-green-web px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-web-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-web"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  )
}

export function AdminLoadingState({
  title = 'Loading...',
  message,
  className = '',
  size = 'medium',
}: Readonly<AdminLoadingStateProps>) {
  const getSizeClasses = () => {
    const sizes = {
      small: 'h-4 w-4',
      medium: 'h-8 w-8',
      large: 'h-12 w-12',
    }
    return sizes[size]
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 border-green-web ${getSizeClasses()}`}
      ></div>
      <h3 className="mt-4 text-sm font-medium text-gray-900">{title}</h3>
      {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
    </div>
  )
}
