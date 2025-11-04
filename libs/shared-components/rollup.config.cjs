const { withNx } = require('@nx/rollup/with-nx')
const url = require('@rollup/plugin-url')
const svg = require('@svgr/rollup')

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: '../../dist/libs/shared-components',
    tsConfig: './tsconfig.lib.json',
    compiler: 'swc',
    external: ['react', 'react-dom', 'react/jsx-runtime', 'react-router', '@heroicons/react/24/outline', 'dayjs', 'json5'],
    format: ['esm', 'cjs'],
    assets: [
      { input: '.', output: '.', glob: 'README.md' },
      { input: '.', output: '.', glob: 'LICENSE' }
    ],
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    plugins: [
      svg({
        svgo: false,
        titleProp: true,
        ref: true,
      }),
      url({
        limit: 10000, // 10kB
      }),
    ],
  },
)
