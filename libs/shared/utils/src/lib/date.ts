import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

/**
 * Format a Date or ISO string as YYYY-MM-DD using UTC semantics, suitable for date inputs
 */
export function formatUtcForDateInput(value: Date | string | number | null | undefined): string {
  if (!value) return ''
  const d = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return ''
  return dayjs.utc(d).format('YYYY-MM-DD')
}

/**
 * Format a Date or ISO string as a human-friendly long date (e.g. "December 25, 2024")
 * using UTC semantics, so calendar-date fields stored at midnight UTC are not shifted
 * by the viewer's local timezone. Returns '' for empty/invalid values.
 */
export function formatUtcLongDate(value: Date | string | number | null | undefined): string {
  if (!value) return ''
  const d = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return ''
  return dayjs.utc(d).format('MMMM D, YYYY')
}

/**
 * Convert a YYYY-MM-DD string or Date into an ISO string pinned to midnight UTC
 */
export function toUtcMidnightIso(value: Date | string): string {
  if (value instanceof Date) {
    const y = value.getUTCFullYear()
    const m = String(value.getUTCMonth() + 1).padStart(2, '0')
    const d = String(value.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${d}T00:00:00Z`
  }
  if (typeof value === 'string') {
    // If a full ISO is provided, normalize to its UTC date @ 00:00
    if (value.includes('T')) {
      const d = new Date(value)
      if (!Number.isNaN(d.getTime())) {
        const y = d.getUTCFullYear()
        const m = String(d.getUTCMonth() + 1).padStart(2, '0')
        const dd = String(d.getUTCDate()).padStart(2, '0')
        return `${y}-${m}-${dd}T00:00:00Z`
      }
    }
    // Assume YYYY-MM-DD
    return `${value}T00:00:00Z`
  }
  // Fallback
  return new Date().toISOString()
}

/**
 * Strict ISO-8601 datetime detector.
 *
 * Used to decide whether an unknown table value is a timestamp WITHOUT consulting the field's
 * name. Name-based detection (`fieldName.includes('date')`) matched unrelated columns such as
 * `mandateNotes` or `validateStatus` and fed their text to a date formatter, which rendered
 * `Invalid Date` into the cell. Anchored with no nested quantifiers so malformed input cannot
 * cause backtracking.
 */
export function isIsoDateTimeString(value: unknown): value is string {
  if (typeof value !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/.test(value)) {
    return false
  }
  return !Number.isNaN(new Date(value).getTime())
}

/**
 * Format a Date or ISO string as a human-friendly long date and time (e.g.
 * "December 25, 2024 3:30 PM") in the VIEWER'S LOCAL zone.
 *
 * This is the counterpart to `formatUtcLongDate`. A true timestamp marks an instant, so it must
 * be localized; a calendar date has no time to localize and must not be. Choosing between them
 * by field name is what this pair exists to replace -- see `isDateOnlyField` in `table-utils`.
 */
export function formatLocalLongDateTime(value: Date | string | number | null | undefined): string {
  if (!value) return ''
  const d = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return ''
  return dayjs(d).format('MMMM D, YYYY h:mm A')
}
