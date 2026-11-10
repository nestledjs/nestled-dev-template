import nx from '@nx/eslint-plugin'
import baseConfig, { reactHooksRuleLevels, reactVersionSettings } from '../../eslint.config.mjs'

export default [
  ...nx.configs['flat/react'],
  ...baseConfig,
  reactVersionSettings,
  reactHooksRuleLevels,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
]
