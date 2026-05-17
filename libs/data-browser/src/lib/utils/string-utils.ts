// Helper to convert PascalCase or camelCase to kebab-case
export function kebabCase(name: string): string {
  return name
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

// Helper to convert PascalCase or camelCase to spaced words
export function spacedWords(name: string): string {
  return name.replaceAll(/([a-z])([A-Z])/g, '$1 $2').replaceAll(/([A-Z])([A-Z][a-z])/g, '$1 $2')
}

function isUppercaseLetter(char: string): boolean {
  return char >= 'A' && char <= 'Z'
}

function isLowercaseLetter(char: string | undefined): boolean {
  return char !== undefined && char >= 'a' && char <= 'z'
}

function titleCaseAcronym(acronym: string): string {
  return acronym.charAt(0).toUpperCase() + acronym.slice(1).toLowerCase()
}

// Helper to format field name for display
export function formatFieldName(fieldName: string): string {
  // Handle dotted field names (e.g., "email.emailType" -> "Email Email Type")
  if (fieldName.includes('.')) {
    return fieldName
      .split('.')
      .map(part => {
        // If all uppercase (like enum values), convert to title case
        if (part === part.toUpperCase() && part.length > 1) {
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        }
        return part
          .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/^./, (str: string) => str.toUpperCase())
      })
      .join(' ')
  }

  // If all uppercase (like enum values), convert to title case
  if (fieldName === fieldName.toUpperCase() && fieldName.length > 1) {
    // Handle underscore-separated names (e.g., "PENDING_APPROVAL" -> "Pending Approval")
    if (fieldName.includes('_')) {
      return fieldName
        .split('_')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ')
    }
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
  }

  return fieldName
    .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (str: string) => str.toUpperCase())
}

// Normalization function for GraphQL document names
// GraphQL codegen converts runs of 3+ consecutive uppercase letters to title case
// e.g., "CourseFAQ" -> "CourseFaq", "APIToken" -> "ApiToken"
// But 2-letter runs like "OAuth" stay as-is: "OAuthAccount" -> "OAuthAccount"
export function normalizeModelNameForDocument(modelName: string): string {
  let normalized = ''
  let index = 0

  while (index < modelName.length) {
    if (!isUppercaseLetter(modelName[index])) {
      normalized += modelName[index]
      index += 1
      continue
    }

    const runStart = index
    while (index < modelName.length && isUppercaseLetter(modelName[index])) {
      index += 1
    }

    const run = modelName.slice(runStart, index)
    const nextIsLowercase = isLowercaseLetter(modelName[index])

    if (run.length >= 4 && nextIsLowercase) {
      normalized += titleCaseAcronym(run.slice(0, -1)) + run.at(-1)
    } else if (run.length >= 3 && index === modelName.length) {
      normalized += titleCaseAcronym(run)
    } else {
      normalized += run
    }
  }

  return normalized
}

// Utility function for generating display names
export function getItemDisplayName(item: any): string {
  if (item.name) return item.name
  if (item.title) return item.title
  if (item.firstName && item.lastName) return `${item.firstName} ${item.lastName}`
  if (item.firstName) return item.firstName
  if (item.email) return item.email
  return item.id
}

// Utility function for getting smart search fields
export function getSmartSearchFields(availableFields: string[]): string[] {
  const primaryFields = ['name', 'title', 'email', 'firstName', 'lastName', 'subject']
  const primaryMatches = primaryFields.filter(field => availableFields.includes(field))

  if (primaryMatches.length >= 1) {
    return primaryMatches.slice(0, 2)
  }

  return availableFields.slice(0, Math.min(2, availableFields.length))
}
