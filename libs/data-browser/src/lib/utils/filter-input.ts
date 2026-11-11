/**
 * Converts the list page's filter state into the typed `<Model>FilterInput` the API accepts.
 *
 * Generated list queries used to take `filters` as an untyped JSON object that reached Prisma's
 * `where` verbatim, so the filter controls stored bare values (`{ isActive: true }`,
 * `{ user: { id: 'u1' } }`) and sent them as-is. The API now declares a typed filter input per
 * model, built from Prisma's operator grammar (`StringFilterInput { equals, contains, in, ... }`,
 * `BooleanFilterInput { equals, in, not }`, enum filter inputs, relation filter inputs that take
 * the related model's fields), so GraphQL rejects bare values and the list never loads.
 *
 * The filter controls and URL parameters keep producing the bare UI shape; this function is the
 * one place that turns it into the operator shape, applied where the list and export query
 * variables are built.
 *
 * It is idempotent: a value already in operator shape (an object whose keys are all filter
 * operators, such as `{ equals }`, `{ contains }` or `{ gte, lte }`) passes through unchanged, so
 * client code that already converts its filters keeps working.
 */

/** Minimal field metadata, as produced by the CRUD generator's `DATABASE_MODELS`. */
export interface FilterModelField {
  name: string
  type: string
  kind?: string
  isList?: boolean
  relationName?: string
  relationFromFields?: string[]
}

export interface FilterModel {
  name: string
  fields: FilterModelField[]
}

export type FilterInput = Record<string, unknown>

/** Every operator key the generated filter inputs (and Prisma's grammar) use. */
const OPERATOR_KEYS = new Set([
  'equals',
  'in',
  'notIn',
  'not',
  'contains',
  'startsWith',
  'endsWith',
  'mode',
  'lt',
  'lte',
  'gt',
  'gte',
  'is',
  'isNot',
  'some',
  'every',
  'none',
  'has',
  'hasSome',
  'hasEvery',
  'isEmpty',
])

const LOGICAL_KEYS = new Set(['AND', 'OR', 'NOT'])

const STRING_TYPES = new Set(['string', 'id'])
const NUMBER_TYPES = new Set(['int', 'float', 'decimal'])
const DATE_TYPES = new Set(['datetime', 'date'])

/**
 * Scalar types the API exposes no filter input for (see the generator's `SCALAR_FILTERS`). Sending
 * one makes GraphQL reject the whole query, so they are dropped instead.
 */
const UNFILTERABLE_TYPES = new Set(['json', 'bytes', 'unsupported'])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (isPlainObject(value)) return Object.keys(value).length === 0
  return false
}

/** True for a non-empty object whose keys are all filter operators: already converted. */
export function isOperatorShape(value: unknown): value is Record<string, unknown> {
  if (!isPlainObject(value)) return false
  const keys = Object.keys(value)
  return keys.length > 0 && keys.every(key => OPERATOR_KEYS.has(key))
}

/** Drops operators whose value is empty, so `{ gte: '2024-01-01', lte: undefined }` stays valid. */
function compactOperators(value: Record<string, unknown>): Record<string, unknown> | undefined {
  const compacted: Record<string, unknown> = {}
  for (const [key, operand] of Object.entries(value)) {
    if (operand !== undefined && operand !== null && operand !== '') compacted[key] = operand
  }
  return Object.keys(compacted).length > 0 ? compacted : undefined
}

function isRelationField(field: FilterModelField): boolean {
  return Boolean(field.relationName) || field.kind === 'object'
}

function coerceBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

function coerceNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

/** Coerces one bare value to the scalar type of `field`; `undefined` means it cannot be sent. */
function coerceScalar(field: FilterModelField | undefined, value: unknown): unknown {
  const type = field?.type?.toLowerCase() ?? 'string'
  if (type === 'boolean') return coerceBoolean(value)
  if (NUMBER_TYPES.has(type)) return coerceNumber(value)
  if (type === 'bigint') return typeof value === 'bigint' ? value.toString() : value
  return typeof value === 'object' ? undefined : value
}

/** Exact-match filter for one bare value (or `in` for a list of them). */
function equalsFilter(field: FilterModelField | undefined, value: unknown): unknown {
  if (Array.isArray(value)) {
    const values = value.map(item => coerceScalar(field, item)).filter(item => item !== undefined)
    return values.length > 0 ? { in: values } : undefined
  }
  const coerced = coerceScalar(field, value)
  return coerced === undefined ? undefined : { equals: coerced }
}

/** Filter for a scalar or enum column on the model being listed. */
function scalarFilter(field: FilterModelField, value: unknown): unknown {
  if (field.isList) return undefined
  const type = field.type.toLowerCase()
  if (UNFILTERABLE_TYPES.has(type)) return undefined
  if (isOperatorShape(value)) return compactOperators(value)
  if (isPlainObject(value)) return undefined

  // Free text: substring match. The generated StringFilterInput has no `mode`, so matching is
  // case-sensitive or not according to the database collation.
  if (field.kind !== 'enum' && STRING_TYPES.has(type) && typeof value === 'string') {
    return { contains: value }
  }
  if (DATE_TYPES.has(type) && typeof value === 'string') return { equals: value }
  return equalsFilter(field, value)
}

/** The scalar foreign key backing a to-one relation, when it is a single filterable column. */
function foreignKeyFor(
  model: FilterModel,
  relation: FilterModelField,
): FilterModelField | undefined {
  const fromFields = relation.relationFromFields ?? []
  if (fromFields.length !== 1) return undefined
  return model.fields.find(field => field.name === fromFields[0] && !isRelationField(field))
}

