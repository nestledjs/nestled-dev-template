import React from 'react'
import { Link } from 'react-router'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

export interface BreadcrumbItem {
  id: string
  label: string
  href?: string
  isActive?: boolean
}

export interface AdminBreadcrumbsProps {
  readonly items: readonly BreadcrumbItem[]
  readonly showHome?: boolean
  readonly homeHref?: string
  readonly className?: string
}

export function AdminBreadcrumbs({
  items,
  showHome = true,
  homeHref = '/admin',
  className = '',
}: Readonly<AdminBreadcrumbsProps>) {
  // Extract nested ternary logic into clear helper functions
  const renderHomeLink = () => {
    if (!showHome) return null
    
    return (
      <li key="home" className="flex items-center">
        <Link 
          to={homeHref} 
          className="text-gray-400 hover:text-gray-500"
          aria-label="Home"
        >
          <HomeIcon className="h-5 w-5 flex-shrink-0" />
        </Link>
      </li>
    )
  }

  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const content = item.href && !item.isActive ? (
      <Link
        to={item.href}
        className="text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        {item.label}
      </Link>
    ) : (
      <span 
        className={`text-sm font-medium ${
          item.isActive ? 'text-gray-900' : 'text-gray-500'
        }`}
      >
        {item.label}
      </span>
    )

    return (
      <li key={item.id} className="flex items-center">
        {(showHome || index > 0) && (
          <ChevronRightIcon 
            className="h-5 w-5 flex-shrink-0 text-gray-400 mr-4" 
            aria-hidden="true" 
          />
        )}
        {content}
      </li>
    )
  }

  const shouldShowSeparator = (index: number) => {
    return showHome || index > 0
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {renderHomeLink()}
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return renderBreadcrumbItem(item, index, isLast)
        })}
      </ol>
    </nav>
  )
}