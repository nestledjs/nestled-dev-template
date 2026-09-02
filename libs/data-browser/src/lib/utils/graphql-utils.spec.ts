import { describe, it, expect, vi } from 'vitest'
import {
  getAdminDocuments,
  getMutationName,
  buildFormFields,
  cleanFormInput,
  toKebabCase,
  toReadableText,
  sanitizeInput,
} from './graphql-utils'
import { formatLocalDateTime } from '@nestledjs/forms-core'
import type { DatabaseModel } from '../types'

describe('graphql-utils', () => {
  describe('getAdminDocuments', () => {
    it('should return all required documents for a valid model', () => {
      const mockModel: DatabaseModel = {
        name: 'User',
        fields: [],
      }

      const mockSdk = {
        __AdminUser: 'query-doc',
        __AdminUsers: 'list-query-doc',
        __AdminCreateUser: 'create-doc',
        __AdminUpdateUser: 'update-doc',
        __AdminDeleteUser: 'delete-doc',
      }

      const result = getAdminDocuments(mockSdk, mockModel)

      expect(result).toEqual({
        query: 'query-doc',
        listQuery: 'list-query-doc',
        create: 'create-doc',
        update: 'update-doc',
        delete: 'delete-doc',
      })
    })

    it('should handle model names with acronyms (FAQ -> Faq)', () => {
      const mockModel: DatabaseModel = {
        name: 'FAQ',
        fields: [],
      }

      const mockSdk = {
        __AdminFaq: 'query-doc',
        __AdminFaqs: 'list-query-doc',
        __AdminCreateFaq: 'create-doc',
        __AdminUpdateFaq: 'update-doc',
        __AdminDeleteFaq: 'delete-doc',
      }

      const result = getAdminDocuments(mockSdk, mockModel)

      expect(result.query).toBe('query-doc')
      expect(result.listQuery).toBe('list-query-doc')
    })

    it('should throw error when model is invalid', () => {
      const invalidModel = null as any

      expect(() => getAdminDocuments({}, invalidModel)).toThrow(
        'Invalid model provided to getAdminDocuments',
      )
    })

    it('should throw error when model name is missing', () => {
      const mockModel = { fields: [] } as any

      expect(() => getAdminDocuments({}, mockModel)).toThrow(
        'Invalid model provided to getAdminDocuments',
      )
    })

    it('should throw error when required documents are missing', () => {
      const mockModel: DatabaseModel = {
        name: 'User',
        fields: [],
      }

      const incompleteSdk = {
        __AdminUser: 'query-doc',
        // Missing other required documents
      }

      expect(() => getAdminDocuments(incompleteSdk, mockModel)).toThrow(/Missing GraphQL documents/)
      expect(() => getAdminDocuments(incompleteSdk, mockModel)).toThrow(/User/)
    })

    it('should list all missing documents in error message', () => {
      const mockModel: DatabaseModel = {
        name: 'User',
        fields: [],
      }

      const emptySdk = {}

      expect(() => getAdminDocuments(emptySdk, mockModel)).toThrow(/__AdminUser/)
      expect(() => getAdminDocuments(emptySdk, mockModel)).toThrow(/__AdminUsers/)
      expect(() => getAdminDocuments(emptySdk, mockModel)).toThrow(/__AdminCreateUser/)
    })

    it('should handle PascalCase model names correctly', () => {
      const mockModel: DatabaseModel = {
        name: 'TeamMember',
        fields: [],
      }

      const mockSdk = {
        __AdminTeamMember: 'query-doc',
        __AdminTeamMembers: 'list-query-doc',
        __AdminCreateTeamMember: 'create-doc',
        __AdminUpdateTeamMember: 'update-doc',
        __AdminDeleteTeamMember: 'delete-doc',
      }

      const result = getAdminDocuments(mockSdk, mockModel)

      expect(result.query).toBe('query-doc')
      expect(result.listQuery).toBe('list-query-doc')
    })
  })

  describe('getMutationName', () => {
    it('should generate correct create mutation name', () => {
      const mockModel: DatabaseModel = {
        name: 'User',
        fields: [],
      }

      expect(getMutationName(mockModel, 'create')).toBe('createUser')
    })

    it('should generate correct update mutation name', () => {
      const mockModel: DatabaseModel = {
        name: 'User',
        fields: [],
      }

      expect(getMutationName(mockModel, 'update')).toBe('updateUser')
    })

    it('should generate correct delete mutation name', () => {
      const mockModel: DatabaseModel = {
        name: 'User',
        fields: [],
      }

      expect(getMutationName(mockModel, 'delete')).toBe('deleteUser')
    })

    it('should handle multi-word model names', () => {
      const mockModel: DatabaseModel = {
        name: 'TeamMember',
        fields: [],
      }

      expect(getMutationName(mockModel, 'create')).toBe('createTeamMember')
      expect(getMutationName(mockModel, 'update')).toBe('updateTeamMember')
      expect(getMutationName(mockModel, 'delete')).toBe('deleteTeamMember')
    })

    it('should handle single character model names', () => {
      const mockModel: DatabaseModel = {
        name: 'A',
        fields: [],
      }

      expect(getMutationName(mockModel, 'create')).toBe('createA')
    })

    it('falls back to lower camel case for unknown operations', () => {
      const mockModel: DatabaseModel = {
        name: 'TeamMember',
        fields: [],
      }

      expect(getMutationName(mockModel, 'archive' as any)).toBe('teamMember')
    })
  })

  describe('name and input helpers', () => {
    it('converts PascalCase names to kebab case', () => {
      expect(toKebabCase('TeamMember')).toBe('team-member')
    })

    it('converts camel case names to readable labels', () => {
      expect(toReadableText('primaryContactEmail')).toBe('Primary Contact Email')
    })

    it('sanitizes script-like input and bounds length', () => {
      const longInput = `${'a'.repeat(120)}<script onload=alert(1)>javascript:alert(1)</script>`

      expect(sanitizeInput(longInput)).toBe('a'.repeat(100))
      expect(sanitizeInput(undefined)).toBe('')
    })
  })

  describe('buildFormFields', () => {
    describe('basic field types', () => {
      it('should create text field for string type', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'name', type: 'String', isOptional: false }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result).toHaveLength(2) // field + submit button
        expect(result[0].key).toBe('name')
        expect(result[0].type).toBe('Text')
        expect(result[0].options?.required).toBe(true)
      })

      it('should create email field for email-named string fields', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'email', type: 'String', isOptional: false }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('Email')
      })

      it('should create email field for userEmail string fields', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'userEmail', type: 'String', isOptional: false }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('Email')
      })

      it('should create email field for emailAddress string fields', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'emailAddress', type: 'String', isOptional: false }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('Email')
      })

      it('should create plain text (not email) for validateEmailToken (PIR-175)', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'validateEmailToken', type: 'String', isOptional: true }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('Text')
      })

      it('should create plain text (not email) for emailVerificationToken (PIR-175)', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'emailVerificationToken', type: 'String', isOptional: true }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('Text')
      })

      it('should create textarea for description fields', () => {
        const mockModel: DatabaseModel = {
          name: 'Post',
          fields: [{ name: 'description', type: 'String', isOptional: true }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('TextArea')
      })

      it('should create textarea for internalNotes fields', () => {
        const mockModel: DatabaseModel = {
          name: 'Post',
          fields: [{ name: 'internalNotes', type: 'String', isOptional: true }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('TextArea')
      })

      it('should create plain text (not textarea) for contentType (PIR-175)', () => {
        const mockModel: DatabaseModel = {
          name: 'Upload',
          fields: [{ name: 'contentType', type: 'String', isOptional: true }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('Text')
      })

      it('should create plain text (not textarea) for notesCount (PIR-175)', () => {
        const mockModel: DatabaseModel = {
          name: 'Post',
          fields: [{ name: 'notesCount', type: 'String', isOptional: true }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('Text')
      })

      it('should create checkbox for boolean type', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'isActive', type: 'Boolean', isOptional: false }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('Checkbox')
        expect(result[0].options?.required).toBe(false) // Booleans are never required in forms
      })

      it('should create date picker for date type', () => {
        const mockModel: DatabaseModel = {
          name: 'Event',
          fields: [{ name: 'eventDate', type: 'Date', isOptional: true }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('DatePicker')
      })

      it('should create datetime picker for datetime type', () => {
        const mockModel: DatabaseModel = {
          name: 'Event',
          fields: [{ name: 'startTime', type: 'DateTime', isOptional: true }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('DateTimePicker')
      })
    })

    describe('field filtering', () => {
      it('should skip ID field for create operations', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [
            { name: 'id', type: 'String', isId: true },
            { name: 'name', type: 'String', isOptional: false },
          ],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result).toHaveLength(2) // only name + submit button
        expect(result[0].key).toBe('name')
      })

      it('should include ID field for update operations', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [
            { name: 'id', type: 'String', isId: true },
            { name: 'name', type: 'String', isOptional: false },
          ],
        }

        const result = buildFormFields({}, mockModel, 'update', {
          currentItem: { id: '123', name: 'John' },
        })

        const fieldNames = result.map(f => f.key)
        expect(fieldNames).toContain('id')
      })

      it('should skip readonly fields', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [
            { name: 'name', type: 'String', isOptional: false },
            { name: 'computed', type: 'String', isReadOnly: true },
          ],
        }

        const result = buildFormFields({}, mockModel, 'create')

        const fieldNames = result.map(f => f.key)
        expect(fieldNames).not.toContain('computed')
      })

      it('should skip generated fields', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [
            { name: 'name', type: 'String', isOptional: false },
            { name: 'generatedField', type: 'String', isGenerated: true },
          ],
        }

        const result = buildFormFields({}, mockModel, 'create')

        const fieldNames = result.map(f => f.key)
        expect(fieldNames).not.toContain('generatedField')
      })

      it('should skip timestamp fields', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [
            { name: 'name', type: 'String', isOptional: false },
            { name: 'createdAt', type: 'DateTime' },
            { name: 'updatedAt', type: 'DateTime', isUpdatedAt: true },
          ],
        }

        const result = buildFormFields({}, mockModel, 'create')

        const fieldNames = result.map(f => f.key)
        expect(fieldNames).not.toContain('createdAt')
        expect(fieldNames).not.toContain('updatedAt')
      })
    })

    describe('enum fields', () => {
      it('should create select field for enum types', () => {
        const mockSdk = {
          UserRole: {
            ADMIN: 'ADMIN',
            USER: 'USER',
            GUEST: 'GUEST',
          },
        }

        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'role', type: 'UserRole', isOptional: false }],
        }

        const result = buildFormFields(mockSdk, mockModel, 'create')

        expect(result[0].type).toBe('Select')
        expect((result[0].options as any).options).toHaveLength(3)
        expect((result[0].options as any).options?.map((o: any) => o.value)).toEqual([
          'ADMIN',
          'USER',
          'GUEST',
        ])
      })

      it('should format enum labels nicely', () => {
        const mockSdk = {
          PaymentStatus: {
            PENDING_PAYMENT: 'PENDING_PAYMENT',
            PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
          },
        }

        const mockModel: DatabaseModel = {
          name: 'Invoice',
          fields: [{ name: 'status', type: 'PaymentStatus', isOptional: false }],
        }

        const result = buildFormFields(mockSdk, mockModel, 'create')

        expect((result[0].options as any).options?.map((o: any) => o.label)).toEqual([
          'Pending payment',
          'Payment received',
        ])
      })

      it('should handle legacy enum fields with enumValues property', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [
            {
              name: 'status',
              type: 'UserStatus', // Use a non-standard type that triggers the enum fallback
              kind: 'enum',
              enumValues: ['ACTIVE', 'INACTIVE', 'PENDING'],
              isOptional: false,
            },
          ],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('Select')
        expect((result[0].options as any).options).toHaveLength(3)
      })

      it('should ignore GraphQL document values when checking SDK enums', () => {
        const mockSdk = {
          UserStatus: { kind: 'Document', definitions: [] },
        }
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'status', type: 'UserStatus', isOptional: true }],
        }

        const result = buildFormFields(mockSdk, mockModel, 'create')

        expect(result[0].type).toBe('Text')
      })

      it('should build enum options from enum-like object keys when values are numeric', () => {
        const mockSdk = {
          Priority: {
            LOW: 0,
            HIGH: 1,
          },
        }
        const mockModel: DatabaseModel = {
          name: 'Task',
          fields: [{ name: 'priority', type: 'Priority', isOptional: false }],
        }

        const result = buildFormFields(mockSdk, mockModel, 'create')

        expect(result[0].type).toBe('Select')
        expect((result[0].options as any).options.map((option: any) => option.value)).toEqual([
          'LOW',
          'HIGH',
        ])
      })

      it('should create checkbox groups for list enum fields', () => {
        const mockSdk = {
          DayOfWeek: {
            MONDAY: 'MONDAY',
            TUESDAY: 'TUESDAY',
          },
        }
        const mockModel: DatabaseModel = {
          name: 'Schedule',
          fields: [{ name: 'days', type: 'DayOfWeek', kind: 'enum', isList: true }],
        }

        const result = buildFormFields(mockSdk, mockModel, 'update', {
          currentItem: { days: ['MONDAY'] },
        })

        expect(result[0].type).toBe('CheckboxGroup')
        expect((result[0].options as any).checkboxOptions).toHaveLength(2)
      })
    })

    describe('relation fields', () => {
      it('should use foreign key field name for relation fields', () => {
        const mockModel: DatabaseModel = {
          name: 'Post',
          fields: [
            {
              name: 'author',
              type: 'User',
              relationName: 'PostToUser',
              relationFromFields: ['authorId'],
              isOptional: true,
            },
          ],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].key).toBe('authorId')
      })

      it('should create searchSelectApollo for relations with documents', () => {
        const mockSdk = {
          __AdminUsers: 'users-doc',
        }

        const mockModel: DatabaseModel = {
          name: 'Post',
          fields: [
            {
              name: 'author',
              type: 'User',
              relationName: 'PostToUser',
              relationFromFields: ['authorId'],
              isOptional: true,
            },
          ],
        }

        const result = buildFormFields(mockSdk, mockModel, 'create')

        expect(result[0].type).toBe('SearchSelectApollo')
      })

      it('should merge current relation option with sorted query options', () => {
        const mockSdk = {
          __AdminUsers: 'users-doc',
        }
        const mockModel: DatabaseModel = {
          name: 'Post',
          fields: [
            {
              name: 'author',
              type: 'User',
              relationName: 'PostToUser',
              relationFromFields: ['authorId'],
              isOptional: true,
            },
          ],
        }

        const result = buildFormFields(mockSdk, mockModel, 'update', {
          currentItem: {
            authorId: 'user-1',
            author: { id: 'user-1', firstName: 'Current', lastName: 'User' },
          },
          displayFieldConfig: {
            User: {
              display: ['firstName', 'lastName'],
              search: ['email'],
            },
          },
        })
        const fieldOptions = result[0].options as any

        expect(fieldOptions.initialOptions).toEqual([{ value: 'user-1', label: 'Current User' }])
        expect(fieldOptions.searchFields).toEqual(['email'])
        expect(
          fieldOptions.selectOptionsFunction([
            { id: 'user-2', firstName: 'Another', lastName: 'User' },
            { id: 'user-1', firstName: 'Current', lastName: 'User' },
          ]),
        ).toEqual([
          { value: 'user-2', label: 'Another User' },
          { value: 'user-1', label: 'Current User' },
        ])
      })

      it('should fall back to relation object IDs and ID labels when display fields are missing', () => {
        const mockSdk = {
          Users: 'users-doc',
        }
        const mockModel: DatabaseModel = {
          name: 'Post',
          fields: [
            {
              name: 'author',
              type: 'User',
              relationName: 'PostToUser',
              isOptional: true,
            },
          ],
        }

        const result = buildFormFields(mockSdk, mockModel, 'update', {
          currentItem: {
            author: { id: 'user-1' },
          },
        })
        const fieldOptions = result[0].options as any

        expect(result[0].key).toBe('authorId')
        expect(fieldOptions.value).toBe('user-1')
        expect(fieldOptions.initialOptions).toEqual([{ value: 'user-1', label: 'user-1' }])
        expect(fieldOptions.customWrapper('field')).toBeTruthy()
      })

      it('should fallback to text input when relation document not found', () => {
        const mockModel: DatabaseModel = {
          name: 'Post',
          fields: [
            {
              name: 'author',
              type: 'User',
              relationName: 'PostToUser',
              relationFromFields: ['authorId'],
              isOptional: true,
            },
          ],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].type).toBe('Text')
        expect(result[0].options?.label).toContain('ID')
      })

      it('should skip list relations for create operations', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [
            { name: 'name', type: 'String', isOptional: false },
            { name: 'posts', type: 'Post', isList: true, relationName: 'UserToPosts' },
          ],
        }

        const result = buildFormFields({}, mockModel, 'create')

        const fieldNames = result.map(f => f.key)
        expect(fieldNames).not.toContain('posts')
      })
    })

    describe('initial values for update operations', () => {
      it('should populate initial values from currentItem', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [
            { name: 'name', type: 'String', isOptional: false },
            { name: 'email', type: 'String', isOptional: false },
          ],
        }

        const currentItem = {
          id: '123',
          name: 'John Doe',
          email: 'john@example.com',
        }

        const result = buildFormFields({}, mockModel, 'update', { currentItem })

        expect(result[0].options?.value).toBe('John Doe')
        expect(result[1].options?.value).toBe('john@example.com')
      })

      it('should convert Date objects to proper format for date fields', () => {
        const mockModel: DatabaseModel = {
          name: 'Event',
          fields: [{ name: 'eventDate', type: 'Date', isOptional: true }],
        }

        const currentItem = {
          eventDate: new Date('2024-03-15T10:30:00Z'),
        }

        const result = buildFormFields({}, mockModel, 'update', { currentItem })

        expect(result[0].options?.value).toBe('2024-03-15')
      })

      it('should convert Date objects to datetime-local format for datetime fields', () => {
        const mockModel: DatabaseModel = {
          name: 'Event',
          fields: [{ name: 'startTime', type: 'DateTime', isOptional: true }],
        }

        const currentItem = {
          startTime: new Date('2024-03-15T10:30:00Z'),
        }

        const result = buildFormFields({}, mockModel, 'update', { currentItem })

        // A `datetime-local` input carries no timezone, so it must be filled with LOCAL
        // components. Asserting a fixed literal here would only hold in a UTC-run test.
        expect(result[0].options?.value).toBe(formatLocalDateTime(currentItem.startTime))
      })

      it('round-trips a datetime through the form without shifting the instant', () => {
        const mockModel: DatabaseModel = {
          name: 'Event',
          fields: [{ name: 'startTime', type: 'DateTime', isOptional: true }],
        }

        const instant = new Date('2024-03-15T10:30:00Z')
        const shown = buildFormFields({}, mockModel, 'update', {
          currentItem: { startTime: instant },
        })[0].options?.value

        // `cleanFormInput` reads the input back as local wall-clock time. When the value was
        // written in as the UTC wall-clock, every save moved the stored instant by the viewer's
        // UTC offset and compounded on each edit.
        const submitted = cleanFormInput({ startTime: shown }, mockModel)

        expect(new Date(submitted['startTime'] as string).toISOString()).toBe(instant.toISOString())
      })

      it('should handle date strings as initial values', () => {
        const mockModel: DatabaseModel = {
          name: 'Event',
          fields: [{ name: 'eventDate', type: 'Date', isOptional: true }],
        }

        const currentItem = {
          eventDate: '2024-03-15T00:00:00Z',
        }

        const result = buildFormFields({}, mockModel, 'update', { currentItem })

        expect(result[0].options?.value).toBe('2024-03-15')
      })

      it('should extract ID from relation objects', () => {
        const mockModel: DatabaseModel = {
          name: 'Post',
          fields: [
            {
              name: 'author',
              type: 'User',
              relationName: 'PostToUser',
              relationFromFields: ['authorId'],
              isOptional: true,
            },
          ],
        }

        const currentItem = {
          author: { id: 'user-123', name: 'John' },
        }

        const result = buildFormFields({}, mockModel, 'update', { currentItem })

        expect(result[0].options?.value).toBe('user-123')
      })

      it('should convert null to empty string for non-boolean fields', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'middleName', type: 'String', isOptional: true }],
        }

        const currentItem = {
          middleName: null,
        }

        const result = buildFormFields({}, mockModel, 'update', { currentItem })

        expect(result[0].options?.value).toBe('')
      })

      it('should convert boolean values correctly', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'isActive', type: 'Boolean', isOptional: false }],
        }

        const currentItem = {
          isActive: true,
        }

        const result = buildFormFields({}, mockModel, 'update', { currentItem })

        expect(result[0].options?.value).toBe(true)
      })
    })

    describe('submit button', () => {
      it('should add Create button for create operations', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'name', type: 'String', isOptional: false }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        const submitButton = result[result.length - 1]
        expect(submitButton.type).toBe('Button')
        expect(submitButton.options?.text).toBe('Create')
      })

      it('should add Update button for update operations', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'name', type: 'String', isOptional: false }],
        }

        const result = buildFormFields({}, mockModel, 'update', {})

        const submitButton = result[result.length - 1]
        expect(submitButton.type).toBe('Button')
        expect(submitButton.options?.text).toBe('Update')
      })

      it('should show loading text when submitting', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'name', type: 'String', isOptional: false }],
        }

        const result = buildFormFields({}, mockModel, 'create', { isSubmitting: true })

        const submitButton = result[result.length - 1]
        expect(submitButton.options?.text).toBe('Creating...')
        expect(submitButton.options?.disabled).toBe(true)
      })
    })

    describe('list relations on update', () => {
      it('should show link to related items for list relations', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [
            { name: 'name', type: 'String', isOptional: false },
            { name: 'posts', type: 'Post', isList: true, relationName: 'UserToPosts' },
          ],
        }

        const databaseModels: DatabaseModel[] = [
          mockModel,
          {
            name: 'Post',
            fields: [
              {
                name: 'author',
                type: 'User',
                relationName: 'UserToPosts',
                relationFromFields: ['authorId'],
              },
            ],
          },
        ]

        const currentItem = { id: '123', name: 'John' }

        const result = buildFormFields({}, mockModel, 'update', {
          currentItem,
          isSubmitting: false,
          basePath: '/admin/data',
          databaseModels,
        })

        const fieldNames = result.map(f => f.key)
        expect(fieldNames).toContain('posts')
      })

      it('should fall back to current model foreign key naming without database metadata', () => {
        const mockModel: DatabaseModel = {
          name: 'APIKey',
          fields: [
            { name: 'id', type: 'String', isId: true },
            { name: 'tokens', type: 'Token', isList: true, relationName: 'TokenToApiKey' },
          ],
        }

        const result = buildFormFields({}, mockModel, 'update', {
          currentItem: { id: 'key-1', _count: { tokens: 2 } },
          basePath: '/admin/data',
        })
        const contentField = result.find(field => field.key === 'tokens') as any
        const content = contentField.options.content
        const link = content.props.children[1]

        expect(link.props.to).toBe('/admin/data/tokens?aPIKeyId=key-1')
        expect(link.props.children[1]).toBe('See Related Tokens (2)')
      })
    })

    describe('field labels', () => {
      it('should format field names as labels', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [
            { name: 'firstName', type: 'String', isOptional: false },
            { name: 'lastName', type: 'String', isOptional: false },
          ],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].options?.label).toBe('First Name')
        expect(result[1].options?.label).toBe('Last Name')
      })
    })

    describe('required field handling', () => {
      it('should mark non-optional fields as required', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'email', type: 'String', isOptional: false }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].options?.required).toBe(true)
      })

      it('should not mark optional fields as required', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'middleName', type: 'String', isOptional: true }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].options?.required).toBe(false)
      })

      it('should not mark array fields as required', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'tags', type: 'String', isList: true, isOptional: false }],
        }

        const result = buildFormFields({}, mockModel, 'create')

        expect(result[0].options?.required).toBe(false)
      })
    })
  })

  describe('cleanFormInput', () => {
    describe('system field removal', () => {
      it('should remove __typename field', () => {
        const input = {
          name: 'John',
          __typename: 'User',
        }

        const result = cleanFormInput(input)

        expect(result).toEqual({ name: 'John' })
        expect(result.__typename).toBeUndefined()
      })

      it('should remove id field', () => {
        const input = {
          name: 'John',
          id: '123',
        }

        const result = cleanFormInput(input)

        expect(result).toEqual({ name: 'John' })
        expect(result.id).toBeUndefined()
      })

      it('should remove createdAt and updatedAt fields', () => {
        const input = {
          name: 'John',
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const result = cleanFormInput(input)

        expect(result).toEqual({ name: 'John' })
      })

      it('should remove _count and _meta fields', () => {
        const input = {
          name: 'John',
          _count: { posts: 5 },
          _meta: { some: 'data' },
        }

        const result = cleanFormInput(input)

        expect(result).toEqual({ name: 'John' })
      })

      it('should remove undefined values', () => {
        const input = {
          name: 'John',
          email: undefined,
          age: 30,
        }

        const result = cleanFormInput(input)

        expect(result).toEqual({ name: 'John', age: 30 })
      })
    })

    describe('string to type conversion', () => {
      it('should convert empty strings to null', () => {
        const input = {
          name: 'John',
          middleName: '',
        }

        const result = cleanFormInput(input)

        expect(result).toEqual({ name: 'John', middleName: null })
      })

      it('should convert "true" string to boolean true', () => {
        const input = {
          isActive: 'true',
        }

        const result = cleanFormInput(input)

        expect(result.isActive).toBe(true)
      })

      it('should convert "false" string to boolean false', () => {
        const input = {
          isActive: 'false',
        }

        const result = cleanFormInput(input)

        expect(result.isActive).toBe(false)
      })

      it('should convert numeric strings to numbers for numeric fields', () => {
        const mockModel: DatabaseModel = {
          name: 'Product',
          fields: [
            { name: 'price', type: 'Float', isOptional: false },
            { name: 'quantity', type: 'Int', isOptional: false },
          ],
        }

        const input = {
          price: '19.99',
          quantity: '5',
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.price).toBe(19.99)
        expect(result.quantity).toBe(5)
      })

      it('should NOT convert numeric strings for String fields', () => {
        const mockModel: DatabaseModel = {
          name: 'Location',
          fields: [
            { name: 'latitude', type: 'String', isOptional: false },
            { name: 'longitude', type: 'String', isOptional: false },
          ],
        }

        const input = {
          latitude: '40.7128',
          longitude: '-74.0060',
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.latitude).toBe('40.7128')
        expect(result.longitude).toBe('-74.0060')
      })

      it('should handle negative numbers', () => {
        const mockModel: DatabaseModel = {
          name: 'Transaction',
          fields: [{ name: 'amount', type: 'Float', isOptional: false }],
        }

        const input = {
          amount: '-25.50',
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.amount).toBe(-25.5)
      })

      it('should handle decimal numbers', () => {
        const mockModel: DatabaseModel = {
          name: 'Product',
          fields: [{ name: 'price', type: 'Decimal', isOptional: false }],
        }

        const input = {
          price: '99.99',
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.price).toBe(99.99)
      })

      it('should handle BigInt fields', () => {
        const mockModel: DatabaseModel = {
          name: 'Stats',
          fields: [{ name: 'views', type: 'BigInt', isOptional: false }],
        }

        const input = {
          views: '1000000',
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.views).toBe(1000000)
      })
    })

    describe('datetime conversion', () => {
      it('should convert datetime-local format to ISO string', () => {
        const mockModel: DatabaseModel = {
          name: 'Event',
          fields: [{ name: 'startTime', type: 'DateTime', isOptional: false }],
        }

        const input = {
          startTime: '2024-03-15T10:30',
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.startTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      })

      it('should handle invalid datetime strings gracefully', () => {
        const mockModel: DatabaseModel = {
          name: 'Event',
          fields: [{ name: 'startTime', type: 'DateTime', isOptional: false }],
        }

        const input = {
          startTime: 'invalid-date',
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.startTime).toBe('invalid-date')
      })

      it('should keep invalid existing date values empty in update fields', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
        const mockModel: DatabaseModel = {
          name: 'Event',
          fields: [{ name: 'eventDate', type: 'Date', isOptional: true }],
        }

        const result = buildFormFields({}, mockModel, 'update', {
          currentItem: { eventDate: 'not-a-date' },
        })

        expect(result[0].options?.value).toBe('')
        expect(consoleError).toHaveBeenCalled()
      })
    })

    describe('boolean field handling', () => {
      it('should convert undefined to false for boolean fields', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'isActive', type: 'Boolean', isOptional: false }],
        }

        const input = {
          name: 'John',
          isActive: undefined,
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.isActive).toBe(false)
      })

      it('should preserve true values for boolean fields', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'isActive', type: 'Boolean', isOptional: false }],
        }

        const input = {
          isActive: true,
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.isActive).toBe(true)
      })

      it('should preserve false values for boolean fields', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [{ name: 'isActive', type: 'Boolean', isOptional: false }],
        }

        const input = {
          isActive: false,
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.isActive).toBe(false)
      })
    })

    describe('searchSelectApollo option handling', () => {
      it('should extract value from searchSelectApollo option objects', () => {
        const input = {
          authorId: { value: 'user-123', label: 'John Doe' },
        }

        const result = cleanFormInput(input)

        expect(result.authorId).toBe('user-123')
      })

      it('should handle regular objects that are not searchSelectApollo options', () => {
        const input = {
          metadata: { key: 'value', count: 5 },
        }

        const result = cleanFormInput(input)

        expect(result.metadata).toEqual({ key: 'value', count: 5 })
      })
    })

    describe('nested object processing', () => {
      it('should clean nested objects recursively', () => {
        const input = {
          name: 'John',
          address: {
            street: '123 Main St',
            __typename: 'Address',
            id: '456',
          },
        }

        const result = cleanFormInput(input)

        expect(result.address).toEqual({ street: '123 Main St' })
      })

      it('should remove empty nested objects', () => {
        const input = {
          name: 'John',
          metadata: {
            __typename: 'Metadata',
            id: '123',
          },
        }

        const result = cleanFormInput(input)

        expect(result.metadata).toBeUndefined()
      })
    })

    describe('passthrough values', () => {
      it('should pass through numbers as-is', () => {
        const input = {
          age: 30,
          price: 99.99,
        }

        const result = cleanFormInput(input)

        expect(result.age).toBe(30)
        expect(result.price).toBe(99.99)
      })

      it('should pass through booleans as-is', () => {
        const input = {
          isActive: true,
          isVerified: false,
        }

        const result = cleanFormInput(input)

        expect(result.isActive).toBe(true)
        expect(result.isVerified).toBe(false)
      })

      it('should pass through arrays as-is', () => {
        const input = {
          tags: ['tag1', 'tag2', 'tag3'],
        }

        const result = cleanFormInput(input)

        expect(result.tags).toEqual(['tag1', 'tag2', 'tag3'])
      })

      it('should convert undefined/null to empty array for required array fields', () => {
        const mockModel: DatabaseModel = {
          name: 'Schedule',
          fields: [
            { name: 'id', type: 'String', isId: true, isList: false },
            { name: 'daysOfWeek', type: 'DayOfWeek', isList: true, isOptional: false },
          ],
        }
        const input = {
          id: '123',
          daysOfWeek: null,
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.daysOfWeek).toEqual([])
      })

      it('should convert empty string to empty array for required array fields', () => {
        const mockModel: DatabaseModel = {
          name: 'Schedule',
          fields: [
            { name: 'id', type: 'String', isId: true, isList: false },
            { name: 'daysOfWeek', type: 'DayOfWeek', isList: true, isOptional: false },
          ],
        }
        const input = {
          id: '123',
          daysOfWeek: '',
        }

        const result = cleanFormInput(input, mockModel)

        expect(result.daysOfWeek).toEqual([])
      })

      it('should not convert null to empty array for optional array fields', () => {
        const mockModel: DatabaseModel = {
          name: 'Post',
          fields: [
            { name: 'id', type: 'String', isId: true, isList: false },
            { name: 'tags', type: 'String', isList: true, isOptional: true },
          ],
        }
        const input = {
          id: '123',
          tags: null,
        }

        const result = cleanFormInput(input, mockModel)

        // Optional array with null should pass through as null (to clear field)
        expect(result.tags).toBeNull()
      })

      it('should pass through null values for allowed fields', () => {
        const input = {
          name: 'John',
          middleName: null,
        }

        const result = cleanFormInput(input)

        expect(result.middleName).toBeNull()
      })
    })

    describe('complex scenarios', () => {
      it('should handle complex form input with mixed types', () => {
        const mockModel: DatabaseModel = {
          name: 'User',
          fields: [
            { name: 'name', type: 'String', isOptional: false },
            { name: 'age', type: 'Int', isOptional: true },
            { name: 'isActive', type: 'Boolean', isOptional: false },
          ],
        }

        const input = {
          name: 'John Doe',
          age: '30',
          email: '',
          isActive: 'true',
          __typename: 'User',
          id: '123',
          createdAt: new Date(),
        }

        const result = cleanFormInput(input, mockModel)

        expect(result).toEqual({
          name: 'John Doe',
          age: 30,
          email: null,
          isActive: true,
        })
      })

      it('should handle form with relation fields', () => {
        const input = {
          title: 'My Post',
          content: 'Post content',
          authorId: { value: 'user-123', label: 'John Doe' },
          __typename: 'Post',
        }

        const result = cleanFormInput(input)

        expect(result).toEqual({
          title: 'My Post',
          content: 'Post content',
          authorId: 'user-123',
        })
      })

      it('should split comma-delimited enum array values and drop empty entries', () => {
        const mockModel: DatabaseModel = {
          name: 'Schedule',
          fields: [{ name: 'days', type: 'DayOfWeek', kind: 'enum', isList: true }],
        }

        expect(cleanFormInput({ days: 'MONDAY,,TUESDAY,' }, mockModel)).toEqual({
          days: ['MONDAY', 'TUESDAY'],
        })
      })

      it('should use an empty array for non-array enum list values', () => {
        const mockModel: DatabaseModel = {
          name: 'Schedule',
          fields: [{ name: 'days', type: 'DayOfWeek', kind: 'enum', isList: true }],
        }

        expect(cleanFormInput({ days: 1 }, mockModel)).toEqual({ days: [] })
      })
    })
  })
})
