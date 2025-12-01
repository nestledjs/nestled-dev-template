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

import * as fs from 'fs'
import * as path from 'path'

interface TransformResult {
  content: string
  changed: boolean
  hooks: Set<string>
  documents: Set<string>
}

function transformFile(content: string): TransformResult {
  const result: TransformResult = {
    content,
    changed: false,
    hooks: new Set(),
    documents: new Set(),
  }

  // Track what needs to be imported
  const documentsNeeded = new Set<string>()
  const typesNeeded = new Set<string>()
  let needsUseQuery = false
  let needsUseMutation = false

  // Step 1: Find and transform hook usage patterns
  // Pattern: const [...] = useXyzQuery(...)
  result.content = result.content.replace(
    /const\s+(\{[^}]+\}|\[[^\]]+\])\s*=\s*use(\w+)(Query|Mutation)\s*\(([^)]*)\)/g,
    (match, destructure, baseName, type, params) => {
      result.changed = true
      result.hooks.add(`use${baseName}${type}`)

      const documentName = baseName
      const typeName = `${baseName}${type}`

      documentsNeeded.add(documentName)
      typesNeeded.add(typeName)

      // Only include params if they exist and are not empty
      const paramsStr = params.trim() ? `, ${params.trim()}` : ''

      if (type === 'Query') {
        needsUseQuery = true
        return `const ${destructure} = useQuery<${typeName}>(${documentName}${paramsStr})`
      } else {
        needsUseMutation = true
        return `const ${destructure} = useMutation<${typeName}>(${documentName}${paramsStr})`
      }
    }
  )

  // Step 2: Transform standalone Document references (XyzDocument → Xyz)
  result.content = result.content.replace(
    /\b(\w+)Document\b/g,
    (match, baseName) => {
      // Don't transform if it's in a comment or string
      // This is a simple heuristic - may need refinement
      result.changed = true
      result.documents.add(match)
      documentsNeeded.add(baseName)
      return baseName
    }
  )

  // Step 3: Update imports from SDK (handle multi-line imports)
  const sdkImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@nestled-template\/shared\/sdk['"]/gs
  const sdkImports = result.content.match(sdkImportRegex)

  if (sdkImports && sdkImports.length > 0) {
    result.content = result.content.replace(sdkImportRegex, (match, imports) => {
      const importList = imports
        .split(',')
        .map((imp: string) => imp.trim())
        .filter((imp: string) => {
          // Skip empty imports
          if (!imp) return false

          // Remove old hook imports
          if (imp.match(/^use\w+(Query|Mutation|LazyQuery|SuspenseQuery)$/)) {
            return false
          }
          // Remove Document suffix from imports
          if (imp.endsWith('Document')) {
            const baseName = imp.replace(/Document$/, '')
            documentsNeeded.add(baseName)
            return false
          }
          return true
        })

      // Add new document and type imports
      documentsNeeded.forEach(doc => {
        if (!importList.includes(doc)) {
          importList.push(doc)
        }
      })
      typesNeeded.forEach(type => {
        if (!importList.includes(type) && !importList.includes(`type ${type}`)) {
          importList.push(`type ${type}`)
        }
      })

      // Remove duplicates and empty entries
      const uniqueImports = Array.from(new Set(importList)).filter(Boolean)

      result.changed = true
      return `import { ${uniqueImports.join(', ')} } from '@nestled-template/shared/sdk'`
    })
  }

  // Step 4: Add or update Apollo Client imports
  const hasApolloImport = result.content.includes("from '@apollo/client")
  const apolloImports: string[] = []

  if (needsUseQuery) apolloImports.push('useQuery')
  if (needsUseMutation) apolloImports.push('useMutation')

  if (apolloImports.length > 0) {
    if (hasApolloImport) {
      // Update existing import
      result.content = result.content.replace(
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
      // Add new import after the last import statement
      // Match all imports including multi-line ones, then insert after the last one
      const lines = result.content.split('\n')
      let lastImportIndex = -1
      let inImport = false

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.startsWith('import ')) {
          inImport = true
          lastImportIndex = i
        } else if (inImport) {
          // Check if this line closes the import (contains 'from')
          if (line.includes(' from ')) {
            lastImportIndex = i
            inImport = false
          } else if (line.includes('}')) {
            // Multi-line import closing
            lastImportIndex = i
            inImport = false
          }
        } else if (!line.startsWith('//') && line.length > 0 && !inImport) {
          // Non-import, non-comment line - stop looking
          break
        }
      }

      if (lastImportIndex >= 0) {
        const apolloImportLine = `import { ${apolloImports.join(', ')} } from '@apollo/client/react'`
        lines.splice(lastImportIndex + 1, 0, apolloImportLine)
        result.content = lines.join('\n')
      }
    }
  }

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

main().catch(console.error)
