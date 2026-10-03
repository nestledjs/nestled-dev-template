import React, { Dispatch, ReactElement, SetStateAction, useCallback, useState } from 'react'
import { Link } from 'react-router'
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import {
  formatFieldName,
  getNestedProperty,
  renderValue,
} from '@nestled-template/shared/utils'

/**
 * Declared locally rather than imported from shared/utils, so the emitted declaration stays
 * inside the published package. Importing the type made `data-table.d.ts` reference
 * `../../../shared/utils/src/index.ts`, a path that does not exist for an npm consumer.
 *
 * It is structural and intentionally duplicated: the canonical `DateFieldMeta` is itself
 * declared structurally, precisely so it can be restated across a package boundary without
 * coupling this package to the generated SDK types.
 */
export interface DateFieldMeta {
  readonly type?: string
  readonly documentation?: string
}

// Inlined type from CorePaging
export interface Paging {
  count?: number | null
  filteredTotal?: number | null
  hasNext?: boolean | null
  hasPrev?: boolean | null
  page?: number | null
  pages?: number | null
  skip?: number | null
  take?: number | null
  total?: number | null
}

// Inlined utility
function toCount(p: Paging | null) {
  // Use filteredTotal (total after filters) rather than count (items in current page)
  if ((p?.take ?? 0) + (p?.skip ?? 0) > (p?.filteredTotal ?? 0)) return p?.filteredTotal
  return (p?.take ?? 0) + (p?.skip ?? 0)
}

// Reusable pagination button component
interface PaginationButtonProps {
  readonly show: boolean
  readonly onClick: () => void
  readonly label: string
  readonly className?: string
}

function PaginationButton({ show, onClick, label, className = '' }: PaginationButtonProps) {
  if (!show) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${className}`}
    >
      {label}
    </button>
  )
}

// Order direction icon component
interface OrderDirectionIconProps {
  readonly field: string
  readonly sort?: { orderBy: string; orderDirection: string }
}

function OrderDirectionIcon({ field, sort }: OrderDirectionIconProps) {
  if (field === sort?.orderBy) {
    switch (sort?.orderDirection) {
      case 'desc':
        return <ChevronUpIcon className={'w-5 h-5 font-bold'} />
      case 'asc':
        return <ChevronDownIcon className={'w-5 h-5 font-bold'} />
      default:
        return <ChevronUpDownIcon className={'w-6 h-6'} />
    }
  }
  return <ChevronUpDownIcon className={'w-6 h-6'} />
}

// Sortable header cell component - defined outside DataTable to avoid re-creation on each render
interface SortableHeaderCellProps {
  readonly field: string
  readonly index: number
  readonly sort?: { orderBy: string; orderDirection: string }
  readonly onSort: (field: string) => void
  readonly formatFieldName: (fieldName: string) => string
}

function getAriaSortValue(
  field: string,
  sort?: { orderBy: string; orderDirection: string },
): 'ascending' | 'descending' | 'none' {
  if (sort?.orderBy !== field) {
    return 'none'
  }
  return sort.orderDirection === 'asc' ? 'ascending' : 'descending'
}

const FIRST_COLUMN_CLASS =
  'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6'
const OTHER_COLUMN_CLASS =
  'hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 lg:table-cell'

function SortableHeaderCell({
  field,
  index,
  sort,
  onSort,
  formatFieldName,
}: SortableHeaderCellProps) {
  const thClassName = index === 0 ? FIRST_COLUMN_CLASS : OTHER_COLUMN_CLASS

  return (
    <th scope="col" className={thClassName} aria-sort={getAriaSortValue(field, sort)}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex justify-between items-center w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded px-2 py-1 -mx-2 -my-1"
        aria-label={`Sort by ${formatFieldName(field)}`}
      >
        <span>{formatFieldName(field)}</span>
        <OrderDirectionIcon field={field} sort={sort} />
      </button>
    </th>
  )
}

export interface DataTableProps {
  readonly data?: any
  readonly path: string
  readonly fields: string[]
  readonly pagination?: Paging | null
  readonly setSkip?: (skip: number) => void
  readonly additionalFilters?: ReactElement | null
  readonly setSort?: Dispatch<SetStateAction<{ orderBy: string; orderDirection: string }>>
  readonly sort?: { orderBy: string; orderDirection: string }
  /**
   * Prisma field metadata keyed by field path, used to render temporal columns correctly.
   * Optional: without it an ISO-8601 value is rendered as a local timestamp, which is the
   * truthful reading of a Prisma `DateTime`. Supply it so that columns annotated
   * `/// @dateOnly` render on the UTC calendar day instead of shifting by the viewer's offset.
   */
  readonly fieldMeta?: Record<string, DateFieldMeta>
}

