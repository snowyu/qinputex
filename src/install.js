/**
 * Quasar App Extension install script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 */

export default function (api) {
  // Register the component
  api.compatibleWith('quasar', '^2.0.0')
  api.compatibleWith('@quasar/app-vite', '^1.0.0')
  api.compatibleWith('@quasar/app-webpack', '^3.0.0')

  // Extend quasar.config.js
  api.extendQuasarConf((conf) => {
    // Make sure the QInputEx component is transpiled
    conf.build.transpileDependencies.push(/qinputex[\\/]src/)

    // Make sure boot file is registered
    if (!conf.boot.includes('~qinputex/boot/register.js')) {
      conf.boot.push('~qinputex/boot/register.js')
    }
  })
}