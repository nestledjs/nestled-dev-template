import { describe, expect, it } from 'vitest'
import { blankCommentsAndStrings, stripComments } from './doctor-source-analysis'

describe('stripComments', () => {
  it('preserves comment openers inside string literals', () => {
    const source = [
      "route('checkouts/cn/:token/*', './routes/checkout.tsx')",
      'const url = "https://example.com/path"',
      'const pattern = `expand/*`',
      "const escaped = 'it\\'s still /* text */'",
    ].join('\n')

    expect(stripComments(source)).toBe(source)
  })

  it('removes actual comments while preserving block-comment line positions', () => {
    const source = [
      'const before = true',
      '/* hidden',
      'across lines */',
      '  // hidden line',
      'const after = true',
    ].join('\n')

    const stripped = stripComments(source)

    expect(stripped).not.toContain('hidden')
    expect(stripped).toContain('const before = true')
    expect(stripped).toContain('const after = true')
    expect(stripped.split('\n')).toHaveLength(source.split('\n').length)
  })
})

describe('blankCommentsAndStrings', () => {
  it('blanks prose in comments so token scans match only code', () => {
    // The false positive that motivated this: "…the same two locks as any other write" in a
    // comment flagged the `as any` gate.
    const source = [
      'const value = compute() as any',
      '// takes the same two locks as any other write',
      'await write() // holds them as any caller would',
      '/** treat this as any other helper */',
      "const message = 'never cast as any'",
    ].join('\n')

    const blanked = blankCommentsAndStrings(source)

    expect(blanked.split('\n')[0]).toContain('as any')
    expect([...blanked.matchAll(/\bas\s+any\b/g)]).toHaveLength(1)
  })

  it('preserves every byte offset and line count', () => {
    const source = 'const a = 1 // note\nconst b = "text" as const\n/* block */ const c = 2\n'
    const blanked = blankCommentsAndStrings(source)

    expect(blanked).toHaveLength(source.length)
    expect(blanked.split('\n')).toHaveLength(source.split('\n').length)
    expect(blanked.indexOf('const c')).toBe(source.indexOf('const c'))
  })

  it('does not treat comment openers inside strings as comments', () => {
    const source = 'const url = "https://example.com" as any'
    const blanked = blankCommentsAndStrings(source)

    // The string is blanked, but the code after it survives — a // inside a string must not
    // swallow the rest of the line.
    expect(blanked).toContain('as any')
  })

  it('follows a template literal through interpolations with nested templates', () => {
    // skipStringLiteral stops at the FIRST backtick — for a nested template that is the nested
    // opener, and the outer tail would be parsed as code. "as any" prose in that tail must stay
    // blanked, and real code after the closing backtick must survive.
    const source =
      'const label = `use ${flag ? `nested` : "plain"} as any other tag`\nconst cast = value as any'
    const blanked = blankCommentsAndStrings(source)

    expect([...blanked.matchAll(/\bas\s+any\b/g)]).toHaveLength(1)
    expect(blanked.split('\n')[1]).toContain('as any')
    expect(blanked).toHaveLength(source.length)
  })

  it('tracks braces inside interpolations so an object literal does not end the template early', () => {
    const source =
      'const text = `count ${format({ max: 3 })} as any left` as const\nconst after = compute() as any'
    const blanked = blankCommentsAndStrings(source)

    expect([...blanked.matchAll(/\bas\s+any\b/g)]).toHaveLength(1)
    expect(blanked.split('\n')[0]).toContain('as const')
    expect(blanked.split('\n')[1]).toContain('as any')
  })
})
