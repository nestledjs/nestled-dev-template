import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SecureAdminLocalStorage, type AdminConfig } from './secure-storage'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('secure-storage', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('getConfig', () => {
    it('should return default config when storage is empty', () => {
      const config = SecureAdminLocalStorage.getConfig()
      expect(config).toEqual({
        version: '1.0',
        models: {},
      })
    })

    it('should return stored config when valid', () => {
      const validConfig: AdminConfig = {
        version: '1.0',
        models: {
          User: {
            visibleColumns: ['id', 'name', 'email'],
            searchFields: ['name', 'email'],
            sortPreference: { orderBy: 'name', orderDirection: 'asc' },
          },
        },
      }
      localStorageMock.setItem('mi-admin-config', JSON.stringify(validConfig))

      const config = SecureAdminLocalStorage.getConfig()
      expect(config).toEqual(validConfig)
    })

    it('should return default config for invalid JSON', () => {
      localStorageMock.setItem('mi-admin-config', 'invalid json')
      const config = SecureAdminLocalStorage.getConfig()
      expect(config).toEqual({
        version: '1.0',
        models: {},
      })
    })

    it('should return default config for wrong version', () => {
      const wrongVersion = {
        version: '2.0',
        models: {},
      }
      localStorageMock.setItem('mi-admin-config', JSON.stringify(wrongVersion))
      const config = SecureAdminLocalStorage.getConfig()
      expect(config).toEqual({
        version: '1.0',
        models: {},
      })
    })

    it('should return default config when size exceeds limit', () => {
      const hugeConfig = {
        version: '1.0',
        models: {
          Model: {
            visibleColumns: Array(10000).fill('column'),
          },
        },
      }
      localStorageMock.setItem('mi-admin-config', JSON.stringify(hugeConfig))
      const config = SecureAdminLocalStorage.getConfig()
      expect(config).toEqual({
        version: '1.0',
        models: {},
      })
    })

    it('should clear storage after detecting invalid data', () => {
      localStorageMock.setItem('mi-admin-config', 'invalid')
      SecureAdminLocalStorage.getConfig()
      expect(localStorageMock.getItem('mi-admin-config')).toBeNull()
    })
  })

  describe('setConfig', () => {
    it('should store valid config', () => {
      const validConfig: AdminConfig = {
        version: '1.0',
        models: {
          User: {
            visibleColumns: ['id', 'name'],
          },
        },
      }
      const result = SecureAdminLocalStorage.setConfig(validConfig)
      expect(result).toBe(true)
      expect(JSON.parse(localStorageMock.getItem('mi-admin-config')!)).toEqual(validConfig)
    })

    it('should reject invalid config', () => {
      const invalidConfig = {
        version: '2.0',
        models: {},
      } as any
      const result = SecureAdminLocalStorage.setConfig(invalidConfig)
      expect(result).toBe(false)
    })

    it('should reject config exceeding size limit', () => {
      const hugeConfig: AdminConfig = {
        version: '1.0',
        models: {
          Model: {
            visibleColumns: Array(10000).fill('column'),
          },
        },
      }
      const result = SecureAdminLocalStorage.setConfig(hugeConfig)
      expect(result).toBe(false)
    })

    it('should reject config with invalid model names', () => {
      const invalidConfig = {
        version: '1.0',
        models: {
          'User<script>': {},
        },
      } as any
      const result = SecureAdminLocalStorage.setConfig(invalidConfig)
      expect(result).toBe(false)
    })
  })

  describe('getColumnVisibility', () => {
    beforeEach(() => {
      const config: AdminConfig = {
        version: '1.0',
        models: {
          User: {
            visibleColumns: ['id', 'name', 'email'],
          },
        },
      }
      localStorageMock.setItem('mi-admin-config', JSON.stringify(config))
    })

    it('should return visible columns for existing model', () => {
      const columns = SecureAdminLocalStorage.getColumnVisibility('User')
      expect(columns).toEqual(['id', 'name', 'email'])
    })

    it('should return null for non-existent model', () => {
      const columns = SecureAdminLocalStorage.getColumnVisibility('NonExistent')
      expect(columns).toBeNull()
    })

    it('should sanitize model name', () => {
      const columns = SecureAdminLocalStorage.getColumnVisibility('User<script>')
      expect(columns).toBeNull()
    })

    it('should return null for empty model name', () => {
      const columns = SecureAdminLocalStorage.getColumnVisibility('')
      expect(columns).toBeNull()
    })
  })

  describe('setColumnVisibility', () => {
    it('should set visible columns for new model', () => {
      const result = SecureAdminLocalStorage.setColumnVisibility('User', ['id', 'name', 'email'])
      expect(result).toBe(true)

      const columns = SecureAdminLocalStorage.getColumnVisibility('User')
      expect(columns).toEqual(['id', 'name', 'email'])
    })

    it('should update visible columns for existing model', () => {
      SecureAdminLocalStorage.setColumnVisibility('User', ['id', 'name'])
      SecureAdminLocalStorage.setColumnVisibility('User', ['id', 'email'])

      const columns = SecureAdminLocalStorage.getColumnVisibility('User')
      expect(columns).toEqual(['id', 'email'])
    })

    it('should allow empty array', () => {
      const result = SecureAdminLocalStorage.setColumnVisibility('User', [])
      expect(result).toBe(true)

      const columns = SecureAdminLocalStorage.getColumnVisibility('User')
      expect(columns).toEqual([])
    })

    it('should store column names after sanitization attempt', () => {
      SecureAdminLocalStorage.setColumnVisibility('User', ['id<script>alert(1)</script>', 'name', 'email'])
      const columns = SecureAdminLocalStorage.getColumnVisibility('User')
      // Storage validates and sanitizes on input
      expect(columns).toBeDefined()
      expect(columns!.length).toBeGreaterThan(0)
    })

    it('should reject invalid model names', () => {
      const result = SecureAdminLocalStorage.setColumnVisibility('', ['id'])
      expect(result).toBe(false)
    })
  })

  describe('getSortPreference', () => {
    beforeEach(() => {
      const config: AdminConfig = {
        version: '1.0',
        models: {
          User: {
            sortPreference: { orderBy: 'name', orderDirection: 'asc' },
          },
        },
      }
      localStorageMock.setItem('mi-admin-config', JSON.stringify(config))
    })

    it('should return sort preference for existing model', () => {
      const sortPref = SecureAdminLocalStorage.getSortPreference('User')
      expect(sortPref).toEqual({ orderBy: 'name', orderDirection: 'asc' })
    })

    it('should return null for non-existent model', () => {
      const sortPref = SecureAdminLocalStorage.getSortPreference('NonExistent')
      expect(sortPref).toBeNull()
    })

    it('should return null for empty model name', () => {
      const sortPref = SecureAdminLocalStorage.getSortPreference('')
      expect(sortPref).toBeNull()
    })
  })

  describe('setSortPreference', () => {
    it('should set sort preference for new model', () => {
      const result = SecureAdminLocalStorage.setSortPreference('User', {
        orderBy: 'name',
        orderDirection: 'asc',
      })
      expect(result).toBe(true)

      const sortPref = SecureAdminLocalStorage.getSortPreference('User')
      expect(sortPref).toEqual({ orderBy: 'name', orderDirection: 'asc' })
    })

    it('should update sort preference for existing model', () => {
      SecureAdminLocalStorage.setSortPreference('User', { orderBy: 'name', orderDirection: 'asc' })
      SecureAdminLocalStorage.setSortPreference('User', { orderBy: 'email', orderDirection: 'desc' })

      const sortPref = SecureAdminLocalStorage.getSortPreference('User')
      expect(sortPref).toEqual({ orderBy: 'email', orderDirection: 'desc' })
    })

    it('should reject invalid sort directions', () => {
      const result = SecureAdminLocalStorage.setSortPreference('User', {
        orderBy: 'name',
        orderDirection: 'invalid' as any,
      })
      expect(result).toBe(false)
    })

    it('should reject invalid field names', () => {
      const result = SecureAdminLocalStorage.setSortPreference('User', {
        orderBy: 'name<script>',
        orderDirection: 'asc',
      })
      expect(result).toBe(false)
    })

    it('should accept valid asc and desc directions', () => {
      expect(SecureAdminLocalStorage.setSortPreference('User', { orderBy: 'name', orderDirection: 'asc' })).toBe(true)
      expect(SecureAdminLocalStorage.setSortPreference('User', { orderBy: 'name', orderDirection: 'desc' })).toBe(true)
    })

    it('should reject field names with special characters', () => {
      const result = SecureAdminLocalStorage.setSortPreference('User', {
        orderBy: 'name-field',
        orderDirection: 'asc',
      })
      expect(result).toBe(false)
    })

    it('should accept field names with underscores', () => {
      const result = SecureAdminLocalStorage.setSortPreference('User', {
        orderBy: 'first_name',
        orderDirection: 'asc',
      })
      expect(result).toBe(true)
    })
  })

  describe('getSearchFields', () => {
    beforeEach(() => {
      const config: AdminConfig = {
        version: '1.0',
        models: {
          User: {
            searchFields: ['name', 'email'],
          },
        },
      }
      localStorageMock.setItem('mi-admin-config', JSON.stringify(config))
    })

    it('should return search fields for existing model', () => {
      const fields = SecureAdminLocalStorage.getSearchFields('User')
      expect(fields).toEqual(['name', 'email'])
    })

    it('should return null for non-existent model', () => {
      const fields = SecureAdminLocalStorage.getSearchFields('NonExistent')
      expect(fields).toBeNull()
    })

    it('should return null for empty model name', () => {
      const fields = SecureAdminLocalStorage.getSearchFields('')
      expect(fields).toBeNull()
    })
  })

  describe('setSearchFields', () => {
    it('should set search fields for new model', () => {
      const result = SecureAdminLocalStorage.setSearchFields('User', ['name', 'email'])
      expect(result).toBe(true)

      const fields = SecureAdminLocalStorage.getSearchFields('User')
      expect(fields).toEqual(['name', 'email'])
    })

    it('should update search fields for existing model', () => {
      SecureAdminLocalStorage.setSearchFields('User', ['name'])
      SecureAdminLocalStorage.setSearchFields('User', ['email'])

      const fields = SecureAdminLocalStorage.getSearchFields('User')
      expect(fields).toEqual(['email'])
    })

    it('should allow empty array', () => {
      const result = SecureAdminLocalStorage.setSearchFields('User', [])
      expect(result).toBe(true)

      const fields = SecureAdminLocalStorage.getSearchFields('User')
      expect(fields).toEqual([])
    })

    it('should store field names after sanitization attempt', () => {
      SecureAdminLocalStorage.setSearchFields('User', ['name<script>alert(1)</script>', 'email'])
      const fields = SecureAdminLocalStorage.getSearchFields('User')
      // Storage validates and sanitizes on input
      expect(fields).toBeDefined()
      expect(fields!.length).toBeGreaterThan(0)
    })
  })

  describe('exportConfig', () => {
    it('should export config as JSON string', () => {
      const config: AdminConfig = {
        version: '1.0',
        models: {
          User: {
            visibleColumns: ['id', 'name'],
          },
        },
      }
      localStorageMock.setItem('mi-admin-config', JSON.stringify(config))

      const exported = SecureAdminLocalStorage.exportConfig()
      expect(exported).not.toBeNull()
      expect(JSON.parse(exported!)).toEqual(config)
    })

    it('should return default config when there is invalid data stored', () => {
      localStorageMock.setItem('mi-admin-config', 'invalid')
      const exported = SecureAdminLocalStorage.exportConfig()
      expect(exported).not.toBeNull()
      const parsed = JSON.parse(exported!)
      expect(parsed).toEqual({
        version: '1.0',
        models: {},
      })
    })

    it('should format exported JSON with indentation', () => {
      const config: AdminConfig = {
        version: '1.0',
        models: {
          User: {},
        },
      }
      localStorageMock.setItem('mi-admin-config', JSON.stringify(config))

      const exported = SecureAdminLocalStorage.exportConfig()
      expect(exported).toContain('\n')
      expect(exported).toContain('  ')
    })
  })

  describe('importConfig', () => {
    it('should import valid config', () => {
      const config: AdminConfig = {
        version: '1.0',
        models: {
          User: {
            visibleColumns: ['id', 'name'],
          },
        },
      }
      const result = SecureAdminLocalStorage.importConfig(JSON.stringify(config))
      expect(result).toBe(true)

      const stored = SecureAdminLocalStorage.getConfig()
      expect(stored).toEqual(config)
    })

    it('should reject invalid JSON', () => {
      const result = SecureAdminLocalStorage.importConfig('invalid json')
      expect(result).toBe(false)
    })

    it('should reject config with wrong version', () => {
      const config = {
        version: '2.0',
        models: {},
      }
      const result = SecureAdminLocalStorage.importConfig(JSON.stringify(config))
      expect(result).toBe(false)
    })

    it('should reject config exceeding size limit', () => {
      const hugeConfig = {
        version: '1.0',
        models: {
          Model: {
            visibleColumns: Array(10000).fill('column'),
          },
        },
      }
      const result = SecureAdminLocalStorage.importConfig(JSON.stringify(hugeConfig))
      expect(result).toBe(false)
    })

    it('should reject config with invalid model names containing special characters', () => {
      const maliciousConfig = {
        version: '1.0',
        models: {
          'User-Model': {}, // Hyphen is not allowed, only alphanumeric and underscore
        },
      }
      const result = SecureAdminLocalStorage.importConfig(JSON.stringify(maliciousConfig))
      expect(result).toBe(false)
    })

    it('should reject config with javascript: protocol', () => {
      const maliciousConfig = JSON.stringify({
        version: '1.0',
        models: {},
      }).replace('1.0', 'javascript:alert(1)')
      const result = SecureAdminLocalStorage.importConfig(maliciousConfig)
      expect(result).toBe(false)
    })

    it('should reject config with event handlers', () => {
      const maliciousConfig = JSON.stringify({
        version: '1.0',
        models: {},
      }).replace('1.0', 'onclick=alert(1)')
      const result = SecureAdminLocalStorage.importConfig(maliciousConfig)
      expect(result).toBe(false)
    })

    it('should reject config with eval', () => {
      const maliciousConfig = JSON.stringify({
        version: '1.0',
        models: {},
      }).replace('1.0', 'eval(alert(1))')
      const result = SecureAdminLocalStorage.importConfig(maliciousConfig)
      expect(result).toBe(false)
    })

    it('should reject config with function declarations', () => {
      const maliciousConfig = JSON.stringify({
        version: '1.0',
        models: {},
      }).replace('1.0', 'function() { alert(1) }')
      const result = SecureAdminLocalStorage.importConfig(maliciousConfig)
      expect(result).toBe(false)
    })
  })

  describe('clearConfig', () => {
    it('should clear all stored data', () => {
      const config: AdminConfig = {
        version: '1.0',
        models: {
          User: {},
        },
      }
      localStorageMock.setItem('mi-admin-config', JSON.stringify(config))

      const result = SecureAdminLocalStorage.clearConfig()
      expect(result).toBe(true)
      expect(localStorageMock.getItem('mi-admin-config')).toBeNull()
    })

    it('should return true even if storage is empty', () => {
      const result = SecureAdminLocalStorage.clearConfig()
      expect(result).toBe(true)
    })
  })

  describe('security validation', () => {
    it('should sanitize XSS attempts in column names', () => {
      SecureAdminLocalStorage.setColumnVisibility('User', ['<script>alert("xss")</script>', 'name'])
      const columns = SecureAdminLocalStorage.getColumnVisibility('User')
      expect(columns?.some((col) => col.includes('<script>'))).toBe(false)
    })

    it('should limit array sizes', () => {
      const largeArray = Array(200).fill('column')
      SecureAdminLocalStorage.setColumnVisibility('User', largeArray)
      const columns = SecureAdminLocalStorage.getColumnVisibility('User')
      expect(columns!.length).toBeLessThanOrEqual(100)
    })

    it('should limit string lengths', () => {
      const longString = 'a'.repeat(2000)
      SecureAdminLocalStorage.setColumnVisibility('User', [longString])
      const columns = SecureAdminLocalStorage.getColumnVisibility('User')
      expect(columns![0].length).toBeLessThanOrEqual(1000)
    })

    it('should remove javascript: protocols', () => {
      SecureAdminLocalStorage.setColumnVisibility('User', ['javascript:alert(1)', 'name'])
      const columns = SecureAdminLocalStorage.getColumnVisibility('User')
      expect(columns?.some((col) => col.includes('javascript:'))).toBe(false)
    })

    it('should remove event handlers', () => {
      SecureAdminLocalStorage.setColumnVisibility('User', ['onclick=alert(1)', 'name'])
      const columns = SecureAdminLocalStorage.getColumnVisibility('User')
      expect(columns?.some((col) => col.includes('onclick='))).toBe(false)
    })
  })
})
