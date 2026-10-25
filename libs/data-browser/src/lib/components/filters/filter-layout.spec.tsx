import { render, screen, within } from '@testing-library/react'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRelationData } from '../../hooks/useRelationData'
import { DateRangeFilter } from './DateRangeFilter'
import { EnumFilter } from './EnumFilter'
import {
  filterControlClasses,
  filterLabelClasses,
  FilterSelect,
  filterSubLabelClasses,
} from './filter-styles'
import { NumberRangeFilter } from './NumberRangeFilter'
import { RelationFilterField } from './RelationFilterField'

vi.mock('../../hooks/useClickOutside', () => ({ useClickOutside: vi.fn() }))
vi.mock('../../hooks/useRelationData', () => ({ useRelationData: vi.fn() }))

const mockUseRelationData = useRelationData as ReturnType<typeof vi.fn>
const classesOf = (value: string) => value.split(/\s+/).filter(Boolean)
const noop = () => undefined

/**
 * The filter panel lays every filter out in one grid row. These specs pin the layout contract
 * that keeps a row aligned and readable in both themes: one label line, then one control line of
 * a fixed height, with a range filter's From/To or Min/Max captions underneath its inputs.
 */
describe('filter panel layout', () => {
  beforeEach(() => {
    mockUseRelationData.mockReturnValue({
      relatedItems: [],
      loading: false,
      error: null,
      hasDocument: true,
    })
  })

  describe('field labels', () => {
    it('are readable in light and dark mode, not styled as placeholder or disabled text', () => {
      const classes = classesOf(filterLabelClasses)
      expect(classes).toEqual(expect.arrayContaining(['text-gray-700', 'dark:text-gray-200']))
      for (const faint of ['text-gray-400', 'text-gray-500', 'dark:text-gray-500', 'opacity-50']) {
        expect(classes).not.toContain(faint)
      }
    })

    it('stay on one line, so every label in a row has the same height', () => {
      expect(classesOf(filterLabelClasses)).toContain('truncate')
    })

    it.each([
      [
        'EnumFilter',
        () => (
          <EnumFilter fieldName="status" currentValue={null} onChange={noop} enumValues={['A']} />
        ),
        'Status',
      ],
      [
        'DateRangeFilter',
        () => <DateRangeFilter fieldName="lastLogin" currentValue={{}} onChange={noop} />,
        'Last Login',
      ],
      [
        'NumberRangeFilter',
        () => (
          <NumberRangeFilter
            fieldName="loginCount"
            fieldType="int"
            currentValue={{}}
            onChange={noop}
          />
        ),
        'Login Count',
      ],
      [
        'RelationFilterField',
        () => (
          <RelationFilterField
            fieldName="owner"
            relatedModelName="User"
            currentValue={null}
            onChange={noop}
          />
        ),
        'Owner',
      ],
    ])('%s renders its field label with the shared label classes', (_name, renderFilter, label) => {
      render(renderFilter())
      expect(screen.getByText(label)).toHaveClass(...classesOf(filterLabelClasses))
    })
  })

  describe('controls', () => {
    it('share one fixed height', () => {
      expect(classesOf(filterControlClasses)).toContain('h-10')
    })

    it('ask the browser for dark native widgets (date picker icon, option list) in dark mode', () => {
      expect(classesOf(filterControlClasses)).toContain('dark:scheme-dark')
    })

    it('gives the enum select and the relation picker the same control classes', () => {
      render(
        <>
          <EnumFilter fieldName="status" currentValue={null} onChange={noop} enumValues={['A']} />
          <RelationFilterField
            fieldName="owner"
            relatedModelName="User"
            currentValue={null}
            onChange={noop}
          />
        </>,
      )
      const shared = classesOf(filterControlClasses)
      expect(screen.getByRole('combobox')).toHaveClass(...shared)
      expect(screen.getByRole('button', { name: /select user/i })).toHaveClass(...shared)
    })
  })

  describe('selects', () => {
    it('hide the native arrow and draw the shared chevron at the right edge', () => {
      const { container } = render(
        <FilterSelect id="flag" value="" onChange={noop}>
          <option value="">All</option>
        </FilterSelect>,
      )
      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('appearance-none', 'pr-10', 'w-full')

      const chevronSlot = select.nextElementSibling as HTMLElement
      expect(chevronSlot).toHaveClass(
        'pointer-events-none',
        'absolute',
        'inset-y-0',
        'right-0',
        'pr-3',
      )
      expect(chevronSlot).not.toHaveClass('left-0')
      expect(chevronSlot.querySelector('svg')).not.toBeNull()
      expect(container.firstElementChild).toHaveClass('relative')
    })

    it('use the same chevron icon as the relation picker', () => {
      const { container } = render(
        <>
          <FilterSelect id="flag" value="" onChange={noop}>
            <option value="">All</option>
          </FilterSelect>
          <RelationFilterField
            fieldName="owner"
            relatedModelName="User"
            currentValue={null}
            onChange={noop}
          />
        </>,
      )
      const paths = Array.from(container.querySelectorAll('svg path')).map(path =>
        path.getAttribute('d'),
      )
      expect(paths).toHaveLength(2)
      expect(paths[0]).toBe(paths[1])
    })
  })

  describe.each([
    [
      'DateRangeFilter',
      () => <DateRangeFilter fieldName="lastLogin" currentValue={{}} onChange={noop} />,
      'Last Login',
      ['From', 'To'],
    ],
    [
      'NumberRangeFilter',
      () => (
        <NumberRangeFilter
          fieldName="loginCount"
          fieldType="int"
          currentValue={{}}
          onChange={noop}
        />
      ),
      'Login Count',
      ['Min', 'Max'],
    ],
  ])('%s', (_name, renderFilter, label, captions) => {
    it('groups its two inputs under the field label', () => {
      render(renderFilter())
      const group = screen.getByRole('group', { name: label })
      for (const caption of captions) {
        expect(within(group).getByLabelText(caption)).toBeInTheDocument()
      }
    })

    it('puts each caption under its input, so the inputs line up with single-control filters', () => {
      render(renderFilter())
      const legend = screen.getByText(label)
      for (const caption of captions) {
        const input = screen.getByLabelText(caption)
        const captionLabel = screen.getByText(caption)
        // label line first, then the input, then its caption
        expect(
          legend.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
        expect(
          input.compareDocumentPosition(captionLabel) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
        expect(input.nextElementSibling).toBe(captionLabel)
        expect(captionLabel).toHaveClass(...classesOf(filterSubLabelClasses))
        expect(input).toHaveClass(...classesOf(filterControlClasses))
      }
    })

    it('captions its inputs in readable text in both themes', () => {
      const classes = classesOf(filterSubLabelClasses)
      expect(classes).toEqual(expect.arrayContaining(['text-gray-600', 'dark:text-gray-300']))
      expect(classes).not.toContain('mb-1')
    })
  })
})

describe('data-browser colours', () => {
  const libRoot = join(__dirname, '..', '..')

  function sourceFiles(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) return sourceFiles(path)
      return /\.tsx?$/.test(entry.name) && !/\.spec\.tsx?$/.test(entry.name) ? [path] : []
    })
  }

  it('uses only Tailwind default palette colours, never the undefined `green-web` token', () => {
    const offenders = sourceFiles(libRoot)
      .filter(file => readFileSync(file, 'utf8').includes('green-web'))
      .map(file => relative(libRoot, file))
    expect(offenders).toEqual([])
  })
})
