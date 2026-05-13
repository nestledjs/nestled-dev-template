import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'
import { parse } from 'yaml'

type UpgradeNote = {
  id?: unknown
  title?: unknown
  priority?: unknown
  area?: unknown
  type?: unknown
  delivery?: unknown
  intent?: unknown
  why?: unknown
  affectedPaths?: unknown
  packageReleases?: unknown
  skipIf?: unknown
  verification?: unknown
  agentHints?: unknown
}

type PackageRelease = {
  name?: unknown
  sourcePath?: unknown
  targetVersion?: unknown
  versionRange?: unknown
}

const notesDir = '.nestled-template/upgrade-notes'
const idPattern = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/
const priorities = new Set(['critical', 'high', 'normal', 'low', 'ignore'])
const areas = new Set(['auth', 'billing', 'admin', 'ui', 'api', 'web', 'database', 'infra', 'docs'])
const types = new Set([
  'security',
  'correctness',
  'feature',
  'infra',
  'deps',
  'design',
  'docs',
  'cleanup',
])
const deliveries = new Set(['code-patch', 'package-release', 'hybrid'])
const publishedPackages = new Map([
  ['@nestledjs/data-browser', 'libs/data-browser'],
  ['@nestledjs/shared-components', 'libs/shared-components'],
])

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isNonEmptyString)

const includesCodePatch = (delivery: unknown): boolean =>
  delivery === 'code-patch' || delivery === 'hybrid'

const includesPackageRelease = (delivery: unknown): boolean =>
  delivery === 'package-release' || delivery === 'hybrid'

const validateOptionalStringList = (
  note: UpgradeNote,
  key: 'skipIf' | 'verification' | 'agentHints',
  errors: string[],
) => {
  const value = note[key]

  if (value !== undefined && !isStringList(value)) {
    errors.push(`${key} must be a list of non-empty strings when present`)
  }
}

const validatePackageReleases = (value: unknown, errors: string[]) => {
  if (!Array.isArray(value)) {
    errors.push('packageReleases must be a list when delivery includes package-release')
    return
  }

  if (value.length === 0) {
    errors.push(
      'packageReleases must contain at least one package when delivery includes package-release',
    )
    return
  }

  for (const [index, release] of value.entries()) {
    if (!release || typeof release !== 'object' || Array.isArray(release)) {
      errors.push(`packageReleases[${index}] must be an object`)
      continue
    }

    const packageRelease = release as PackageRelease

    if (!isNonEmptyString(packageRelease.name)) {
      errors.push(`packageReleases[${index}].name is required`)
      continue
    }

    const expectedSourcePath = publishedPackages.get(packageRelease.name)

    if (!expectedSourcePath) {
      errors.push(
        `packageReleases[${index}].name must be one of: ${Array.from(publishedPackages.keys()).join(', ')}`,
      )
    }

    if (!isNonEmptyString(packageRelease.sourcePath)) {
      errors.push(`packageReleases[${index}].sourcePath is required`)
    } else if (expectedSourcePath && packageRelease.sourcePath !== expectedSourcePath) {
      errors.push(
        `packageReleases[${index}].sourcePath must be ${expectedSourcePath} for ${packageRelease.name}`,
      )
    }

    if (
      packageRelease.targetVersion !== undefined &&
      !isNonEmptyString(packageRelease.targetVersion)
    ) {
      errors.push(`packageReleases[${index}].targetVersion must be a non-empty string when present`)
    }

    if (
      packageRelease.versionRange !== undefined &&
      !isNonEmptyString(packageRelease.versionRange)
    ) {
      errors.push(`packageReleases[${index}].versionRange must be a non-empty string when present`)
    }
  }
}

const getYamlFiles = (dir: string): string[] =>
  readdirSync(dir)
    .map(file => join(dir, file))
    .filter(file => statSync(file).isFile() && file.endsWith('.yaml'))
    .sort()

