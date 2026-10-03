import * as path from 'path'
import type { OutputBundle, OutputChunk } from 'rollup'

const CSS_FILE_NAME = 'index.css'

function entryChunks(bundle: OutputBundle): OutputChunk[] {
  return Object.values(bundle).filter(
    (output): output is OutputChunk => output.type === 'chunk' && output.isEntry,
  )
}

export function attachExtractedCssImport(bundle: OutputBundle, cssFileName = CSS_FILE_NAME): void {
  const cssAsset = bundle[cssFileName]
  if (!cssAsset || cssAsset.type !== 'asset') {
    throw new Error(`The access-control package did not emit ${cssFileName}.`)
  }

  const entries = entryChunks(bundle)
  if (entries.length === 0) {
    throw new Error('The access-control package did not emit an entry chunk.')
  }

  for (const entry of entries) {
    const relativePath = path.posix.relative(path.posix.dirname(entry.fileName), cssAsset.fileName)
    const cssImportPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`
    const cssImport = `import ${JSON.stringify(cssImportPath)};`
    if (!entry.code.includes(cssImport)) {
      entry.code = `${cssImport}\n${entry.code}`
    }
  }
}
