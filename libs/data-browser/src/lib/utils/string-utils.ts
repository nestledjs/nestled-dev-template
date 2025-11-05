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
  return fieldName
    .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, str => str.toUpperCase())
}

// Smart normalization function for GraphQL document names
export function normalizeModelNameForDocument(modelName: string): string {
  // If it's all uppercase (likely an acronym), convert to proper case
  if (modelName === modelName.toUpperCase() && modelName.length > 1) {
    // For acronyms, only capitalize the first letter for document names
    return modelName.charAt(0).toUpperCase() + modelName.slice(1).toLowerCase()
  }
  
  // For normal PascalCase names, return as-is
  return modelName
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