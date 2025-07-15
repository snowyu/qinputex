// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

import { fileURLToPath } from 'url'
import { join } from 'path'

export default function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'register.js',
      'i18n.js'
    ],

    css: [
      'app.sass',
      // '~quasar-ui-qinputex/dist/index.css'
    ],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      config: {},

      components: [
        'QBtn',
        'QIcon',
        'QPopupProxy',
        'QCard',
        'QCardSection',
        'QToolbar',
        'QToolbarTitle',
        'QInput',
        'QSelect',
        'QDate',
        'QTime',
        'QColor',
        'QChip',
      ],

      directives: [
        'ClosePopup',
      ],

      // Quasar plugins
      plugins: []
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'history',
      alias: {
        'quasar-ui-qinputex': join(fileURLToPath(import.meta.url), '../../../ui')
      },

    },

    devServer: {
      // port: 8080,
      open: true, // opens browser window automatically
      fs: {
        allow: [
          join(fileURLToPath(import.meta.url), '../../..'),
          join(fileURLToPath(import.meta.url), '../../node_modules')
        ]
      }
    },

    ssr: {
      middlewares: [
        ctx.prod ? 'compression' : '',
        'render' // keep this as last one
      ]
    }
  }
}
