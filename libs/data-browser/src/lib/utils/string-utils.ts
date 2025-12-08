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
  // Convert consecutive uppercase letters (3+) to title case
  // Handle two cases:
  // 1. Acronym followed by lowercase: "APIToken" -> match "API", keep "T" -> "ApiToken"
  // 2. Acronym at end of string: "CourseFAQ" -> "CourseFaq"
  return modelName
    // First handle acronyms followed by another capital+lowercase (e.g., APIToken -> ApiToken)
    .replace(/([A-Z]{2,})([A-Z][a-z])/g, (_, acronym, rest) => {
      if (acronym.length >= 2) {
        return acronym.charAt(0).toUpperCase() + acronym.slice(1).toLowerCase() + rest
      }
      return acronym + rest
    })
    // Then handle acronyms at end of string (e.g., CourseFAQ -> CourseFaq)
    .replace(/[A-Z]{3,}$/g, match =>
      match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
    )
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