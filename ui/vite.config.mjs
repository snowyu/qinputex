import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import pkg from './package.json'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

const year = new Date().getFullYear()
const banner = `/*!\n * ${pkg.name} v${pkg.version}\n * (c) ${year} ${pkg.author}\n * Released under the MIT License.\n */`

export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'QInputEx',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'quasar', 'vue-i18n'],
      output: {
        globals: {
          vue: 'Vue',
          quasar: 'Quasar',
          'vue-i18n': 'VueI18n'
        },
        exports: 'named',
        assetFileNames: 'index.css'
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    assetsDir: '',
  },
  define: {
    __UI_VERSION__: JSON.stringify(pkg.version)
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler'
      }
    },
    postcss: {
      plugins: [
        autoprefixer(),
        cssnano({
          preset: ['default', {
            mergeLonghand: false,
            convertValues: false,
            cssDeclarationSorter: false,
            reduceTransforms: false
          }]
        })
      ]
    }
  }
})