/** Filter for one field of a related model, used inside a to-one relation filter. */
function relatedFieldFilter(relatedField: FilterModelField | undefined, value: unknown): unknown {
  if (isOperatorShape(value)) return compactOperators(value)
  if (isPlainObject(value)) return undefined
  // Values selected from a related model's list (an id, an enum value) are exact matches.
  return equalsFilter(relatedField, value)
}

interface RelationFilterParts {
  /** Filter on the scalar foreign key column, e.g. `{ userId: { equals: 'u1' } }`. */
  foreignKey?: { name: string; filter: unknown }
  /** Filter on the relation itself, e.g. `{ status: { equals: 'ACTIVE' } }` under `user`. */
  relation?: Record<string, unknown>
}

/**
 * Splits a to-one relation's UI value into a foreign-key filter (for the selected id) and a
 * relation filter (for fields of the related model, such as a related enum). The foreign key is
 * preferred for the id: it is a plain column on the model's own filter input, so it does not
 * depend on the relation being reachable within the API's filter depth.
 */
function relationFilter(
  model: FilterModel,
  relation: FilterModelField,
  value: unknown,
  relatedModel: FilterModel | undefined,
  occupiedKeys: Set<string>,
): RelationFilterParts {
  const relatedFieldNamed = (name: string) =>
    relatedModel?.fields.find(field => field.name === name)
  const foreignKey = foreignKeyFor(model, relation)
  const canUseForeignKey = foreignKey !== undefined && !occupiedKeys.has(foreignKey.name)

  // A bare id or list of ids, e.g. `{ user: 'u1' }`.
  if (!isPlainObject(value)) {
    if (canUseForeignKey) {
      const filter = equalsFilter(foreignKey, value)
      return filter === undefined ? {} : { foreignKey: { name: foreignKey.name, filter } }
    }
    const filter = equalsFilter(relatedFieldNamed('id'), value)
    return filter === undefined ? {} : { relation: { id: filter } }
  }

  const parts: RelationFilterParts = {}
  const relationEntries: Record<string, unknown> = {}
  for (const [key, entry] of Object.entries(value)) {
    if (isEmptyValue(entry)) continue
    if (key === 'is' || key === 'isNot' || LOGICAL_KEYS.has(key)) {
      relationEntries[key] = entry
      continue
    }
    if (key === 'id' && canUseForeignKey && !isPlainObject(entry)) {
      const filter = equalsFilter(foreignKey, entry)
      if (filter !== undefined) parts.foreignKey = { name: foreignKey.name, filter }
      continue
    }
    const filter = relatedFieldFilter(relatedFieldNamed(key), entry)
    if (filter !== undefined) relationEntries[key] = filter
  }
  if (Object.keys(relationEntries).length > 0) parts.relation = relationEntries
  return parts
}

/**
 * Converts list filter state to the model's typed filter input.
 *
 * | UI value                                   | Sent as                                          |
 * | ------------------------------------------ | ------------------------------------------------ |
 * | text `'ada'`                               | `{ contains: 'ada' }`                            |
 * | boolean `true` / `'true'`                  | `{ equals: true }`                               |
 * | enum `'ACTIVE'`                            | `{ equals: 'ACTIVE' }`                           |
 * | number `5` / `'5'`                         | `{ equals: 5 }`                                  |
 * | range `{ gte, lte }`                       | unchanged (empty bounds dropped)                 |
 * | relation `{ user: { id: 'u1' } }`          | `{ userId: { equals: 'u1' } }`                   |
 * | ...without a single scalar foreign key     | `{ user: { id: { equals: 'u1' } } }`             |
 * | related enum `{ user: { role: 'ADMIN' } }` | `{ user: { role: { equals: 'ADMIN' } } }`        |
 * | already-converted `{ equals: ... }` etc.   | unchanged                                        |
 * | `AND` / `OR` / `NOT`                       | unchanged                                        |
 * | `undefined`, `null`, `''`, `[]`, `{}`      | dropped                                          |
 *
 * Keys that are not fields of `model` pass through unchanged, so an app that adds its own filter
 * keys still gets them validated by the API rather than silently dropped.
 *
 * @returns the filter input, or `undefined` when no filter is active.
 */
export function toFilterInput(
  model: FilterModel | undefined,
  filters: Record<string, unknown> | undefined,
  databaseModels: readonly FilterModel[] = [],
): FilterInput | undefined {
  if (!filters) return undefined

  const result: FilterInput = {}
  // Keys the caller set explicitly win over anything derived, so a relation's id never
  // overwrites a foreign-key filter that was already given in operator shape.
  const occupiedKeys = new Set(Object.keys(filters).filter(key => !isEmptyValue(filters[key])))

  for (const [key, value] of Object.entries(filters)) {
    if (isEmptyValue(value)) continue

    const field = model?.fields.find(candidate => candidate.name === key)

    if (!field || LOGICAL_KEYS.has(key)) {
      result[key] = value
      continue
    }

    if (isRelationField(field)) {
      if (field.isList) {
        // List relations take `{ some, every, none }`; there is no bare UI shape to convert.
        if (isOperatorShape(value)) result[key] = value
        continue
      }
      const relatedModel = databaseModels.find(candidate => candidate.name === field.type)
      const parts = relationFilter(model as FilterModel, field, value, relatedModel, occupiedKeys)
      if (parts.foreignKey) result[parts.foreignKey.name] = parts.foreignKey.filter
      if (parts.relation) result[key] = parts.relation
      continue
    }

    const filter = scalarFilter(field, value)
    if (filter !== undefined) result[key] = filter
  }

  return Object.keys(result).length > 0 ? result : undefined
}
