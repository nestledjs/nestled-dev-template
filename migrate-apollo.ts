#!/usr/bin/env ts-node
/**
 * Codemod to migrate from generated Apollo hooks to useQuery/useMutation pattern
 *
 * Transforms:
 * - useXyzQuery() → useQuery<XyzQuery>(Xyz)
 * - useXyzMutation() → useMutation<XyzMutation>(Xyz)
 * - XyzDocument → Xyz
 * - Updates imports accordingly
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

interface TransformResult {
  content: string
  changed: boolean
  hooks: Set<string>
  documents: Set<string>
}

interface TransformContext {
  documentsNeeded: Set<string>
  typesNeeded: Set<string>
  needsUseQuery: boolean
  needsUseMutation: boolean
}

function transformHookUsage(content: string, result: TransformResult, context: TransformContext): string {
  return content.replaceAll(
    /const\s+(\{[^}]+\}|\[[^\]]+\])\s*=\s*use(\w+)(Query|Mutation)\s*\(([^)]*)\)/g,
    (match, destructure, baseName, type, params) => {
      result.changed = true
      result.hooks.add(`use${baseName}${type}`)

      const documentName = baseName
      const typeName = `${baseName}${type}`

      context.documentsNeeded.add(documentName)
      context.typesNeeded.add(typeName)

      const paramsStr = params.trim() ? `, ${params.trim()}` : ''

      if (type === 'Query') {
        context.needsUseQuery = true
        return `const ${destructure} = useQuery<${typeName}>(${documentName}${paramsStr})`
      } else {
        context.needsUseMutation = true
        return `const ${destructure} = useMutation<${typeName}>(${documentName}${paramsStr})`
      }
    }
  )
}

function transformDocumentReferences(content: string, result: TransformResult, context: TransformContext): string {
  return content.replace(
    /\b(\w+)Document\b/g,
    (match, baseName) => {
      result.changed = true
      result.documents.add(match)
      context.documentsNeeded.add(baseName)
      return baseName
    }
  )
}

function updateSdkImports(content: string, result: TransformResult, context: TransformContext): string {
  const sdkImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@nestled-template\/shared\/sdk['"]/gs
  const sdkImports = content.match(sdkImportRegex)

  if (!sdkImports || sdkImports.length === 0) {
    return content
  }

  return content.replace(sdkImportRegex, (match, imports) => {
    const importList = imports
      .split(',')
      .map((imp: string) => imp.trim())
      .filter((imp: string) => {
        if (!imp) return false
        if (imp.match(/^use\w+(Query|Mutation|LazyQuery|SuspenseQuery)$/)) {
          return false
        }
        if (imp.endsWith('Document')) {
          const baseName = imp.replace(/Document$/, '')
          context.documentsNeeded.add(baseName)
          return false
        }
        return true
      })

    context.documentsNeeded.forEach(doc => {
      if (!importList.includes(doc)) {
        importList.push(doc)
      }
    })
    context.typesNeeded.forEach(type => {
      if (!importList.includes(type) && !importList.includes(`type ${type}`)) {
        importList.push(`type ${type}`)
      }
    })

    const uniqueImports = Array.from(new Set(importList)).filter(Boolean)

    result.changed = true
    return `import { ${uniqueImports.join(', ')} } from '@nestled-template/shared/sdk'`
  })
}

function findLastImportIndex(lines: string[]): number {
  let lastImportIndex = -1
  let inImport = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('import ')) {
      inImport = true
      lastImportIndex = i
    } else if (inImport) {
      if (line.includes(' from ') || line.includes('}')) {
        lastImportIndex = i
        inImport = false
      }
    } else if (!line.startsWith('//') && line.length > 0 && !inImport) {
      break
    }
  }

  return lastImportIndex
}

function updateApolloImports(content: string, apolloImports: string[]): string {
  if (apolloImports.length === 0) {
    return content
  }

  const hasApolloImport = content.includes("from '@apollo/client")

  if (hasApolloImport) {
    return content.replace(
      /import\s+\{([^}]+)\}\s+from\s+['"]@apollo\/client\/react['"]/gs,
      (match, imports) => {
        const importList = imports
          .split(',')
          .map((imp: string) => imp.trim())
          .filter(Boolean)

        apolloImports.forEach(imp => {
          if (!importList.includes(imp)) {
            importList.push(imp)
          }
        })

        return `import { ${importList.join(', ')} } from '@apollo/client/react'`
      }
    )
  } else {
    const lines = content.split('\n')
    const lastImportIndex = findLastImportIndex(lines)

    if (lastImportIndex >= 0) {
      const apolloImportLine = `import { ${apolloImports.join(', ')} } from '@apollo/client/react'`
      lines.splice(lastImportIndex + 1, 0, apolloImportLine)
      return lines.join('\n')
    }
  }

  return content
}

function transformFile(content: string): TransformResult {
  const result: TransformResult = {
    content,
    changed: false,
    hooks: new Set(),
    documents: new Set(),
  }

  const context: TransformContext = {
    documentsNeeded: new Set<string>(),
    typesNeeded: new Set<string>(),
    needsUseQuery: false,
    needsUseMutation: false,
  }

  // Step 1: Transform hook usage patterns
  result.content = transformHookUsage(result.content, result, context)

  // Step 2: Transform document references
  result.content = transformDocumentReferences(result.content, result, context)

  // Step 3: Update SDK imports
  result.content = updateSdkImports(result.content, result, context)

  // Step 4: Update Apollo Client imports
  const apolloImports: string[] = []
  if (context.needsUseQuery) apolloImports.push('useQuery')
  if (context.needsUseMutation) apolloImports.push('useMutation')
  result.content = updateApolloImports(result.content, apolloImports)

  return result
}

function findFiles(dir: string, ext: string[] = ['.ts', '.tsx']): string[] {
  const files: string[] = []

  function walk(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name)

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git') {
          walk(fullPath)
        }
      } else if (entry.isFile()) {
        const fileExt = path.extname(entry.name)
        if (ext.includes(fileExt)) {
          files.push(fullPath)
        }
      }
    }
  }

  walk(dir)
  return files
}

async function main() {
  const routesDir = path.join(process.cwd(), 'apps/web/app/routes')
  const files = findFiles(routesDir)

  console.log(`Found ${files.length} files to process...\n`)

  let totalChanged = 0
  const allHooks = new Set<string>()
  const allDocuments = new Set<string>()

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8')

    const result = transformFile(content)

    if (result.changed) {
      fs.writeFileSync(filePath, result.content, 'utf-8')
      totalChanged++
      result.hooks.forEach(h => allHooks.add(h))
      result.documents.forEach(d => allDocuments.add(d))
      const relativePath = path.relative(process.cwd(), filePath)
      console.log(`✓ ${relativePath}`)
    }
  }

  console.log(`\n✨ Migration complete!`)
  console.log(`   Files changed: ${totalChanged}`)
  console.log(`   Total hooks transformed: ${allHooks.size}`)
  console.log(`   Total documents transformed: ${allDocuments.size}`)

  if (allHooks.size > 0) {
    console.log(`\nTransformed hooks:`)
    Array.from(allHooks).sort().forEach(h => console.log(`   - ${h}`))
  }
}

// Use top-level await instead of promise chain
try {
  await main()
} catch (error) {
  console.error(error)
  process.exit(1)
}
