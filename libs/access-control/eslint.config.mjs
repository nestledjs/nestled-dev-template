import nx from '@nx/eslint-plugin'
import baseConfig, {
  reactHooksRuleLevels,
  reactVersionSettings,
  unusedVarsRule,
} from '../../eslint.config.mjs'

export default [
  ...nx.configs['flat/react'],
  ...baseConfig,
  reactVersionSettings,
  reactHooksRuleLevels,
  unusedVarsRule,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
]
