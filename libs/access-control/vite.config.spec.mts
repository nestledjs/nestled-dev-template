import type { OutputAsset, OutputBundle, OutputChunk } from 'rollup'
import { describe, expect, it } from 'vitest'
import { attachExtractedCssImport } from './build-css-import.mts'

function entryChunk(fileName = 'index.js'): OutputChunk {
  return {
    code: 'export const value = true;\n',
    dynamicImports: [],
    exports: ['value'],
    facadeModuleId: '/src/index.ts',
    fileName,
    implicitlyLoadedBefore: [],
    importedBindings: {},
    imports: [],
    isDynamicEntry: false,
    isEntry: true,
    isImplicitEntry: false,
    map: null,
    moduleIds: ['/src/index.ts'],
    modules: {},
    name: 'index',
    preliminaryFileName: fileName,
    referencedFiles: [],
    sourcemapFileName: null,
    type: 'chunk',
  }
}

function cssAsset(fileName = 'index.css'): OutputAsset {
  return {
    fileName,
    name: fileName,
    names: [fileName],
    needsCodeReference: false,
    originalFileName: null,
    originalFileNames: [],
    source: '.nac-root { display: block; }',
    type: 'asset',
  }
}

describe('attachExtractedCssImport', () => {
  it('adds the extracted stylesheet to every emitted entry', () => {
    const entry = entryChunk()
    const bundle = { 'index.js': entry, 'index.css': cssAsset() } as OutputBundle

    attachExtractedCssImport(bundle)

    expect(entry.code).toBe('import "./index.css";\nexport const value = true;\n')
  })

  it('uses a relative import when an entry is emitted in a nested directory', () => {
    const entry = entryChunk('entries/index.js')
    const bundle = { 'entries/index.js': entry, 'index.css': cssAsset() } as OutputBundle

    attachExtractedCssImport(bundle)

    expect(entry.code).toContain('import "../index.css";')
  })

  it('does not add the import twice', () => {
    const entry = entryChunk()
    const bundle = { 'index.js': entry, 'index.css': cssAsset() } as OutputBundle

    attachExtractedCssImport(bundle)
    attachExtractedCssImport(bundle)

    expect(entry.code.match(/index\.css/g)).toHaveLength(1)
  })

  it('rejects a build that does not emit the stylesheet', () => {
    const bundle = { 'index.js': entryChunk() } as OutputBundle

    expect(() => attachExtractedCssImport(bundle)).toThrow(
      'The access-control package did not emit index.css.',
    )
  })

  it('rejects a build that does not emit an entry chunk', () => {
    const bundle = { 'index.css': cssAsset() } as OutputBundle

    expect(() => attachExtractedCssImport(bundle)).toThrow(
      'The access-control package did not emit an entry chunk.',
    )
  })
})
