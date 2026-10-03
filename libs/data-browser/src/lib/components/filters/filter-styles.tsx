import React from 'react'

/**
 * Shared chrome for every control in the data-browser filter panel.
 *
 * The panel renders six independently-written filter types (enum, boolean,
 * string, relation, date range, number range). Each one used to carry its own
 * padding, border and focus ring, so a single row could mix three different
 * control heights. These constants are the single source of truth — use them
 * instead of re-declaring the classes per filter.
 */

export const filterLabelClasses = 'block text-sm font-medium text-gray-700 dark:text-gray-200'

export const filterHelpTextClasses = 'text-xs text-gray-500 dark:text-gray-400'

export const filterControlClasses =
  'w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 ' +
  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ' +
  'placeholder-gray-400 dark:placeholder-gray-500 ' +
  'focus:outline-none focus:ring-1 focus:ring-green-web focus:border-green-web'

/**
 * The chevron used by every closed dropdown control. Native <select> arrows are
 * drawn by the browser and sit tight against the right edge, which is why the
 * enum/boolean selects never lined up with the relation dropdown's chevron.
 * Selects opt out via `appearance-none` and render this instead.
 */
export function FilterChevron({ isOpen = false }: Readonly<{ isOpen?: boolean }>) {
  return (
    <svg
      className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

interface FilterSelectProps {
  readonly id?: string
  readonly value: string
  readonly onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  readonly children: React.ReactNode
}

/** A <select> styled to match the relation dropdown button exactly. */
export function FilterSelect({ id, value, onChange, children }: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`${filterControlClasses} appearance-none pr-10`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <FilterChevron />
      </div>
    </div>
  )
}
