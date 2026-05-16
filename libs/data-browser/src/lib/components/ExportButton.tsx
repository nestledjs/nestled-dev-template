import React, { useCallback, useRef, useState } from 'react'
import { useLazyQuery } from '@apollo/client/react'
import { formatFieldName } from '../utils/string-utils'

const MAX_EXPORT_ROWS = 50000

function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) return ''
  let str: string
  if (typeof val === 'object') {
    const obj = val as Record<string, unknown>
    const id = obj.id
    str = typeof id === 'string' || typeof id === 'number' ? String(id) : JSON.stringify(val)
  } else {
    str = String(val)
  }
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replaceAll('"', '""')}"`
  }
  return str
}

function generateCsv(items: Record<string, unknown>[], columns: string[]): string {
  const header = columns.map(c => escapeCsvValue(formatFieldName(c))).join(',')
  const rows = items.map(item =>
    columns.map(col => escapeCsvValue(item[col])).join(',')
  )
  return [header, ...rows].join('\r\n')
}

function findItemsInData(data: Record<string, unknown>, dataPath: string): Record<string, unknown>[] {
  const direct = data?.[dataPath] as Record<string, unknown>[] | undefined
  if (direct?.length) return direct
  for (const value of Object.values(data ?? {})) {
    if (Array.isArray(value) && value.length > 0 && (value[0] as Record<string, unknown>)?.id) {
      return value as Record<string, unknown>[]
    }
  }
  return []
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function buildExportInput(
  mode: 'all' | 'filtered',
  variables: { input: Record<string, unknown> },
): { take: number; skip: number; orderBy?: string; orderDirection?: string; [key: string]: any } {
  if (mode === 'all') return { take: MAX_EXPORT_ROWS, skip: 0, orderBy: 'id', orderDirection: 'desc' }
  return { ...variables.input, take: MAX_EXPORT_ROWS, skip: 0 }
}

function buildExportFilename(modelName: string, mode: 'all' | 'filtered', hasActiveFilters: boolean): string {
  const timestamp = new Date().toISOString().slice(0, 10)
  const suffix = mode === 'filtered' && hasActiveFilters ? '-filtered' : ''
  return `${modelName}${suffix}-${timestamp}.csv`
}

interface ExportButtonProps {
  readonly query: any
  readonly dataPath: string
  /** Current query variables (includes filters, search, sort) */
  readonly variables: { input: Record<string, unknown> }
  readonly visibleColumns: string[]
  readonly fieldNames: string[]
  readonly modelName: string
  readonly hasActiveFilters: boolean
}

type ExportMode = 'all' | 'filtered'

export function ExportButton({
  query,
  dataPath,
  variables,
  visibleColumns,
  fieldNames,
  modelName,
  hasActiveFilters,
}: ExportButtonProps) {
  const [open, setOpen] = useState(false)
  const [exporting, setExporting] = useState<ExportMode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const [runQuery] = useLazyQuery(query, {
    fetchPolicy: 'network-only',
  })

  const doExport = useCallback(
    async (mode: ExportMode) => {
      setExporting(mode)
      setError(null)

      let columns: string[]
      if (mode === 'all') {
        columns = fieldNames
      } else {
        columns = visibleColumns.length > 0 ? visibleColumns : fieldNames
      }
      const input = buildExportInput(mode, variables)

      try {
        const { data, error: queryError } = await runQuery({ variables: { input } })

        if (queryError) throw queryError

        const anyData = data as Record<string, unknown>
        const items = findItemsInData(anyData, dataPath)

        const csv = generateCsv(items, columns)
        downloadCsv(csv, buildExportFilename(modelName, mode, hasActiveFilters))
        setOpen(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Export failed')
      } finally {
        setExporting(null)
      }
    },
    [runQuery, variables, fieldNames, visibleColumns, dataPath, modelName, hasActiveFilters],
  )

  const activeFilterCount = Object.keys((variables.input.filters as Record<string, unknown>) ?? {}).length
  const hasSearch = Boolean(variables.input.search)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => { setOpen(!open); setError(null) }}
        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-web"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-transparent border-0 p-0"
            onClick={() => setOpen(false)}
            aria-label="Close export menu"
          />

          {/* Modal */}
          <div
            ref={modalRef}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Export as CSV</h3>

              {error && (
                <div className="mb-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded p-2">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {/* Export All */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Export All</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    All records and all columns. No filters applied.
                  </p>
                  <button
                    disabled={exporting !== null}
                    onClick={() => doExport('all')}
                    className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {exporting === 'all' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Exporting...
                      </>
                    ) : (
                      `Download (${fieldNames.length} columns)`
                    )}
                  </button>
                </div>

                {/* Export with current settings */}
                <div className="border border-green-200 dark:border-green-800 rounded-md p-3 bg-green-50 dark:bg-green-900/20">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Export with Current Settings</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Uses your current filters and visible columns.
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 mb-2 space-y-0.5">
                    <li>{visibleColumns.length > 0 ? visibleColumns.length : fieldNames.length} columns selected</li>
                    {activeFilterCount > 0 && <li>{activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'} active</li>}
                    {hasSearch && <li>Search: "{variables.input.search as string}"</li>}
                  </ul>
                  <button
                    disabled={exporting !== null}
                    onClick={() => doExport('filtered')}
                    className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {exporting === 'filtered' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Exporting...
                      </>
                    ) : (
                      'Download'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
