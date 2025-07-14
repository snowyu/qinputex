/**
 * Build config for QInputEx library
 * Supports both UMD and ES Module builds
 */

import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// External dependencies that shouldn't be bundled
const external = [
  'vue',
  'quasar',
  'vue-i18n',
  '@vue/compiler-sfc',
  '@vue/shared'
]

// Globals for UMD build
const globals = {
  vue: 'Vue',
  quasar: 'Quasar',
  'vue-i18n': 'VueI18n'
}

async function buildLibrary() {
  // ESM build
  await build({
    root,
    build: {
      lib: {
        entry: resolve(root, 'src/components/qinputex/index.ts'),
        name: 'QInputEx',
        formats: ['es']
      },
      outDir: resolve(root, 'dist'),
      emptyOutDir: false,
      rollupOptions: {
        external,
        output: {
          entryFileNames: 'qinputex.esm.js',
          assetFileNames: 'qinputex.[ext]'
        }
      }
    },
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      quasar({
        autoImportComponentCase: 'pascal'
      })
    ],
    resolve: {
      alias: {
        '@': resolve(root, 'src')
      }
    }
  })

  // UMD build
  await build({
    root,
    build: {
      lib: {
        entry: resolve(root, 'src/components/qinputex/index.ts'),
        name: 'QInputEx',
        formats: ['umd']
      },
      outDir: resolve(root, 'dist'),
      emptyOutDir: false,
      rollupOptions: {
        external,
        output: {
          entryFileNames: 'qinputex.umd.js',
          globals
        }
      }
    },
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      quasar({
        autoImportComponentCase: 'pascal'
      })
    ],
    resolve: {
      alias: {
        '@': resolve(root, 'src')
      }
    }
  })

  console.log('✅ Library build complete!')
}

// Run build
buildLibrary().catch(err => {
  console.error('Build failed:', err)
  process.exit(1)
})