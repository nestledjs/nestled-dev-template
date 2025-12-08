import { describe, it, expect } from 'vitest'
import {
  kebabCase,
  spacedWords,
  formatFieldName,
  normalizeModelNameForDocument,
  getItemDisplayName,
  getSmartSearchFields,
} from './string-utils'

describe('string-utils', () => {
  describe('kebabCase', () => {
    it('should convert PascalCase to kebab-case', () => {
      expect(kebabCase('UserPreference')).toBe('user-preference')
      expect(kebabCase('Organization')).toBe('organization')
      expect(kebabCase('TeamMember')).toBe('team-member')
    })

    it('should convert camelCase to kebab-case', () => {
      expect(kebabCase('userPreference')).toBe('user-preference')
      expect(kebabCase('firstName')).toBe('first-name')
      expect(kebabCase('emailAddress')).toBe('email-address')
    })

    it('should handle consecutive capital letters', () => {
      expect(kebabCase('HTMLParser')).toBe('html-parser')
      expect(kebabCase('XMLHttpRequest')).toBe('xml-http-request')
      expect(kebabCase('APIKey')).toBe('api-key')
    })

    it('should handle already lowercase strings', () => {
      expect(kebabCase('user')).toBe('user')
      expect(kebabCase('organization')).toBe('organization')
    })

    it('should handle single character strings', () => {
      expect(kebabCase('A')).toBe('a')
      expect(kebabCase('a')).toBe('a')
    })

    it('should handle empty strings', () => {
      expect(kebabCase('')).toBe('')
    })
  })

  describe('spacedWords', () => {
    it('should convert PascalCase to spaced words', () => {
      expect(spacedWords('UserPreference')).toBe('User Preference')
      expect(spacedWords('Organization')).toBe('Organization')
      expect(spacedWords('TeamMember')).toBe('Team Member')
    })

    it('should convert camelCase to spaced words', () => {
      expect(spacedWords('userPreference')).toBe('user Preference')
      expect(spacedWords('firstName')).toBe('first Name')
      expect(spacedWords('emailAddress')).toBe('email Address')
    })

    it('should handle consecutive capital letters', () => {
      expect(spacedWords('HTMLParser')).toBe('HTML Parser')
      expect(spacedWords('XMLHttpRequest')).toBe('XML Http Request')
      expect(spacedWords('APIKey')).toBe('API Key')
    })

    it('should handle already lowercase strings', () => {
      expect(spacedWords('user')).toBe('user')
      expect(spacedWords('organization')).toBe('organization')
    })

    it('should handle empty strings', () => {
      expect(spacedWords('')).toBe('')
    })
  })

  describe('formatFieldName', () => {
    it('should format camelCase field names with spaces and capitalize first letter', () => {
      expect(formatFieldName('firstName')).toBe('First Name')
      expect(formatFieldName('emailAddress')).toBe('Email Address')
      expect(formatFieldName('phoneNumber')).toBe('Phone Number')
    })

    it('should format PascalCase field names with spaces', () => {
      expect(formatFieldName('UserPreference')).toBe('User Preference')
      expect(formatFieldName('TeamMember')).toBe('Team Member')
    })

    it('should handle single word lowercase', () => {
      expect(formatFieldName('name')).toBe('Name')
      expect(formatFieldName('email')).toBe('Email')
    })

    it('should handle single word uppercase', () => {
      expect(formatFieldName('Name')).toBe('Name')
      expect(formatFieldName('Email')).toBe('Email')
    })

    it('should handle empty strings', () => {
      expect(formatFieldName('')).toBe('')
    })

    it('should format dotted field names (for related enum fields)', () => {
      expect(formatFieldName('email.emailType')).toBe('Email Email Type')
      expect(formatFieldName('address.addressType')).toBe('Address Address Type')
      expect(formatFieldName('phoneNumber.phoneType')).toBe('Phone Number Phone Type')
    })
  })

  describe('normalizeModelNameForDocument', () => {
    it('should return model names unchanged (SDK uses exact Prisma model names)', () => {
      // PascalCase names
      expect(normalizeModelNameForDocument('User')).toBe('User')
      expect(normalizeModelNameForDocument('Organization')).toBe('Organization')
      expect(normalizeModelNameForDocument('TeamMember')).toBe('TeamMember')

      // Names with acronyms - should stay unchanged to match SDK-generated GraphQL operations
      expect(normalizeModelNameForDocument('CourseFAQ')).toBe('CourseFAQ')
      expect(normalizeModelNameForDocument('API')).toBe('API')
      expect(normalizeModelNameForDocument('HTMLParser')).toBe('HTMLParser')

      // camelCase names
      expect(normalizeModelNameForDocument('userPreference')).toBe('userPreference')
      expect(normalizeModelNameForDocument('teamMember')).toBe('teamMember')
    })

    it('should handle empty strings', () => {
      expect(normalizeModelNameForDocument('')).toBe('')
    })
  })

  describe('getItemDisplayName', () => {
    it('should return name property if present', () => {
      expect(getItemDisplayName({ name: 'John Doe', title: 'Manager', id: '123' })).toBe('John Doe')
      expect(getItemDisplayName({ name: 'Acme Corp', id: '456' })).toBe('Acme Corp')
    })

    it('should return title if name is not present', () => {
      expect(getItemDisplayName({ title: 'Software Engineer', email: 'test@example.com', id: '123' })).toBe(
        'Software Engineer',
      )
      expect(getItemDisplayName({ title: 'CEO', id: '456' })).toBe('CEO')
    })

    it('should combine firstName and lastName if both present', () => {
      expect(getItemDisplayName({ firstName: 'John', lastName: 'Doe', id: '123' })).toBe('John Doe')
      expect(getItemDisplayName({ firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', id: '456' })).toBe(
        'Jane Smith',
      )
    })

    it('should return firstName only if lastName is not present', () => {
      expect(getItemDisplayName({ firstName: 'John', email: 'john@example.com', id: '123' })).toBe('John')
      expect(getItemDisplayName({ firstName: 'Jane', id: '456' })).toBe('Jane')
    })

    it('should return email if name/title/firstName not present', () => {
      expect(getItemDisplayName({ email: 'user@example.com', id: '123' })).toBe('user@example.com')
      expect(getItemDisplayName({ email: 'test@test.com', id: '456' })).toBe('test@test.com')
    })

    it('should return id as fallback', () => {
      expect(getItemDisplayName({ id: '123' })).toBe('123')
      expect(getItemDisplayName({ id: 'abc-def-ghi' })).toBe('abc-def-ghi')
    })

    it('should prioritize name over other properties', () => {
      expect(
        getItemDisplayName({
          name: 'Display Name',
          title: 'Title',
          firstName: 'First',
          lastName: 'Last',
          email: 'email@example.com',
          id: '123',
        }),
      ).toBe('Display Name')
    })

    it('should handle empty/null/undefined values gracefully', () => {
      expect(getItemDisplayName({ name: '', title: 'Title', id: '123' })).toBe('Title')
      expect(getItemDisplayName({ firstName: '', lastName: 'Doe', id: '123' })).toBe('123')
      expect(getItemDisplayName({ email: '', id: '123' })).toBe('123')
    })
  })

  describe('getSmartSearchFields', () => {
    it('should return primary fields when available', () => {
      expect(getSmartSearchFields(['name', 'email', 'description'])).toEqual(['name', 'email'])
      expect(getSmartSearchFields(['title', 'content', 'author'])).toEqual(['title'])
      expect(getSmartSearchFields(['firstName', 'lastName', 'age'])).toEqual(['firstName', 'lastName'])
    })

    it('should limit to 2 primary fields', () => {
      expect(getSmartSearchFields(['name', 'title', 'email', 'firstName', 'lastName'])).toEqual(['name', 'title'])
      expect(getSmartSearchFields(['email', 'firstName', 'lastName', 'name'])).toEqual(['name', 'email'])
    })

    it('should use first available fields when no primary fields exist', () => {
      expect(getSmartSearchFields(['description', 'content', 'author'])).toEqual(['description', 'content'])
      expect(getSmartSearchFields(['field1', 'field2', 'field3'])).toEqual(['field1', 'field2'])
    })

    it('should handle single field arrays', () => {
      expect(getSmartSearchFields(['name'])).toEqual(['name'])
      expect(getSmartSearchFields(['description'])).toEqual(['description'])
    })

    it('should handle empty arrays', () => {
      expect(getSmartSearchFields([])).toEqual([])
    })

    it('should respect primary field priority order', () => {
      // Primary fields: ['name', 'title', 'email', 'firstName', 'lastName', 'subject']
      expect(getSmartSearchFields(['subject', 'email', 'name'])).toEqual(['name', 'email'])
      expect(getSmartSearchFields(['lastName', 'firstName', 'title'])).toEqual(['title', 'firstName'])
    })

    it('should handle arrays with more than 2 non-primary fields', () => {
      expect(getSmartSearchFields(['field1', 'field2', 'field3', 'field4', 'field5'])).toEqual(['field1', 'field2'])
    })

    it('should include subject as a primary field', () => {
      expect(getSmartSearchFields(['subject', 'content', 'author'])).toEqual(['subject'])
      expect(getSmartSearchFields(['description', 'subject', 'id'])).toEqual(['subject'])
    })
  })
})
