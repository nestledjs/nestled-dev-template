import nx from '@nx/eslint-plugin'
import baseConfig, { reactHooksV7Pending, reactVersionSettings } from '../../eslint.config.mjs'

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  reactVersionSettings,
  // TEMPORARY: hooks v7 rules as warnings until the owner decides (see the root eslint.config.mjs).
  reactHooksV7Pending,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
]
