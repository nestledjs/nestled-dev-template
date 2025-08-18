// localStorage utilities for admin preferences - designed for easy export/import
interface AdminConfig {
  version: string
  models: Record<string, {
    visibleColumns?: string[]
    searchFields?: string[]
    sortPreference?: { orderBy: string; orderDirection: string }
  }>
}

const ADMIN_CONFIG_KEY = 'mi-admin-config'
const ADMIN_CONFIG_VERSION = '1.0'
const MAX_CONFIG_SIZE = 50000 // 50KB limit to prevent quota exhaustion

// Data sanitization utilities
const sanitizeString = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  // Remove potential XSS vectors while preserving legitimate data
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
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

const sanitizeSortPreference = (value: unknown): { orderBy: string; orderDirection: string } | null => {
  if (!value || typeof value !== 'object') return null
  const obj = value as Record<string, unknown>
  
  const orderBy = sanitizeString(obj.orderBy)
  const orderDirection = sanitizeString(obj.orderDirection)
  
  // Validate sort direction
  if (!['asc', 'desc'].includes(orderDirection)) return null
  // Validate field name (alphanumeric + underscore only)
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(orderBy)) return null
  
  return { orderBy, orderDirection }
}

// Enhanced validation with security checks
const validateAdminConfig = (config: unknown): config is AdminConfig => {
  if (!config || typeof config !== 'object') return false
  
  const configObj = config as Record<string, unknown>
  
  // Validate version
  if (configObj.version !== ADMIN_CONFIG_VERSION) return false
  
  // Validate models object
  if (!configObj.models || typeof configObj.models !== 'object') return false
  
  const models = configObj.models as Record<string, unknown>
  
  // Validate each model configuration
  for (const [modelName, modelConfig] of Object.entries(models)) {
    // Sanitize model name
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(modelName)) return false
    
    if (modelConfig && typeof modelConfig === 'object') {
      const config = modelConfig as Record<string, unknown>
      
      // Validate visible columns if present
      if (config.visibleColumns !== undefined && !Array.isArray(config.visibleColumns)) return false
      
      // Validate sort preference if present
      if (config.sortPreference !== undefined) {
        const sortPref = sanitizeSortPreference(config.sortPreference)
        if (config.sortPreference !== null && sortPref === null) return false
      }
      
      // Validate search fields if present
      if (config.searchFields !== undefined && !Array.isArray(config.searchFields)) return false
    }
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
        console.warn('[AdminLocalStorage] Config exceeds size limit, resetting')
        localStorage.removeItem(ADMIN_CONFIG_KEY)
        return { version: ADMIN_CONFIG_VERSION, models: {} }
      }
      
      const parsed = JSON.parse(stored)
      
      if (!validateAdminConfig(parsed)) {
        console.warn('[AdminLocalStorage] Invalid config detected, resetting')
        localStorage.removeItem(ADMIN_CONFIG_KEY)
        return { version: ADMIN_CONFIG_VERSION, models: {} }
      }
      
      return parsed
      
    } catch (error) {
      console.warn('[AdminLocalStorage] Failed to load config:', error)
      // Clear potentially corrupted data
      try {
        localStorage.removeItem(ADMIN_CONFIG_KEY)
    } catch {
        // Ignore cleanup errors
      }
      return { version: ADMIN_CONFIG_VERSION, models: {} }
    }
  },

  // Save the full admin config with validation
  setConfig: (config: AdminConfig): boolean => {
    try {
      // Validate input
      if (!validateAdminConfig(config)) {
        console.warn('[AdminLocalStorage] Invalid config provided')
        return false
      }
      
      const serialized = JSON.stringify(config)
      
      // Check size limit
      if (serialized.length > MAX_CONFIG_SIZE) {
        console.warn('[AdminLocalStorage] Config too large to store')
        return false
      }
      
      localStorage.setItem(ADMIN_CONFIG_KEY, serialized)
      return true
      
    } catch (error) {
      console.warn('[AdminLocalStorage] Failed to save config:', error)
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
    
    if (!sanitizedModelName || sanitizedColumns.length === 0) return false
    
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
  setSortPreference: (modelName: string, sortPreference: { orderBy: string; orderDirection: string }): boolean => {
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
    
    if (!sanitizedModelName || sanitizedFields.length === 0) return false
    
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
        console.warn('[AdminLocalStorage] Cannot export invalid config')
        return null
      }
      return JSON.stringify(config, null, 2)
    } catch (error) {
      console.warn('[AdminLocalStorage] Failed to export config:', error)
      return null
    }
  },

  // Import config from JSON string with comprehensive security validation
  importConfig: (configJson: string): boolean => {
    try {
      // Sanitize input string
      const sanitizedJson = sanitizeString(configJson)
      if (!sanitizedJson || sanitizedJson.length > MAX_CONFIG_SIZE) {
        console.warn('[AdminLocalStorage] Invalid or oversized config JSON')
        return false
      }
      
      const config = JSON.parse(sanitizedJson) as AdminConfig
      
      // Comprehensive validation with security checks
      if (!validateAdminConfig(config)) {
        console.warn('[AdminLocalStorage] Failed config validation during import')
        return false
      }
      
      // Additional security: Check for suspicious patterns
      const serialized = JSON.stringify(config)
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /eval\s*\(/i,
        /function\s*\(/i
      ]
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(serialized)) {
          console.warn('[AdminLocalStorage] Suspicious content detected in config')
    return false
  }
}
      
      return SecureAdminLocalStorage.setConfig(config)
      
    } catch (error) {
      console.warn('[AdminLocalStorage] Failed to import config:', error)
      return false
    }
  },

  // Clear all stored data (for security/privacy)
  clearConfig: (): boolean => {
    try {
      localStorage.removeItem(ADMIN_CONFIG_KEY)
      return true
    } catch (error) {
      console.warn('[AdminLocalStorage] Failed to clear config:', error)
      return false
    }
  }
}

// Use the secure version for backwards compatibility
export const AdminLocalStorage = SecureAdminLocalStorage

// Export types
export type { AdminConfig }
