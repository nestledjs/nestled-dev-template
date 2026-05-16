import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'

type Finding = {
  check: string
  message: string
  file?: string
}

const failures: Finding[] = []
const warnings: Finding[] = []

const routeRoot = 'apps/web/app/routes'
const routeConfigPath = 'apps/web/app/routes.tsx'
const schemaPath = 'libs/api/prisma/src/lib/schemas/schema.prisma'
const notesDir = '.nestled-template/upgrade-notes'

const fail = (check: string, message: string, file?: string) => {
  failures.push({ check, message, file })
}

const warn = (check: string, message: string, file?: string) => {
  warnings.push({ check, message, file })
}

const walkFiles = (dir: string, predicate: (path: string) => boolean): string[] => {
  if (!existsSync(dir)) return []

  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) {
      if (
        entry === 'node_modules' ||
        entry === 'dist' ||
        entry === 'build' ||
        entry === '.nx' ||
        entry === '.git' ||
        entry === '.claude'
      ) {
        continue
      }
      files.push(...walkFiles(path, predicate))
    } else if (stat.isFile() && predicate(path)) {
      files.push(path)
    }
  }
  return files
}

const directFiles = (dir: string, predicate: (path: string) => boolean): string[] => {
  if (!existsSync(dir)) return []

  return readdirSync(dir)
    .map(entry => join(dir, entry))
    .filter(path => statSync(path).isFile() && predicate(path))
}

const stripComments = (source: string): string =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')

const getRegisteredRouteFiles = (): Set<string> => {
  if (!existsSync(routeConfigPath)) {
    fail('routes', 'Route configuration file is missing', routeConfigPath)
    return new Set()
  }

  const routeConfig = stripComments(readFileSync(routeConfigPath, 'utf8'))
  const registered = new Set<string>()
  const routeFilePattern = /['"]\.\/routes\/([^'"]+\.(?:tsx|ts))['"]/g

  for (const match of routeConfig.matchAll(routeFilePattern)) {
    registered.add(join(routeRoot, match[1]))
  }

  return registered
}

const isRouteHelperFile = (path: string): boolean => {
  const file = basename(path)
  if (file.endsWith('.spec.ts') || file.endsWith('.spec.tsx')) return true
  if (file === 'route.ts' || file === 'routes.tsx') return true
  if (file === '_layout.tsx' || file === '_index.tsx') return false
  return file.startsWith('_')
}

const checkRoutes = () => {
  const registered = getRegisteredRouteFiles()
  const routeFiles = walkFiles(
    routeRoot,
    path => (path.endsWith('.tsx') || path.endsWith('.ts')) && !isRouteHelperFile(path),
  )

  for (const file of routeFiles) {
    if (!registered.has(file)) {
      fail(
        'routes',
        `Route file is not registered in ${routeConfigPath}`,
        file,
      )
    }
  }

  for (const file of registered) {
    if (!existsSync(file)) {
      fail('routes', 'Registered route file does not exist', file)
    }
  }
}

const checkForbiddenPrismaImports = () => {
  const files = walkFiles('.', path =>
    /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(path) &&
    !path.includes('/node_modules/') &&
    !path.includes('/build/') &&
    !path.includes('/dist/') &&
    !path.includes('/libs/shared/sdk/src/generated/') &&
    !path.includes('/libs/api/generated-crud/'),
  )

  const directImportPattern =
    /(?:from\s+['"]@prisma\/client['"]|require\(['"]@prisma\/client['"]\))/g

  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    if (directImportPattern.test(source)) {
      fail(
        'prisma-imports',
        'Import Prisma types from @nestled-template/api/prisma instead of @prisma/client',
        file,
      )
    }
  }
}

const checkStaleConfigNames = () => {
  const files = walkFiles('.', path =>
    /\.(ts|tsx|js|jsx|mjs|cjs|md|yml|yaml|json)$/.test(path) &&
    path !== 'scripts/doctor.ts' &&
    !path.includes('/node_modules/') &&
    !path.includes('/build/') &&
    !path.includes('/dist/'),
  )

  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    if (source.includes('frontendUrl') || source.includes('frontend.url')) {
      fail('config-names', 'Use siteUrl/SITE_URL instead of frontendUrl/frontend.url', file)
    }
  }
}

