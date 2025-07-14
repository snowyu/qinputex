/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

export default function (api) {
  // Quasar compatibility check
  api.compatibleWith('quasar', '^2.0.0')
  api.compatibleWith('@quasar/app-vite', '^1.0.0 || ^2.0.0')
  api.compatibleWith('@quasar/app-webpack', '^3.0.0 || ^4.0.0')

  // Register boot file
  api.extendQuasarConf((conf, api) => {
    // Make sure qinputex boot file is registered
    const bootFile = '~quasar-app-extension-qinputex/src/boot/register.js'
    if (!conf.boot.includes(bootFile)) {
      conf.boot.push(bootFile)
    }

    // Add qinputex transpile
    conf.build = conf.build || {}
    conf.build.transpileDependencies = conf.build.transpileDependencies || []
    
    const transpileTargets = ['qinputex', 'quasar-app-extension-qinputex']
    transpileTargets.forEach(target => {
      if (!conf.build.transpileDependencies.some(dep => 
        dep instanceof RegExp ? dep.test(target) : dep === target
      )) {
        conf.build.transpileDependencies.push(target)
      }
    })

    // Ensure required Quasar components are included
    if (api.hasVite !== true && conf.framework && conf.framework.components) {
      const requiredComponents = [
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
        'QChip'
      ]
      
      requiredComponents.forEach(component => {
        if (!conf.framework.components.includes(component)) {
          conf.framework.components.push(component)
        }
      })
    }
  })

  // Chain webpack config
  if (api.hasVite !== true) {
    api.chainWebpack((chain) => {
      // Add alias for easier imports
      chain.resolve.alias
        .set('qinputex', api.resolve.app('node_modules/qinputex'))
    })
  }
}