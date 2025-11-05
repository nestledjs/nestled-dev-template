import { useQuery } from '@apollo/client/react'
import { DATABASE_MODELS } from '@biztobiz/shared/sdk'
import { useMemo } from 'react'
import { getAdminDocuments } from '../utils/graphql-utils'
import { getSmartSearchFields } from '../utils/string-utils'
import { useDebounce } from './useDebounce' // Custom hook for relation data fetching and management

// Custom hook for relation data fetching and management
export function useRelationData(relatedModelName: string, searchTerm: string, isOpen: boolean) {
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Get the related model and its GraphQL documents
  const relatedModel = useMemo(
    () => DATABASE_MODELS.find((m: any) => m.name === relatedModelName),
    [relatedModelName],
  )

  const relatedDocuments = useMemo(
    () => (relatedModel ? getAdminDocuments(relatedModel) : { listQuery: undefined }),
    [relatedModel],
  )

  const relatedDataPath = useMemo(
    () =>
      relatedModel?.pluralModelPropertyName ||
      relatedModelName.charAt(0).toLowerCase() + relatedModelName.slice(1) + 's',
    [relatedModel, relatedModelName],
  )

  // Get searchable fields for the related model
  const searchableFields = useMemo(() => {
    if (!relatedModel) return []

    return relatedModel.fields
      .filter((f: any) => {
        const fieldType = f.type.toLowerCase()
        return (
          !f.relationName &&
          (fieldType === 'string' || fieldType.includes('text') || fieldType === 'boolean')
        )
      })
      .map((f: any) => f.name)
  }, [relatedModel])

  const searchFields = useMemo(() => getSmartSearchFields(searchableFields), [searchableFields])

  // Query variables for relation search
  const queryVariables = useMemo(
    () => ({
      input: {
        take: 20,
        ...(debouncedSearchTerm.trim()
          ? {
              search: debouncedSearchTerm,
              searchFields: searchFields.length > 0 ? searchFields : undefined,
            }
          : {}),
      },
    }),
    [debouncedSearchTerm, searchFields],
  )

  // Query for related items with comprehensive error handling
  const {
    data: relatedData,
    loading,
    error: relationError,
  } = useQuery(relatedDocuments.listQuery, {
    variables: queryVariables,
    skip: !relatedDocuments.listQuery || !isOpen,
    errorPolicy: 'all', // Continue processing even if there are GraphQL errors
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-first', // Use cache for better performance
  })

  // Validate and sanitize relation data
  const relatedItems = useMemo(() => {
    if (relationError) {
      console.warn('[RelationData] GraphQL error:', relationError.message)
      return []
    }

    if (!relatedData) return []

    try {
      const items = relatedData[relatedDataPath] || []

      // Validate that items is an array
      if (!Array.isArray(items)) {
        console.warn('[RelationData] Expected array but got:', typeof items)
        return []
      }

      // Validate each item has required properties
      return items.filter(item => {
        if (!item || typeof item !== 'object') return false
        if (!item.id) return false // Require ID field
        return true
      })
    } catch (error) {
      console.error('[RelationData] Error processing relation data:', error)
      return []
    }
  }, [relatedData, relatedDataPath, relationError])

  return {
    relatedModel,
    relatedItems,
    loading,
    error: relationError,
    hasDocument: !!relatedDocuments.listQuery,
  }
}