export function DataTable(props: DataTableProps) {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const toggleIdVisibility = useCallback((rowId: string) => {
    setVisibleIds(prev => {
      const next = new Set(prev)
      if (next.has(rowId)) next.delete(rowId)
      else next.add(rowId)
      return next
    })
  }, [])

  const copyToClipboard = useCallback(async (value: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        setCopiedId(value)
        setTimeout(() => setCopiedId(null), 2000)
      }
    } catch {
      // ignore
    }
  }, [])

  function handleSort(fieldName: string) {
    const isCurrentSortField = props?.sort?.orderBy === fieldName
    props?.setSort?.({
      orderBy: fieldName,
      orderDirection: isCurrentSortField && props?.sort?.orderDirection === 'asc' ? 'desc' : 'asc',
    })
  }

  return (
    <>
      {props?.additionalFilters && props.additionalFilters}

      <>
        <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 sm:-mx-6 md:mx-0 md:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {/* Edit column moved to far left */}
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                  {props?.fields?.map((field, index) => (
                    <SortableHeaderCell
                      key={field}
                      field={field}
                      index={index}
                      sort={props.sort}
                      onSort={handleSort}
                      formatFieldName={formatFieldName}
                    />
                  ))}
                  {/* Removed trailing Edit column */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                {props?.data?.map((item: (typeof props.data)[0]) => {
                  return (
                    <tr key={item.id}>
                      {/* Edit cell moved to far left */}
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-left text-sm font-medium sm:pl-6">
                        <Link
                          to={`${props.path}/${item.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                          <span className="sr-only">Edit {String(item.id)}</span>
                        </Link>
                      </td>
                      {props.fields.map((field, index) => {
                        const fieldValue = getNestedProperty(item, field, props.fieldMeta?.[field])
                        if (index === 0) {
                          return (
                            <td
                              key={field}
                              className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6"
                            >
                              {/* Special handling for ID field: show copy + eye icons instead of raw ID */}
                              {field.toLowerCase() === 'id' ? (
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <button
                                      type="button"
                                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                      onClick={() => copyToClipboard(String(item.id))}
                                      title="Copy ID"
                                      aria-label="Copy ID"
                                    >
                                      <DocumentDuplicateIcon className="w-5 h-5" />
                                    </button>
                                    {copiedId === String(item.id) && (
                                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap">
                                        Copied!
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                    onClick={() => toggleIdVisibility(String(item.id))}
                                    title={visibleIds.has(String(item.id)) ? 'Hide ID' : 'Show ID'}
                                    aria-label={
                                      visibleIds.has(String(item.id)) ? 'Hide ID' : 'Show ID'
                                    }
                                  >
                                    {visibleIds.has(String(item.id)) ? (
                                      <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                      <EyeIcon className="w-5 h-5" />
                                    )}
                                  </button>
                                  {visibleIds.has(String(item.id)) && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                      {String(item.id)}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                renderValue(fieldValue)
                              )}
                            </td>
                          )
                        }
                        return (
                          <td
                            key={field}
                            className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell"
                          >
                            {renderValue(fieldValue)}
                          </td>
                        )
                      })}

                      {/* Removed trailing Edit cell */}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {props?.pagination ? (
          <nav
            className="px-4 py-3 flex items-center justify-between sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">
                  {props?.pagination?.filteredTotal === 0 ? 0 : (props?.pagination?.skip ?? 0) + 1}
                </span>{' '}
                to <span className="font-medium">{toCount(props?.pagination)}</span> of{' '}
                <span className="font-medium">{props.pagination.filteredTotal}</span> results
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <PaginationButton
                show={(props?.pagination?.skip ?? 0) > 0}
                onClick={() =>
                  props.setSkip?.((props?.pagination?.skip ?? 0) - (props?.pagination?.take ?? 0))
                }
                label="Previous"
              />
              <PaginationButton
                show={
                  (props?.pagination?.skip ?? 0) + (props?.pagination?.take ?? 0) <
                  (props?.pagination?.filteredTotal ?? 0)
                }
                onClick={() =>
                  props.setSkip?.((props?.pagination?.skip ?? 0) + (props?.pagination?.take ?? 0))
                }
                label="Next"
                className="ml-3"
              />
            </div>
          </nav>
        ) : null}
      </>
    </>
  )
}
