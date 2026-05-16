import type { ReactNode } from 'react'
import dayjs from 'dayjs'

export function getNestedProperty(item: any, fieldPath: string): unknown {
  const value = fieldPath.split('.').reduce((obj: any, key) => obj?.[key], item)
  if (fieldPath.toLowerCase().includes('date') && value) {
    return dayjs(value).format('MMMM D, YYYY')
  }
  return value
}

export function renderValue(value: unknown): ReactNode {
  if (value === null || value === undefined) return ''

  if (Array.isArray(value)) {
    if (value.length === 0) return ''
    const labels = value.map((entry) => {
      if (entry === null || entry === undefined) return ''
      if (typeof entry === 'object') {
        const obj = entry as Record<string, unknown>
        const rawLabel = obj.name ?? obj.title ?? obj.id ?? obj.slug
        if (typeof rawLabel === 'string' || typeof rawLabel === 'number') return String(rawLabel)
        return JSON.stringify(obj)
      }
      return String(entry)
    })
    return labels.filter(Boolean).join(', ')
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const rawLabel = obj.name ?? obj.title ?? obj.id ?? obj.slug
    if (typeof rawLabel === 'string' || typeof rawLabel === 'number') return String(rawLabel)
    return JSON.stringify(obj)
  }

  return String(value)
}

export function formatFieldName(fieldName: string): string {
  return fieldName
    .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
