/// <reference types='vitest' />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import * as path from 'path'
import { copyFileSync } from 'node:fs'
import { attachExtractedCssImport } from './build-css-import.mts'

function retainExtractedCssImport(): Plugin {
  return {
    name: 'retain-extracted-css-import',
    enforce: 'post',
    generateBundle(_options, bundle) {
      attachExtractedCssImport(bundle)
    },
  }
}

function rejectDevelopmentJsx(): Plugin {
  return {
    name: 'reject-development-jsx',
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type === 'chunk' && output.code.includes('jsxDEV')) {
          this.error('The access-control package must not contain the development JSX runtime.')
        }
      }
    },
  }
}

// The package is published from the build output, so it needs package.json there, plus
// README.md and LICENSE (package.json `files`). Nx 24 removed nxCopyAssetsPlugin, which
// copied the last two, so this copies all three into the build output instead.
function copyPackageFiles(files: string[]): Plugin {
  let outDir = ''
  return {
    name: 'copy-package-files',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    writeBundle() {
      for (const file of files) {
        copyFileSync(path.join(import.meta.dirname, file), path.join(outDir, file))
      }
    },
  }
}

export default defineConfig(() => ({
  resolve: {
    tsconfigPaths: true,
  },
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/access-control',
  plugins: [
    react({ jsxRuntime: 'automatic' }),
    rejectDevelopmentJsx(),
    retainExtractedCssImport(),
    copyPackageFiles(['README.md', 'LICENSE', 'package.json']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    outDir: '../../dist/libs/access-control',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'access-control',
      fileName: 'index',
      cssFileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es' as const],
    },
    rolldownOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
  },
  test: {
    name: 'access-control',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: [
      'vite.config.spec.mts',
      '{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/access-control',
      provider: 'v8' as const,
    },
  },
}))
