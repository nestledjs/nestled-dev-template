// localStorage utilities for admin preferences - designed for easy export/import
interface AdminConfig {
  version: string
  models: Record<
    string,
    {
      visibleColumns?: string[]
      searchFields?: string[]
      sortPreference?: { orderBy: string; orderDirection: string }
    }
  >
}

const ADMIN_CONFIG_KEY = 'mi-admin-config'
const ADMIN_CONFIG_VERSION = '1.0'
const MAX_CONFIG_SIZE = 50000 // 50KB limit to prevent quota exhaustion

// Data sanitization utilities
const sanitizeString = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  // Remove potential XSS vectors while preserving legitimate data
  return value
    .replaceAll(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replaceAll(/javascript:/gi, '') // Remove javascript: protocols
    .replaceAll(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000) // Limit length
}

const sanitizeArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value
    .slice(0, 100) // Limit array size
    .map(item => sanitizeString(item))
    .filter(item => item.length > 0)
}

const sanitizeSortPreference = (
  value: unknown,
): { orderBy: string; orderDirection: string } | null => {
  if (!value || typeof value !== 'object') return null
  const obj = value as Record<string, unknown>

  const orderBy = sanitizeString(obj.orderBy)
  const orderDirection = sanitizeString(obj.orderDirection)

  // Validate sort direction
  if (!['asc', 'desc'].includes(orderDirection)) return null
  // Validate field name (alphanumeric + underscore only)
  if (!/^[a-zA-Z_]\w*$/.test(orderBy)) return null

  return { orderBy, orderDirection }
}

const isValidModelName = (name: string): boolean => /^[a-zA-Z_]\w*$/.test(name)

const isValidModelConfig = (modelConfig: unknown): boolean => {
  if (!modelConfig || typeof modelConfig !== 'object') return true
  const cfg = modelConfig as Record<string, unknown>
  if (cfg.visibleColumns !== undefined && !Array.isArray(cfg.visibleColumns)) return false
  if (cfg.sortPreference !== undefined) {
    const sortPref = sanitizeSortPreference(cfg.sortPreference)
    if (cfg.sortPreference !== null && sortPref === null) return false
  }
  if (cfg.searchFields !== undefined && !Array.isArray(cfg.searchFields)) return false
  return true
}

// Enhanced validation with security checks
const validateAdminConfig = (config: unknown): config is AdminConfig => {
  if (!config || typeof config !== 'object') return false

  const configObj = config as Record<string, unknown>

  if (configObj.version !== ADMIN_CONFIG_VERSION) return false
  if (!configObj.models || typeof configObj.models !== 'object') return false

  const models = configObj.models as Record<string, unknown>

  for (const [modelName, modelConfig] of Object.entries(models)) {
    if (!isValidModelName(modelName)) return false
    if (!isValidModelConfig(modelConfig)) return false
  }

  return true
}

