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
      outDir: resolve(__dirname, '../../dist/libs/data-browser'),
      entryRoot: resolve(__dirname, 'src'),
      tsconfigPath: resolve(__dirname, './tsconfig.lib.json'),
    }),
  ],
  mode: 'production',
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: (id) => {
        // Externalize all non-relative imports (node_modules)
        return !id.startsWith('.') && !id.startsWith('/')
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: resolve(__dirname, 'src'),
        entryFileNames: '[name].js',
      },
    },
    minify: false, // Disable minification to prevent SSR issues
    outDir: resolve(__dirname, '../../dist/libs/data-browser'),
    emptyOutDir: true,
  },
})
