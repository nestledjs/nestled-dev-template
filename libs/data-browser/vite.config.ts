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
      outDir: resolve(import.meta.dirname, '../../dist/libs/data-browser'),
      entryRoot: resolve(import.meta.dirname, 'src'),
      tsconfigPath: resolve(import.meta.dirname, './tsconfig.lib.json'),
    }),
  ],
  mode: 'production',
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rolldownOptions: {
      external: id => {
        // Externalize all non-relative imports (node_modules)
        return !id.startsWith('.') && !id.startsWith('/')
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: resolve(import.meta.dirname, 'src'),
        entryFileNames: '[name].js',
      },
    },
    minify: false, // Disable minification to prevent SSR issues
    outDir: resolve(import.meta.dirname, '../../dist/libs/data-browser'),
    emptyOutDir: true,
  },
})
