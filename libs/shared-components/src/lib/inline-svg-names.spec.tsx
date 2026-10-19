import { render, screen } from '@testing-library/react'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { ServiceUnavailable } from './service-unavailable'
import { ViteCacheError } from './vite-cache-error'
import { ErrorBoundaryUi } from './error-boundary-ui'

const libRoot = __dirname

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.tsx$/.test(entry.name) && !/\.spec\.tsx$/.test(entry.name) ? [path] : []
  })
}

describe('inline SVGs', () => {
  it.each([
    ['ServiceUnavailable', () => <ServiceUnavailable showRefreshButton={false} />],
    ['ViteCacheError', () => <ViteCacheError autoRefresh={false} />],
    ['ErrorBoundaryUi', () => <ErrorBoundaryUi error={new Error('boom')} />],
  ])(
    '%s renders its icon as decorative, beside the heading that says what it means',
    (_name, ui) => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const { container } = render(ui())
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
      icons.forEach(icon => expect(icon.getAttribute('aria-hidden')).toBe('true'))
      expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    },
  )

  it('every inline <svg> in the package is hidden or named', () => {
    // An opening <svg ...> tag: up to the first `>` that is not inside a JSX expression.
    const openingTags = (text: string) => {
      const tags: string[] = []
      let from = text.indexOf('<svg')
      while (from !== -1) {
        let depth = 0
        let end = from
        while (end < text.length && !(text[end] === '>' && depth === 0)) {
          if (text[end] === '{') depth++
          if (text[end] === '}') depth--
          end++
        }
        tags.push(text.slice(from, end))
        from = text.indexOf('<svg', end)
      }
      return tags
    }
    const files = sourceFiles(libRoot)
    // The scan sees the icons it checks: one each in three components.
    expect(files.flatMap(file => openingTags(readFileSync(file, 'utf8')))).toHaveLength(3)
    const offenders = files.flatMap(file =>
      openingTags(readFileSync(file, 'utf8'))
        .filter(
          tag =>
            !tag.includes('aria-hidden="true"') &&
            !(tag.includes('role="img"') && tag.includes('aria-label=')),
        )
        .map(tag => `${relative(libRoot, file)}: ${tag.split('\n')[0]}`),
    )
    expect(offenders).toEqual([])
  })
})
