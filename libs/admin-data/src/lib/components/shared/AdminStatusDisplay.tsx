import React from 'react'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  ClockIcon,
  QuestionMarkCircleIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/solid'

export type StatusType = 
  | 'active' 
  | 'inactive' 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'warning' 
  | 'error' 
  | 'success' 
  | 'paused' 
  | 'unknown'

export type StatusSize = 'small' | 'medium' | 'large'
export type StatusVariant = 'badge' | 'pill' | 'dot' | 'full'

export interface AdminStatusDisplayProps {
  readonly status: StatusType
  readonly label?: string
  readonly size?: StatusSize
  readonly variant?: StatusVariant
  readonly showIcon?: boolean
  readonly className?: string
  readonly onClick?: () => void
  readonly tooltip?: string
}

export interface AdminUserStatusProps {
  readonly status: 'online' | 'offline' | 'away' | 'busy'
  readonly showLabel?: boolean
  readonly size?: StatusSize
  readonly className?: string
}

interface StatusConfig {
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  textColor: string
  borderColor: string
  defaultLabel: string
}

// Extract status configuration logic
const getStatusConfig = (status: StatusType): StatusConfig => {
  const configs: Record<StatusType, StatusConfig> = {
    active: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      defaultLabel: 'Active',
    },
    inactive: {
      icon: XCircleIcon,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      defaultLabel: 'Inactive',
    },
    pending: {
      icon: ClockIcon,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      defaultLabel: 'Pending',
    },
    approved: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      defaultLabel: 'Approved',
    },
    rejected: {
      icon: XCircleIcon,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      defaultLabel: 'Rejected',
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      defaultLabel: 'Warning',
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      defaultLabel: 'Error',
    },
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      defaultLabel: 'Success',
    },
    paused: {
      icon: PauseCircleIcon,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      defaultLabel: 'Paused',
    },
    unknown: {
      icon: QuestionMarkCircleIcon,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      defaultLabel: 'Unknown',
    },
  }

  return configs[status]
}

// Extract size configuration logic
const getSizeClasses = (size: StatusSize) => {
  const sizeClasses = {
    small: {
      text: 'text-xs',
      padding: 'px-2 py-1',
      icon: 'h-3 w-3',
      dot: 'h-2 w-2',
    },
    medium: {
      text: 'text-sm',
      padding: 'px-2.5 py-1.5',
      icon: 'h-4 w-4',
      dot: 'h-3 w-3',
    },
    large: {
      text: 'text-base',
      padding: 'px-3 py-2',
      icon: 'h-5 w-5',
      dot: 'h-4 w-4',
    },
  }

  return sizeClasses[size]
}

// Extract variant styling logic
const getVariantClasses = (variant: StatusVariant) => {
  const variantClasses = {
    badge: 'inline-flex items-center rounded border font-medium',
    pill: 'inline-flex items-center rounded-full border font-medium',
    dot: 'inline-flex items-center font-medium',
    full: 'flex items-center justify-center rounded border font-medium w-full',
  }

  return variantClasses[variant]
}

// Extract user status configuration logic
const getUserStatusConfig = (status: AdminUserStatusProps['status']) => {
  const configs = {
    online: {
      color: 'bg-green-400',
      label: 'Online',
    },
    offline: {
      color: 'bg-gray-400',
      label: 'Offline',
    },
    away: {
      color: 'bg-yellow-400',
      label: 'Away',
    },
    busy: {
      color: 'bg-red-400',
      label: 'Busy',
    },
  }

  return configs[status]
}

export function AdminStatusDisplay({
  status,
  label,
  size = 'medium',
  variant = 'badge',
  showIcon = true,
  className = '',
  onClick,
  tooltip,
}: Readonly<AdminStatusDisplayProps>) {
  const config = getStatusConfig(status)
  const sizeClasses = getSizeClasses(size)
  const variantClasses = getVariantClasses(variant)
  const IconComponent = config.icon
  
  const displayLabel = label || config.defaultLabel
  
  const shouldShowDot = variant === 'dot'
  const shouldShowIcon = showIcon && !shouldShowDot
  const isClickable = !!onClick
  
  const baseClasses = `${variantClasses} ${sizeClasses.text} ${sizeClasses.padding} ${config.bgColor} ${config.textColor} ${config.borderColor}`
  const interactiveClasses = isClickable ? 'cursor-pointer hover:opacity-80' : ''
  const finalClasses = `${baseClasses} ${interactiveClasses} ${className}`.trim()

  const renderDot = () => {
    if (!shouldShowDot) return null
    
    return (
      <span className={`inline-block rounded-full mr-2 ${config.bgColor.replace('bg-', 'bg-').replace('-100', '-400')} ${sizeClasses.dot}`} />
    )
  }

  const renderIcon = () => {
    if (!shouldShowIcon) return null
    
    return (
      <IconComponent className={`${sizeClasses.icon} ${displayLabel ? 'mr-1.5' : ''}`} />
    )
  }

  const content = (
    <>
      {renderDot()}
      {renderIcon()}
      {displayLabel}
    </>
  )

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={finalClasses}
        title={tooltip}
      >
        {content}
      </button>
    )
  }

  return (
    <span className={finalClasses} title={tooltip}>
      {content}
    </span>
  )
}

export function AdminUserStatus({
  status,
  showLabel = false,
  size = 'medium',
  className = '',
}: Readonly<AdminUserStatusProps>) {
  const config = getUserStatusConfig(status)
  const sizeClasses = getSizeClasses(size)

  const dotSizeClass = sizeClasses.dot
  const textSizeClass = showLabel ? sizeClasses.text : ''
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      <span 
        className={`inline-block rounded-full ${config.color} ${dotSizeClass}`}
        aria-label={config.label}
      />
      {showLabel && (
        <span className={`ml-2 text-gray-700 ${textSizeClass}`}>
          {config.label}
        </span>
      )}
    </div>
  )
}