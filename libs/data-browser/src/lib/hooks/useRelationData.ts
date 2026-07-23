import { useQuery } from '@apollo/client/react'
import { useMemo } from 'react'
import { useAdminDataContext } from '../context/AdminDataContext'
import { getAdminDocuments } from '../utils/graphql-utils'
import { getSmartSearchFields } from '../utils/string-utils'
import { useDebounce } from './useDebounce'

type RelationField = {
  name: string
  type: string
  relationName?: string | null
}

type RelationModel = {
  name: string
  fields: RelationField[]
  pluralModelPropertyName?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isRelationField(value: unknown): value is RelationField {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.type === 'string' &&
    (value.relationName === undefined ||
      value.relationName === null ||
      typeof value.relationName === 'string')
  )
}

function isRelationModel(value: unknown): value is RelationModel {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    Array.isArray(value.fields) &&
    value.fields.every(isRelationField)
  )
}

// Custom hook for relation data fetching and management
export function useRelationData(
  relatedModelName: string,
  searchTerm: string,
  isOpen: boolean,
  currentValueId?: string,
) {
  const { sdk, databaseModels } = useAdminDataContext()
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Get the related model and its GraphQL documents
  const relatedModel = useMemo(
    () =>
      databaseModels.find(
        (modelCandidate: unknown): modelCandidate is RelationModel =>
          isRelationModel(modelCandidate) && modelCandidate.name === relatedModelName,
      ),
    [databaseModels, relatedModelName],
  )

  const relatedDocuments = useMemo(
    () => (relatedModel ? getAdminDocuments(sdk, relatedModel) : { listQuery: undefined }),
    [sdk, relatedModel],
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
      .filter(f => {
        const fieldType = f.type.toLowerCase()
        return (
          !f.relationName &&
          (fieldType === 'string' || fieldType.includes('text') || fieldType === 'boolean')
        )
      })
      .map(f => f.name)
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
    // Don't skip if we have a currentValueId to display, even if dropdown is closed
    skip: !relatedDocuments.listQuery || (!isOpen && !currentValueId),
    errorPolicy: 'all', // Continue processing even if there are GraphQL errors
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-first', // Use cache for better performance
  })

  // Validate and sanitize relation data
  const relatedItems = useMemo(() => {
    if (relationError) {
      return []
    }

    if (!relatedData) return []

    try {
      const items = isRecord(relatedData) ? relatedData[relatedDataPath] || [] : []

      // Validate that items is an array
      if (!Array.isArray(items)) {
        return []
      }

      // Validate each item has required properties
      return items.filter(
        (item): item is Record<string, unknown> => isRecord(item) && Boolean(item.id),
      )
    } catch (error) {
      console.error('Unexpected error:', error)
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
