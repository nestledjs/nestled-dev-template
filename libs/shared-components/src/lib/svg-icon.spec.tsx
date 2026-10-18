import { render, screen } from '@testing-library/react'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { ServiceUnavailable } from './service-unavailable'
import { ViteCacheError } from './vite-cache-error'
import { ErrorBoundaryUi } from './error-boundary-ui'
import { SvgIcon } from './svg-icon'

const libRoot = __dirname

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.tsx$/.test(entry.name) && !/\.spec\.tsx$/.test(entry.name) ? [path] : []
  })
}

describe('SvgIcon', () => {
  it('names a labelled icon as an image and keeps it visible to assistive technology', () => {
    render(
      <SvgIcon label="Close filters" viewBox="0 0 20 20" className="h-5 w-5">
        <path d="M0 0h20v20H0z" />
      </SvgIcon>,
    )
    const icon = screen.getByRole('img', { name: 'Close filters' })
    expect(icon.getAttribute('aria-hidden')).toBeNull()
    expect(icon.getAttribute('class')).toBe('h-5 w-5')
    expect(icon.getAttribute('viewBox')).toBe('0 0 20 20')
  })

  it('hides an unlabelled icon, which is decorative', () => {
    const { container } = render(
      <SvgIcon viewBox="0 0 20 20">
        <path d="M0 0h20v20H0z" />
      </SvgIcon>,
    )
    const icon = container.querySelector('svg')
    expect(icon?.getAttribute('aria-hidden')).toBe('true')
    expect(icon?.getAttribute('focusable')).toBe('false')
    expect(icon?.getAttribute('role')).toBeNull()
    expect(icon?.getAttribute('aria-label')).toBeNull()
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('treats an empty label as no label', () => {
    const { container } = render(
      <SvgIcon label="">
        <path d="M0 0h1v1H0z" />
      </SvgIcon>,
    )
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.queryByRole('img')).toBeNull()
  })

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

  it('is the only place in the package that renders an inline <svg>', () => {
    const offenders = sourceFiles(libRoot)
      .filter(file => !file.endsWith('svg-icon.tsx'))
      .filter(file => /<svg[\s>]/.test(readFileSync(file, 'utf8')))
      .map(file => relative(libRoot, file))
    expect(offenders).toEqual([])
  })
})