const validateNote = (filePath: string): string[] => {
  const errors: string[] = []
  const filenameId = basename(filePath, '.yaml')
  let note: UpgradeNote

  try {
    note = parse(readFileSync(filePath, 'utf8')) as UpgradeNote
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return [`YAML parse failed: ${message}`]
  }

  if (!note || typeof note !== 'object' || Array.isArray(note)) {
    return ['note must be a YAML object']
  }

  if (!isNonEmptyString(note.id)) {
    errors.push('id is required')
  } else {
    if (!idPattern.test(note.id)) {
      errors.push('id must match YYYY-MM-DD-short-description')
    }

    if (note.id !== filenameId) {
      errors.push(`id must match filename (${filenameId})`)
    }
  }

  if (!isNonEmptyString(note.title)) {
    errors.push('title is required')
  }

  if (!isNonEmptyString(note.priority)) {
    errors.push('priority is required')
  } else if (!priorities.has(note.priority)) {
    errors.push(`priority must be one of: ${Array.from(priorities).join(', ')}`)
  }

  if (!isNonEmptyString(note.area)) {
    errors.push('area is required')
  } else if (!areas.has(note.area)) {
    errors.push(`area must be one of: ${Array.from(areas).join(', ')}`)
  }

  if (!isNonEmptyString(note.type)) {
    errors.push('type is required')
  } else if (!types.has(note.type)) {
    errors.push(`type must be one of: ${Array.from(types).join(', ')}`)
  }

  if (note.priority !== 'ignore') {
    if (!isNonEmptyString(note.delivery)) {
      errors.push('delivery is required unless priority is ignore')
    } else if (!deliveries.has(note.delivery)) {
      errors.push(`delivery must be one of: ${Array.from(deliveries).join(', ')}`)
    }

    if (!isNonEmptyString(note.intent)) {
      errors.push('intent is required unless priority is ignore')
    }

    if (!isNonEmptyString(note.why)) {
      errors.push('why is required unless priority is ignore')
    }

    if (includesCodePatch(note.delivery)) {
      if (!isStringList(note.affectedPaths) || note.affectedPaths.length === 0) {
        errors.push(
          'affectedPaths must contain at least one path when delivery includes code-patch',
        )
      }
    } else if (note.affectedPaths !== undefined && !isStringList(note.affectedPaths)) {
      errors.push('affectedPaths must be a list of non-empty strings when present')
    }

    if (includesPackageRelease(note.delivery)) {
      validatePackageReleases(note.packageReleases, errors)
    } else if (
      note.packageReleases !== undefined &&
      (!Array.isArray(note.packageReleases) || note.packageReleases.length > 0)
    ) {
      errors.push(
        'packageReleases must be omitted or an empty list unless delivery includes package-release',
      )
    }
  } else {
    if (
      note.delivery !== undefined &&
      (!isNonEmptyString(note.delivery) || !deliveries.has(note.delivery))
    ) {
      errors.push(`delivery must be one of: ${Array.from(deliveries).join(', ')} when present`)
    }

    if (note.affectedPaths !== undefined && !isStringList(note.affectedPaths)) {
      errors.push('affectedPaths must be a list of non-empty strings when present')
    }

    if (note.packageReleases !== undefined && !Array.isArray(note.packageReleases)) {
      errors.push('packageReleases must be a list when present')
    }
  }

  validateOptionalStringList(note, 'skipIf', errors)
  validateOptionalStringList(note, 'verification', errors)
  validateOptionalStringList(note, 'agentHints', errors)

  return errors
}

const files = getYamlFiles(notesDir)
let errorCount = 0

for (const file of files) {
  const errors = validateNote(file)

  if (errors.length > 0) {
    errorCount += errors.length
    console.error(`\n${file}`)
    for (const error of errors) {
      console.error(`  - ${error}`)
    }
  }
}

if (errorCount > 0) {
  console.error(`\nUpgrade note validation failed with ${errorCount} error(s).`)
  process.exit(1)
}

console.log(
  files.length === 1 ? 'Validated 1 upgrade note.' : `Validated ${files.length} upgrade notes.`,
)
