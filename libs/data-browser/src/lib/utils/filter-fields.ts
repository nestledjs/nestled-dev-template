import { isListValuedColumn, type FilterModel, type FilterModelField } from './filter-input'

/**
 * Which fields the list page's filter panel offers, and which URL parameters it turns into
 * filter state.
 *
 * A filter is only worth offering if the API's generated `<Model>FilterInput` has a field for it.
 * The generator models scalars, enums and relations, but not list-valued scalar or enum columns
 * (`String[]`, `Role[]`): Prisma filters those with `has` / `hasSome` / `hasEvery`, which the
 * generated inputs do not declare. Offering one, or reading one from the URL, would put a key in
 * the list query's variables that GraphQL rejects, and the list would not load.
 */

const FILTERABLE_SCALAR_TYPES = new Set(['boolean', 'int', 'float', 'date', 'datetime'])
const UNFILTERED_FIELD_NAMES = new Set(['id', 'createdAt', 'updatedAt'])
const NON_FILTER_URL_PARAMS = new Set(['page', 'search', 'sort'])

const isRelation = (field: FilterModelField) => Boolean(field.relationName)
const isToOneRelation = (field: FilterModelField) => isRelation(field) && !field.isList

function isDirectFilterField(field: FilterModelField): boolean {
  if (isToOneRelation(field)) return true
  if (isRelation(field) || field.isList) return false
  if (UNFILTERED_FIELD_NAMES.has(field.name)) return false
  // Text fields are left to search.
  return FILTERABLE_SCALAR_TYPES.has(field.type.toLowerCase()) || field.kind === 'enum'
}

/**
 * The filter panel's fields: the model's filterable scalars and enums, its to-one relations, and
 * each to-one relation's single-valued enums as `relation.enumField`.
 */
export function getFilterableFieldNames(
  model: FilterModel | undefined,
  databaseModels: readonly FilterModel[],
): string[] {
  if (!model) return []

  const directFields = model.fields.filter(isDirectFilterField).map(field => field.name)

  const relatedEnumFields: string[] = []
  for (const field of model.fields.filter(isToOneRelation)) {
    const relatedModel = databaseModels.find(candidate => candidate.name === field.type)
    for (const relatedField of relatedModel?.fields ?? []) {
      if (relatedField.kind === 'enum' && !relatedField.isList) {
        relatedEnumFields.push(`${field.name}.${relatedField.name}`)
      }
    }
  }

  return [...directFields, ...relatedEnumFields]
}

/**
 * Filter state from the URL, e.g. `?userId=abc-123`. A foreign-key parameter is mapped onto its
 * relation (`{ user: { id: 'abc-123' } }`) for the filter controls; a parameter naming one of the
 * model's own scalar or enum columns is kept as-is. Anything else (unknown names, list-valued
 * columns) is dropped.
 */
export function parseUrlFilters(
  model: FilterModel | undefined,
  searchParams: Iterable<[string, string]>,
): Record<string, unknown> {
  if (!model) return {}

  const filters: Record<string, unknown> = {}
  for (const [key, value] of searchParams) {
    if (NON_FILTER_URL_PARAMS.has(key)) continue

    const relationField = model.fields.find(
      field => isToOneRelation(field) && field.relationFromFields?.[0] === key,
    )
    if (relationField) {
      filters[relationField.name] = { id: value }
      continue
    }

    const column = model.fields.find(field => field.name === key && !isRelation(field))
    if (column && !isListValuedColumn(column)) filters[key] = value
  }
  return filters
}