export const SecureAdminLocalStorage = {
  // Get the full admin config with validation
  getConfig: (): AdminConfig => {
    try {
      const stored = localStorage.getItem(ADMIN_CONFIG_KEY)
      if (!stored) {
        return { version: ADMIN_CONFIG_VERSION, models: {} }
      }

      // Check size limit
      if (stored.length > MAX_CONFIG_SIZE) {
        localStorage.removeItem(ADMIN_CONFIG_KEY)
        return { version: ADMIN_CONFIG_VERSION, models: {} }
      }

      const parsed = JSON.parse(stored)

      if (!validateAdminConfig(parsed)) {
        localStorage.removeItem(ADMIN_CONFIG_KEY)
        return { version: ADMIN_CONFIG_VERSION, models: {} }
      }

      return parsed
    } catch {
      // Clear potentially corrupted data
      try {
        localStorage.removeItem(ADMIN_CONFIG_KEY)
      } catch (cleanupError) {
        console.error('Unexpected error:', cleanupError)
      }
      return { version: ADMIN_CONFIG_VERSION, models: {} }
    }
  },

  // Save the full admin config with validation
  setConfig: (config: AdminConfig): boolean => {
    try {
      // Validate input
      if (!validateAdminConfig(config)) {
        return false
      }

      const serialized = JSON.stringify(config)

      // Check size limit
      if (serialized.length > MAX_CONFIG_SIZE) {
        return false
      }

      localStorage.setItem(ADMIN_CONFIG_KEY, serialized)
      return true
    } catch (error) {
      console.error('Unexpected error:', error)
      return false
    }
  },

  // Get visible columns for a specific model with sanitization
  getColumnVisibility: (modelName: string): string[] | null => {
    const sanitizedModelName = sanitizeString(modelName)
    if (!sanitizedModelName) return null

    const config = SecureAdminLocalStorage.getConfig()
    const columns = config.models[sanitizedModelName]?.visibleColumns
    return columns ? sanitizeArray(columns) : null
  },

  // Set visible columns for a specific model with validation
  setColumnVisibility: (modelName: string, visibleColumns: string[]): boolean => {
    const sanitizedModelName = sanitizeString(modelName)
    const sanitizedColumns = sanitizeArray(visibleColumns)

    // Allow empty arrays - it's a valid preference (no columns selected)
    if (!sanitizedModelName) return false

    const config = SecureAdminLocalStorage.getConfig()
    if (!config.models[sanitizedModelName]) {
      config.models[sanitizedModelName] = {}
    }
    config.models[sanitizedModelName].visibleColumns = sanitizedColumns
    return SecureAdminLocalStorage.setConfig(config)
  },

  // Get sort preference for a specific model with validation
  getSortPreference: (modelName: string): { orderBy: string; orderDirection: string } | null => {
    const sanitizedModelName = sanitizeString(modelName)
    if (!sanitizedModelName) return null

    const config = SecureAdminLocalStorage.getConfig()
    const sortPref = config.models[sanitizedModelName]?.sortPreference
    return sortPref ? sanitizeSortPreference(sortPref) : null
  },

  // Set sort preference for a specific model with validation
  setSortPreference: (
    modelName: string,
    sortPreference: { orderBy: string; orderDirection: string },
  ): boolean => {
    const sanitizedModelName = sanitizeString(modelName)
    const sanitizedSortPref = sanitizeSortPreference(sortPreference)

    if (!sanitizedModelName || !sanitizedSortPref) return false

    const config = SecureAdminLocalStorage.getConfig()
    if (!config.models[sanitizedModelName]) {
      config.models[sanitizedModelName] = {}
    }
    config.models[sanitizedModelName].sortPreference = sanitizedSortPref
    return SecureAdminLocalStorage.setConfig(config)
  },

  // Get search fields for a specific model with sanitization
  getSearchFields: (modelName: string): string[] | null => {
    const sanitizedModelName = sanitizeString(modelName)
    if (!sanitizedModelName) return null

    const config = SecureAdminLocalStorage.getConfig()
    const searchFields = config.models[sanitizedModelName]?.searchFields
    return searchFields ? sanitizeArray(searchFields) : null
  },

  // Set search fields for a specific model with validation
  setSearchFields: (modelName: string, searchFields: string[]): boolean => {
    const sanitizedModelName = sanitizeString(modelName)
    const sanitizedFields = sanitizeArray(searchFields)

    // Allow empty arrays - it's a valid preference (no search fields selected)
    if (!sanitizedModelName) return false

    const config = SecureAdminLocalStorage.getConfig()
    if (!config.models[sanitizedModelName]) {
      config.models[sanitizedModelName] = {}
    }
    config.models[sanitizedModelName].searchFields = sanitizedFields
    return SecureAdminLocalStorage.setConfig(config)
  },

  // Export config as JSON string with validation
  exportConfig: (): string | null => {
    try {
      const config = SecureAdminLocalStorage.getConfig()
      // Double-check validation before export
      if (!validateAdminConfig(config)) {
        return null
      }
      return JSON.stringify(config, null, 2)
    } catch (error) {
      console.error('Unexpected error:', error)
      return null
    }
  },

  // Import config from JSON string with comprehensive security validation
  importConfig: (configJson: string): boolean => {
    try {
      // Sanitize input string
      const sanitizedJson = sanitizeString(configJson)
      if (!sanitizedJson || sanitizedJson.length > MAX_CONFIG_SIZE) {
        return false
      }

      const config = JSON.parse(sanitizedJson) as AdminConfig

      // Comprehensive validation with security checks
      if (!validateAdminConfig(config)) {
        return false
      }

      // Additional security: Check for suspicious patterns
      const serialized = JSON.stringify(config)
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /eval\s*\(/i,
        /function\s*\(/i,
      ]

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(serialized)) {
          return false
        }
      }

      return SecureAdminLocalStorage.setConfig(config)
    } catch (error) {
      console.error('Unexpected error:', error)
      return false
    }
  },

  // Clear all stored data (for security/privacy)
  clearConfig: (): boolean => {
    try {
      localStorage.removeItem(ADMIN_CONFIG_KEY)
      return true
    } catch (error) {
      console.error('Unexpected error:', error)
      return false
    }
  },
}

// Use the secure version for backwards compatibility
export const AdminLocalStorage = SecureAdminLocalStorage

// Export types
export type { AdminConfig }
