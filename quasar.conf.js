// Configuration for your app

// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// const TSCONFIG = __dirname + '/tsconfig.json';
// 我用这个ForkTsCheckerWebpackPlugin是因为可以增加nodejs的使用内存，避免堆栈溢出。
// 当然它的另外优点是分线程同时处理tslint和compile.
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const useForkTsChecker = true

function extendTypescriptToWebpack(cfg) {
  // cfg.resolve.plugins = [
  //   // ts paths mapper for webpack
  //   new TsconfigPathsPlugin({ configFile: TSCONFIG })
  // ]
  // added the type-script supports
  cfg.resolve.extensions.push('.ts')
  cfg.resolve.extensions.push('.tsx')
  cfg.module.rules.push({
    test: /\.ts$/,
    loader: 'ts-loader',
    exclude: /node_modules/,
    options: {
      // tsconfig: TSCONFIG,
      // configFile: TSCONFIG,
      appendTsSuffixTo: [/\.vue$/],
      onlyCompileBundledFiles: !useForkTsChecker,
      // Type checking is handled by fork-ts-checker-webpack-plugin
      transpileOnly: useForkTsChecker,
  }
  })
  cfg.module.rules.push({
    test: /\.tsx$/,
    exclude: /node_modules/,
    use: [
      'babel-loader',
      {
        loader: 'ts-loader',
        options: {
        // tsconfig: TSCONFIG,
        // configFile: TSCONFIG,
        appendTsSuffixTo: [/\.vue$/],
        onlyCompileBundledFiles: !useForkTsChecker,
        // Type checking is handled by fork-ts-checker-webpack-plugin
        transpileOnly: useForkTsChecker,
        }
      }
    ]
  })
  cfg.plugins.push(new ForkTsCheckerWebpackPlugin({
    // tslint: true,
    vue: true
  }))
}

function extendPugToWebpack(cfg) {
  cfg.module.rules.push({
    test: /\.pug$/,
    loader: 'pug-plain-loader'
  })
}

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'roboto-font',
      'material-icons' // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons'
    ],

    // framework: 'all', // --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QInput',
        'QSelect',
        'QDate',
        'QTime',
        'QCard',
        'QCardSection',
        'QPopupProxy',
        'QCardActions',
        'QColor',
        'QAvatar',
        'QBanner',
      ],

      directives: [
        'Ripple',
        'ClosePopup',
      ],

      // Quasar plugins
      plugins: [
        'Notify'
      ]

      // iconSet: 'ionicons-v4'
      // lang: 'de' // Quasar language
    },

    supportIE: false,

    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        extendTypescriptToWebpack(cfg)
        extendPugToWebpack(cfg)
        // cfg.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /node_modules/
        // })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all' --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
    },

    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