const checkMcpWiring = () => {
  const mcpModulePath = 'libs/api/custom/src/lib/plugins/mcp/mcp.module.ts'
  if (!existsSync(mcpModulePath)) return

  const appModulePath = 'apps/api/src/app.module.ts'
  const mainPath = 'apps/api/src/main.ts'
  const appModule = existsSync(appModulePath) ? readFileSync(appModulePath, 'utf8') : ''
  const main = existsSync(mainPath) ? readFileSync(mainPath, 'utf8') : ''

  if (!appModule.includes('McpModule')) {
    fail('mcp', 'McpModule exists but is not registered in the API app module', appModulePath)
  }

  if (!main.includes('/api/mcp')) {
    fail('mcp', 'MCP endpoints are not allowed by the early API request filter', mainPath)
  }
}

const normalizePath = (path: string): string =>
  `/${path}`
    .replace(/\/+/g, '/')
    .replace(/\/$/, '') || '/'

const getDecoratorPath = (decoratorArgs: string | undefined): string => {
  if (!decoratorArgs) return ''

  const trimmed = decoratorArgs.trim()
  if (!trimmed) return ''

  const literalMatch = trimmed.match(/^['"`]([^'"`]*)['"`]/)
  return literalMatch?.[1] ?? ''
}

const toApiRoute = (controllerPath: string, methodPath: string): string => {
  const combined = normalizePath(`${controllerPath}/${methodPath}`)
  if (combined === '/api' || combined.startsWith('/api/')) {
    return combined
  }
  return normalizePath(`/api${combined}`)
}

const getAllowedApiPrefixes = (): string[] => {
  const mainPath = 'apps/api/src/main.ts'
  if (!existsSync(mainPath)) {
    fail('api-routes', 'API bootstrap file is missing', mainPath)
    return []
  }

  const source = stripComments(readFileSync(mainPath, 'utf8'))
  const match = source.match(/const\s+VALID_API_PREFIXES\s*=\s*\[([\s\S]*?)\]/)
  if (!match) {
    fail('api-routes', 'VALID_API_PREFIXES could not be found', mainPath)
    return []
  }

  return Array.from(match[1].matchAll(/['"`]([^'"`]+)['"`]/g), item => normalizePath(item[1]))
}

const checkApiControllerRoutesAllowed = () => {
  const allowedPrefixes = getAllowedApiPrefixes()
  if (allowedPrefixes.length === 0) return

  const controllerFiles = walkFiles('.', path =>
    path.endsWith('.ts') &&
    !path.includes('/node_modules/') &&
    !path.includes('/build/') &&
    !path.includes('/dist/') &&
    !path.includes('/libs/api/generated-crud/') &&
    !path.endsWith('.spec.ts'),
  )

  for (const file of controllerFiles) {
    const source = stripComments(readFileSync(file, 'utf8'))
    if (!source.includes('@Controller')) continue

    const controllerPattern = /@Controller\s*\(([^)]*)\)/g
    for (const controllerMatch of source.matchAll(controllerPattern)) {
      const controllerPath = getDecoratorPath(controllerMatch[1])
      const classStart = controllerMatch.index ?? 0
      const nextControllerIndex = source.indexOf('@Controller', classStart + controllerMatch[0].length)
      const classSource =
        nextControllerIndex === -1 ? source.slice(classStart) : source.slice(classStart, nextControllerIndex)

      const methodPaths = Array.from(
        classSource.matchAll(/@(Get|Post|Put|Patch|Delete|All)\s*(?:\(([^)]*)\))?/g),
        match => getDecoratorPath(match[2]),
      )

      if (methodPaths.length === 0) {
        warn('api-routes', 'Controller has no HTTP method decorators to check', file)
        continue
      }

      for (const methodPath of methodPaths) {
        const routePath = toApiRoute(controllerPath, methodPath)
        const isAllowed = allowedPrefixes.some(prefix => routePath.startsWith(prefix))
        if (!isAllowed) {
          fail(
            'api-routes',
            `Registered API route ${routePath} is not covered by VALID_API_PREFIXES`,
            file,
          )
        }
      }
    }
  }
}

const getGraphqlResolverMethods = (source: string): string[] =>
  Array.from(
    source.matchAll(/^\s{2}(?:override\s+)?(?:async\s+)?(\w+)\s*\(/gm),
    match => match[1],
  ).filter(methodName => methodName !== 'constructor')

const getGeneratedCrudMethodNames = (): Set<string> => {
  const generatedResolverFiles = walkFiles(
    'libs/api/generated-crud/feature/src/lib',
    path => path.endsWith('.resolver.ts'),
  )
  const methodNames = new Set<string>()

  for (const file of generatedResolverFiles) {
    const source = stripComments(readFileSync(file, 'utf8'))
    for (const methodName of getGraphqlResolverMethods(source)) {
      methodNames.add(methodName)
    }
  }

  return methodNames
}

const checkDefaultResolverGeneratedNameCollisions = () => {
  const generatedMethodNames = getGeneratedCrudMethodNames()
  if (generatedMethodNames.size === 0) {
    fail('api-names', 'Generated CRUD method names could not be discovered')
    return
  }

  const defaultResolverFiles = walkFiles(
    'libs/api/custom/src/lib/default',
    path => path.endsWith('.resolver.ts'),
  )

  for (const file of defaultResolverFiles) {
    const source = stripComments(readFileSync(file, 'utf8'))
    const folderName = basename(dirname(file))
    const canonicalResolverPath = join(dirname(file), `${folderName}.resolver.ts`)

    if (file === canonicalResolverPath && !source.includes('extends Generated')) {
      fail(
        'api-names',
        'Default model resolver must extend its generated resolver to keep admin CRUD registered',
        file,
      )
    }

    for (const methodName of getGraphqlResolverMethods(source)) {
      if (generatedMethodNames.has(methodName)) {
        fail(
          'api-names',
          `Custom resolver method "${methodName}" collides with a generated CRUD field name`,
          file,
        )
      }

      if (/^admin[A-Z]/.test(methodName)) {
        fail(
          'api-names',
          `Custom default resolver method "${methodName}" uses reserved admin* naming`,
          file,
        )
      }
    }
  }
}

const checkHandwrittenAdminSdkOperations = () => {
  const graphqlFiles = walkFiles(
    'libs/shared/sdk/src/graphql',
    path => path.endsWith('.graphql'),
  )

  for (const file of graphqlFiles) {
    const source = stripComments(readFileSync(file, 'utf8'))
    const adminOperation = source.match(/\b(?:query|mutation|subscription)\s+__Admin\w+/)
    if (adminOperation) {
      fail(
        'api-names',
        'Hand-written __Admin* SDK operations belong under libs/shared/sdk/src/__admin',
        file,
      )
    }
  }
}

const pascalCase = (value: string): string =>
  value
    .split(/[-_]/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const getModuleClasses = (source: string): string[] =>
  Array.from(source.matchAll(/export\s+class\s+(\w+Module)\b/g), match => match[1])

const checkPluginExportsAndRegistration = () => {
  const pluginsRoot = 'libs/api/custom/src/lib/plugins'
  if (!existsSync(pluginsRoot)) return

  const rootIndexPath = join(pluginsRoot, 'index.ts')
  const appModulePath = 'apps/api/src/app.module.ts'
  const rootIndex = existsSync(rootIndexPath) ? readFileSync(rootIndexPath, 'utf8') : ''
  const appModule = existsSync(appModulePath) ? readFileSync(appModulePath, 'utf8') : ''

  for (const entry of readdirSync(pluginsRoot)) {
    const pluginDir = join(pluginsRoot, entry)
    if (!statSync(pluginDir).isDirectory()) continue

    const indexPath = join(pluginDir, 'index.ts')
    const moduleFiles = walkFiles(pluginDir, path => path.endsWith('.module.ts'))

    if (moduleFiles.length === 0) continue

    if (!existsSync(indexPath)) {
      fail('plugin-structure', 'Plugin with module is missing index.ts barrel', indexPath)
      continue
    }

    if (!rootIndex.includes(`'./${entry}'`) && !rootIndex.includes(`"./${entry}"`)) {
      fail('plugin-structure', 'Plugin is not exported from plugins/index.ts', pluginDir)
    }

    const pluginIndex = readFileSync(indexPath, 'utf8')
    for (const moduleFile of moduleFiles) {
      const moduleSource = readFileSync(moduleFile, 'utf8')
      const moduleClasses = getModuleClasses(moduleSource)
      const moduleBasename = basename(moduleFile, '.ts')

      if (
        !pluginIndex.includes(`'./${moduleBasename}'`) &&
        !pluginIndex.includes(`"./${moduleBasename}"`)
      ) {
        fail('plugin-structure', 'Plugin module is not exported from its index.ts', moduleFile)
      }

      for (const moduleClass of moduleClasses) {
        if (!appModule.includes(moduleClass)) {
          fail('plugin-structure', 'Plugin module is not registered in apps/api/src/app.module.ts', moduleFile)
        }
      }
    }
  }
}

const checkIntegrationExports = () => {
  const integrationsRoot = 'libs/api/integrations/src/lib'
  const rootIndexPath = 'libs/api/integrations/src/index.ts'
  if (!existsSync(integrationsRoot)) return

  const rootIndex = existsSync(rootIndexPath) ? readFileSync(rootIndexPath, 'utf8') : ''

  for (const entry of readdirSync(integrationsRoot)) {
    const integrationDir = join(integrationsRoot, entry)
    if (!statSync(integrationDir).isDirectory()) continue

    const indexPath = join(integrationDir, 'index.ts')
    const moduleFiles = directFiles(integrationDir, path => path.endsWith('.module.ts'))
    const serviceFiles = directFiles(integrationDir, path => path.endsWith('.service.ts'))

    if (moduleFiles.length === 0 && serviceFiles.length === 0) continue

    if (!existsSync(indexPath)) {
      fail('integration-structure', 'Integration with service/module is missing index.ts barrel', indexPath)
      continue
    }

    if (!rootIndex.includes(`'./lib/${entry}'`) && !rootIndex.includes(`"./lib/${entry}"`)) {
      fail('integration-structure', 'Integration is not exported from integrations/src/index.ts', integrationDir)
    }

    const integrationIndex = readFileSync(indexPath, 'utf8')
    const expectedBasenames = [...moduleFiles, ...serviceFiles].map(file => basename(file, '.ts'))
    for (const expectedBasename of expectedBasenames) {
      if (
        !integrationIndex.includes(`'./${expectedBasename}'`) &&
        !integrationIndex.includes(`"./${expectedBasename}"`)
      ) {
        fail('integration-structure', 'Integration module/service is not exported from its index.ts', join(integrationDir, `${expectedBasename}.ts`))
      }
    }
  }
}

const checkSkipCrudDocumentation = () => {
  if (!existsSync(schemaPath)) return

  const lines = readFileSync(schemaPath, 'utf8').split('\n')
  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].includes('@skipCrud')) continue

    const context = lines.slice(index, index + 5).join(' ').toLowerCase()
    const hasSecurityExplanation =
      context.includes('security') ||
      context.includes('credential') ||
      context.includes('password') ||
      context.includes('secret') ||
      context.includes('token') ||
      context.includes('internal')

    if (!hasSecurityExplanation) {
      fail(
        'skip-crud',
        '@skipCrud must include an adjacent security-sensitive internal model explanation',
        `${schemaPath}:${index + 1}`,
      )
    }
  }
}

