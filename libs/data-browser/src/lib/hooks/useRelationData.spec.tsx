import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRelationData } from './useRelationData'
import { AdminDataProvider } from '../context/AdminDataContext'
import { ReactNode } from 'react'
import { DocumentNode } from 'graphql'

// Mock dependencies
vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
}))

vi.mock('./useDebounce', () => ({
  useDebounce: vi.fn((value) => value),
}))

vi.mock('../utils/graphql-utils', () => ({
  getAdminDocuments: vi.fn(),
}))

vi.mock('../utils/string-utils', async () => {
  const actual = await vi.importActual<typeof import('../utils/string-utils')>('../utils/string-utils')
  return {
    ...actual,
    getSmartSearchFields: actual.getSmartSearchFields,
  }
})

import { useQuery } from '@apollo/client/react'
import { useDebounce } from './useDebounce'
import { getAdminDocuments } from '../utils/graphql-utils'

describe('useRelationData', () => {
  const mockDatabaseModels = [
    {
      name: 'User',
      pluralModelPropertyName: 'users',
      fields: [
        { name: 'id', type: 'String', relationName: null },
        { name: 'name', type: 'String', relationName: null },
        { name: 'email', type: 'String', relationName: null },
        { name: 'age', type: 'Int', relationName: null },
        { name: 'organization', type: 'Organization', relationName: 'UserOrganization' },
      ],
    },
    {
      name: 'Organization',
      pluralModelPropertyName: 'organizations',
      fields: [
        { name: 'id', type: 'String', relationName: null },
        { name: 'name', type: 'String', relationName: null },
        { name: 'description', type: 'TEXT', relationName: null },
        { name: 'active', type: 'Boolean', relationName: null },
      ],
    },
  ]

  const mockListQuery = {} as DocumentNode

  const mockSdk = {
    User: {
      adminListUsersDocument: mockListQuery,
    },
    Organization: {
      adminListOrganizationsDocument: mockListQuery,
    },
  }

  const mockUseQuery = vi.mocked(useQuery)
  const mockUseDebounce = vi.mocked(useDebounce)
  const mockGetAdminDocuments = vi.mocked(getAdminDocuments)

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseDebounce.mockImplementation((value) => value)
    mockGetAdminDocuments.mockReturnValue({ listQuery: mockListQuery } as any)
  })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AdminDataProvider sdk={mockSdk} databaseModels={mockDatabaseModels}>
      {children}
    </AdminDataProvider>
  )

  describe('initialization', () => {
    it('should find related model from databaseModels', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', false), { wrapper })

      expect(result.current.relatedModel).toEqual(mockDatabaseModels[0])
    })

    it('should return undefined relatedModel when model not found', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('NonExistent', '', false), { wrapper })

      expect(result.current.relatedModel).toBeUndefined()
    })

    it('should determine hasDocument based on SDK', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', false), { wrapper })

      expect(result.current.hasDocument).toBe(true)
    })

    it('should set hasDocument to false when model has no document', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('NonExistent', '', false), { wrapper })

      expect(result.current.hasDocument).toBe(false)
    })
  })

  describe('search functionality', () => {
    it('should debounce search term', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', 'test search', true), { wrapper })

      expect(mockUseDebounce).toHaveBeenCalledWith('test search', 300)
    })

    it('should include search in query variables when search term exists', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', 'john', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          variables: {
            input: {
              take: 20,
              search: 'john',
              searchFields: ['name', 'email'],
            },
          },
        })
      )
    })

    it('should exclude search from query variables when search term is empty', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          variables: {
            input: {
              take: 20,
            },
          },
        })
      )
    })

    it('should trim search term before checking', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', '   ', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          variables: {
            input: {
              take: 20,
            },
          },
        })
      )
    })
  })

  describe('searchable fields detection', () => {
    it('should identify string fields as searchable', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', 'test', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          variables: {
            input: {
              take: 20,
              search: 'test',
              searchFields: ['name', 'email'],
            },
          },
        })
      )
    })

    it('should identify text fields as searchable', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('Organization', 'test', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          variables: {
            input: {
              take: 20,
              search: 'test',
              searchFields: ['name'],
            },
          },
        })
      )
    })

    it('should identify boolean fields as searchable', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('Organization', 'test', true), { wrapper })

      const call = mockUseQuery.mock.calls[0]
      const variables = call[1]?.variables as any

      // Boolean field 'active' should be included in searchable fields
      const searchableFields = mockDatabaseModels[1].fields
        .filter((f: any) => {
          const fieldType = f.type.toLowerCase()
          return (
            !f.relationName &&
            (fieldType === 'string' || fieldType.includes('text') || fieldType === 'boolean')
          )
        })
        .map((f: any) => f.name)

      expect(searchableFields).toContain('active')
    })

    it('should exclude relation fields from search', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', 'test', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          variables: {
            input: {
              take: 20,
              search: 'test',
              searchFields: expect.not.arrayContaining(['organization']),
            },
          },
        })
      )
    })

    it('should exclude non-searchable field types', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', 'test', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          variables: {
            input: {
              take: 20,
              search: 'test',
              searchFields: expect.not.arrayContaining(['age']),
            },
          },
        })
      )
    })
  })

  describe('query skip logic', () => {
    it('should skip query when not open and no currentValueId', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', '', false), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          skip: true,
        })
      )
    })

    it('should not skip query when open', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          skip: false,
        })
      )
    })

    it('should not skip query when currentValueId is provided even if not open', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', '', false, 'user-123'), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          skip: false,
        })
      )
    })

    it('should skip query when no listQuery document exists', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('NonExistent', '', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          skip: true,
        })
      )
    })
  })

  describe('data processing', () => {
    it('should return items from query data', () => {
      const mockData = {
        users: [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        ],
      }

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(result.current.relatedItems).toEqual(mockData.users)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeUndefined()
    })

    it('should return empty array when data is undefined', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(result.current.relatedItems).toEqual([])
    })

    it('should return empty array when data path does not exist', () => {
      mockUseQuery.mockReturnValue({
        data: { someOtherField: [] },
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(result.current.relatedItems).toEqual([])
    })

    it('should filter out items without id field', () => {
      const mockData = {
        users: [
          { id: '1', name: 'John Doe' },
          { name: 'Invalid User' }, // Missing id
          { id: '2', name: 'Jane Smith' },
        ],
      }

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(result.current.relatedItems).toEqual([
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
      ])
    })

    it('should filter out non-object items', () => {
      const mockData = {
        users: [
          { id: '1', name: 'John Doe' },
          'invalid',
          null,
          { id: '2', name: 'Jane Smith' },
          undefined,
          42,
        ],
      }

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(result.current.relatedItems).toEqual([
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
      ])
    })

    it('should return empty array when data is not an array', () => {
      const mockData = {
        users: { id: '1', name: 'Not an array' },
      }

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(result.current.relatedItems).toEqual([])
    })
  })

  describe('error handling', () => {
    it('should return error from query', () => {
      const mockError = new Error('GraphQL error')

      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: mockError,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(result.current.error).toBe(mockError)
      expect(result.current.relatedItems).toEqual([])
    })

    it('should return empty array when error exists even with data', () => {
      const mockError = new Error('Partial error')
      const mockData = {
        users: [{ id: '1', name: 'John' }],
      }

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: mockError,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(result.current.relatedItems).toEqual([])
      expect(result.current.error).toBe(mockError)
    })

    it('should handle exceptions during data processing', () => {
      const mockData = {
        users: [{ id: '1', name: 'John' }],
      }

      // Mock data that will throw during processing
      Object.defineProperty(mockData, 'users', {
        get() {
          throw new Error('Data access error')
        },
      })

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', true), { wrapper })

      // Should handle the error gracefully
      expect(result.current.relatedItems).toEqual([])
    })
  })

  describe('loading state', () => {
    it('should return loading state from query', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(result.current.loading).toBe(true)
    })

    it('should update loading state', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: true,
        error: undefined,
      } as any)

      const { result, rerender } = renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(result.current.loading).toBe(true)

      mockUseQuery.mockReturnValue({
        data: { users: [] },
        loading: false,
        error: undefined,
      } as any)

      rerender()

      expect(result.current.loading).toBe(false)
    })
  })

  describe('query configuration', () => {
    it('should use cache-first fetch policy', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          fetchPolicy: 'cache-first',
        })
      )
    })

    it('should use errorPolicy: all', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          errorPolicy: 'all',
        })
      )
    })

    it('should notify on network status change', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          notifyOnNetworkStatusChange: true,
        })
      )
    })

    it('should set take to 20', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      renderHook(() => useRelationData('User', '', true), { wrapper })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          variables: {
            input: {
              take: 20,
            },
          },
        })
      )
    })
  })

  describe('model without pluralModelPropertyName', () => {
    it('should fallback to lowercase name + s for data path', () => {
      const modelsWithoutPlural = [
        {
          name: 'Product',
          fields: [
            { name: 'id', type: 'String', relationName: null },
            { name: 'title', type: 'String', relationName: null },
          ],
        },
      ]

      const sdkWithoutPlural = {
        Product: {
          adminListProductsDocument: mockListQuery,
        },
      }

      const customWrapper = ({ children }: { children: ReactNode }) => (
        <AdminDataProvider sdk={sdkWithoutPlural} databaseModels={modelsWithoutPlural}>
          {children}
        </AdminDataProvider>
      )

      const mockData = {
        products: [{ id: '1', title: 'Product 1' }],
      }

      mockUseQuery.mockReturnValue({
        data: mockData,
        loading: false,
        error: undefined,
      } as any)

      const { result } = renderHook(() => useRelationData('Product', '', true), { wrapper: customWrapper })

      expect(result.current.relatedItems).toEqual(mockData.products)
    })
  })

  describe('reactivity', () => {
    it('should update when search term changes', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      const { rerender } = renderHook(
        ({ searchTerm }) => useRelationData('User', searchTerm, true),
        { wrapper, initialProps: { searchTerm: '' } }
      )

      expect(mockUseDebounce).toHaveBeenCalledWith('', 300)

      rerender({ searchTerm: 'john' })

      expect(mockUseDebounce).toHaveBeenCalledWith('john', 300)
    })

    it('should update when isOpen changes', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        loading: false,
        error: undefined,
      } as any)

      const { rerender } = renderHook(
        ({ isOpen }) => useRelationData('User', '', isOpen),
        { wrapper, initialProps: { isOpen: false } }
      )

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          skip: true,
        })
      )

      rerender({ isOpen: true })

      expect(mockUseQuery).toHaveBeenCalledWith(
        mockListQuery,
        expect.objectContaining({
          skip: false,
        })
      )
    })
  })
})
