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
    rules: {
      // vite.config.ts bundles @nestled-template/* workspace code into the published package
      // instead of externalizing it, so depending on a non-buildable library is intended here.
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: false,
          allowCircularSelfDependency: true,
          allow: [String.raw`^.*/eslint(\.base)?\.config\.[cm]?[jt]s$`],
          depConstraints: [{ sourceTag: '*', onlyDependOnLibsWithTags: ['*'] }],
        },
      ],
    },
  },
]