const checkPublishablePackageReadmes = () => {
  const packageFiles = walkFiles('libs', path => basename(path) === 'package.json')

  for (const file of packageFiles) {
    const pkg = JSON.parse(readFileSync(file, 'utf8')) as {
      name?: string
      publishConfig?: unknown
      private?: boolean
    }
    const isPublishable = !pkg.private && (pkg.publishConfig || pkg.name?.startsWith('@nestledjs/'))
    if (!isPublishable) continue

    const readmePath = join(dirname(file), 'README.md')
    if (!existsSync(readmePath)) {
      fail('package-readmes', 'Publishable package is missing README.md', readmePath)
    }
  }
}

const checkPreReleaseUpgradeNotes = () => {
  const rootPackage = JSON.parse(readFileSync('package.json', 'utf8')) as { version?: string }
  const isPreReleaseTemplate = !rootPackage.version || rootPackage.version === '0.0.0'
  if (!isPreReleaseTemplate || !existsSync(notesDir)) return

  const notes = readdirSync(notesDir).filter(file => file.endsWith('.yaml'))
  if (notes.length > 0) {
    fail(
      'upgrade-notes',
      'Upgrade notes should stay empty until the first public template release',
      notes.map(note => join(notesDir, note)).join(', '),
    )
  }
}

const printFindings = (label: string, items: Finding[]) => {
  if (items.length === 0) return

  console.log(`\n${label}`)
  for (const item of items) {
    const suffix = item.file ? ` (${relative(process.cwd(), item.file)})` : ''
    console.log(`- [${item.check}] ${item.message}${suffix}`)
  }
}

checkRoutes()
checkForbiddenPrismaImports()
checkStaleConfigNames()
checkMcpWiring()
checkApiControllerRoutesAllowed()
checkDefaultResolverGeneratedNameCollisions()
checkHandwrittenAdminSdkOperations()
checkPluginExportsAndRegistration()
checkIntegrationExports()
checkSkipCrudDocumentation()
checkPublishablePackageReadmes()
checkPreReleaseUpgradeNotes()

printFindings('Warnings', warnings)
printFindings('Failures', failures)

if (failures.length > 0) {
  console.error(`\nNestled doctor failed with ${failures.length} issue(s).`)
  process.exit(1)
}

console.log('Nestled doctor passed.')
