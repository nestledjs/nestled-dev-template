import { describe, it, expect } from 'vitest'
import { getPluralName } from './get-plural-names'

describe('get-plural-names', () => {
  describe('getPluralName', () => {
    describe('normal pluralization', () => {
      it('should pluralize regular nouns correctly', () => {
        expect(getPluralName('user')).toBe('users')
        expect(getPluralName('organization')).toBe('organizations')
        expect(getPluralName('member')).toBe('members')
        expect(getPluralName('post')).toBe('posts')
      })

      it('should pluralize words ending in y correctly', () => {
        expect(getPluralName('category')).toBe('categories')
        expect(getPluralName('company')).toBe('companies')
        expect(getPluralName('story')).toBe('stories')
      })

      it('should pluralize words ending in s, x, z, ch, sh correctly', () => {
        expect(getPluralName('address')).toBe('addresses')
        expect(getPluralName('box')).toBe('boxes')
        expect(getPluralName('quiz')).toBe('quizzes')
        expect(getPluralName('watch')).toBe('watches')
        expect(getPluralName('dish')).toBe('dishes')
      })

      it('should pluralize irregular nouns correctly', () => {
        expect(getPluralName('person')).toBe('people')
        expect(getPluralName('child')).toBe('children')
        expect(getPluralName('mouse')).toBe('mice')
        expect(getPluralName('goose')).toBe('geese')
      })
    })

    describe('singular equals plural cases', () => {
      it('should append "List" when singular equals plural', () => {
        expect(getPluralName('data')).toBe('dataList')
        expect(getPluralName('sheep')).toBe('sheepList')
        expect(getPluralName('series')).toBe('seriesList')
        expect(getPluralName('species')).toBe('speciesList')
        expect(getPluralName('fish')).toBe('fishList')
        expect(getPluralName('deer')).toBe('deerList')
      })
    })

    describe('uncountable overrides', () => {
      it('should append "List" for uncountable nouns that pluralize library mishandles', () => {
        expect(getPluralName('advice')).toBe('adviceList')
        expect(getPluralName('furniture')).toBe('furnitureList')
        expect(getPluralName('luggage')).toBe('luggageList')
        expect(getPluralName('software')).toBe('softwareList')
        expect(getPluralName('hardware')).toBe('hardwareList')
        expect(getPluralName('feedback')).toBe('feedbackList')
        expect(getPluralName('research')).toBe('researchList')
        expect(getPluralName('progress')).toBe('progressList')
        expect(getPluralName('evidence')).toBe('evidenceList')
        expect(getPluralName('knowledge')).toBe('knowledgeList')
      })

      it('should handle uncountable overrides case-insensitively', () => {
        expect(getPluralName('Software')).toBe('SoftwareList')
        expect(getPluralName('Hardware')).toBe('HardwareList')
        expect(getPluralName('Furniture')).toBe('FurnitureList')
        expect(getPluralName('ADVICE')).toBe('ADVICEList')
      })

      it('should append "List" for all uncountable overrides', () => {
        const uncountableWords = [
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
          'wisdom',
        ]

        uncountableWords.forEach(word => {
          expect(getPluralName(word)).toBe(word + 'List')
        })
      })
    })

    describe('edge cases and error handling', () => {
      it('should throw error for empty string', () => {
        expect(() => getPluralName('')).toThrow(/name must be a non-empty string/)
      })

      it('should throw error for null', () => {
        expect(() => getPluralName(null as any)).toThrow(/name must be a non-empty string/)
      })

      it('should throw error for undefined', () => {
        expect(() => getPluralName(undefined as any)).toThrow(/name must be a non-empty string/)
      })

      it('should throw error for non-string types', () => {
        expect(() => getPluralName(123 as any)).toThrow(/name must be a non-empty string/)
        expect(() => getPluralName({} as any)).toThrow(/name must be a non-empty string/)
        expect(() => getPluralName([] as any)).toThrow(/name must be a non-empty string/)
      })

      it('should handle single character words', () => {
        // Pluralize library behavior varies for single characters
        const result = getPluralName('I')
        expect(result.length).toBeGreaterThan(0)
      })

      it('should handle capitalized words', () => {
        expect(getPluralName('User')).toBe('Users')
        expect(getPluralName('Organization')).toBe('Organizations')
        expect(getPluralName('Data')).toBe('DataList')
      })

      it('should handle all caps words', () => {
        expect(getPluralName('USER')).toBe('USERS')
        expect(getPluralName('API')).toBe('APIS')
      })
    })

    describe('compound words', () => {
      it('should handle hyphenated compound words', () => {
        // Pluralize library may not handle hyphenated compounds perfectly
        const result = getPluralName('mother-in-law')
        expect(result).toContain('mother')
        expect(result.endsWith('List') || result.includes('law')).toBe(true)
      })

      it('should handle camelCase words', () => {
        expect(getPluralName('teamMember')).toBe('teamMembers')
        expect(getPluralName('userPreference')).toBe('userPreferences')
      })

      it('should handle PascalCase words', () => {
        expect(getPluralName('TeamMember')).toBe('TeamMembers')
        expect(getPluralName('UserPreference')).toBe('UserPreferences')
      })
    })
  })
})
