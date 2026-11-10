import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    dts({
      outDir: resolve(import.meta.dirname, '../../dist/libs/shared-components'),
      entryRoot: resolve(import.meta.dirname, 'src'),
      tsconfigPath: resolve(import.meta.dirname, './tsconfig.lib.json'),
    }),
  ],
  mode: 'production',
  resolve: {
    alias: {
      // The workspace alias must RESOLVE here so rollup can inline it. Consumers install this
      // package from npm and have no such path, so anything left as a bare specifier is an
      // unresolvable import in every downstream repo.
      '@nestled-template/shared/utils': resolve(
        import.meta.dirname,
        '../shared/utils/src/index.ts',
      ),
    },
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rolldownOptions: {
      external: id => {
        // Workspace code is BUNDLED, never externalized: `@nestled-template/*` is a tsconfig
        // path that exists only in this repo. Externalizing it published
        // `import ... from '@nestled-template/shared/utils'` into 1.0.16 and broke every
        // consumer at module load. Relative and absolute ids are bundled as before.
        if (id.startsWith('@nestled-template/')) return false
        // Externalize all other non-relative imports (node_modules)
        return !id.startsWith('.') && !id.startsWith('/')
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: resolve(import.meta.dirname, 'src'),
        entryFileNames: '[name].js',
      },
    },
    outDir: resolve(import.meta.dirname, '../../dist/libs/shared-components'),
    emptyOutDir: true,
  },
})
