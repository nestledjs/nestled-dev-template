import pluralize from 'pluralize'

/**
 * List of uncountable nouns that the pluralize library incorrectly pluralizes.
 * These words should remain the same in plural form, so we append "List" instead.
 */
const UNCOUNTABLE_OVERRIDES = new Set([
  'advice',
  'anger',
  'art',
  'beauty',
  'courage',
  'evidence',
  'feedback',
  'furniture',
  'happiness',
  'hardware',
  'homework',
  'housework',
  'knowledge',
  'love',
  'luggage',
  'music',
  'news',
  'progress',
  'research',
  'software',
  'traffic',
  'weather',
  'wisdom'
])

/**
 * Pluralizes a word using the pluralize library, with special handling for words
 * where the singular and plural forms are the same (like "data", "sheep").
 * In those cases, appends "List" to make it clear it's a collection.
 * Also includes overrides for known uncountable nouns that the pluralize library
 * incorrectly pluralizes.
 *
 * @param name - The word to pluralize
 * @returns The pluralized form, or the word + "List" if singular equals plural or is uncountable
 *
 * @example
 * ```typescript
 * getPluralName('user')     // 'users'
 * getPluralName('category') // 'categories'
 * getPluralName('data')     // 'dataList' (because 'data' plural is also 'data')
 * getPluralName('sheep')    // 'sheepList' (because 'sheep' plural is also 'sheep')
 * getPluralName('luggage')  // 'luggageList' (override: pluralize incorrectly returns 'luggages')
 * getPluralName('furniture') // 'furnitureList' (override: pluralize incorrectly returns 'furnitures')
 * ```
 */
export function getPluralName(name: string): string {
  if (!name || typeof name !== 'string') {
    throw new Error(
      `getPluralName: name must be a non-empty string, received type: ${typeof name}, value: ${String(name)}`
    )
  }

  // Check if this is a known uncountable noun that pluralize incorrectly handles
  if (UNCOUNTABLE_OVERRIDES.has(name.toLowerCase())) {
    return name + 'List'
  }

  const plural = pluralize(name)
  return plural === name ? name + 'List' : plural
}
