import { render, screen } from '@testing-library/react'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { FilterChevron } from './filters/filter-styles'
import { SvgIcon } from './SvgIcon'

const libRoot = join(__dirname, '..')

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

  it('renders the filter chevron as a decorative icon', () => {
    const { container } = render(<FilterChevron isOpen />)
    const icon = container.querySelector('svg')
    expect(icon?.getAttribute('aria-hidden')).toBe('true')
    expect(icon?.getAttribute('class')).toContain('rotate-180')
  })

  it('is the only place in the package that renders an inline <svg>', () => {
    const offenders = sourceFiles(libRoot)
      .filter(file => !file.endsWith(join('components', 'SvgIcon.tsx')))
      .filter(file => /<svg[\s>]/.test(readFileSync(file, 'utf8')))
      .map(file => relative(libRoot, file))
    expect(offenders).toEqual([])
  })
})
