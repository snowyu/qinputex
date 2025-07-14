/**
 * Quasar App Extension install script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/InstallAPI.js
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export default function (api) {
  // Quasar compatibility check
  api.compatibleWith('quasar', '^2.0.0')
  api.compatibleWith('@quasar/app-vite', '^1.0.0 || ^2.0.0')
  api.compatibleWith('@quasar/app-webpack', '^3.0.0 || ^4.0.0')

  // We always install the boot file
  api.render('./templates', {}, true)

  // Prompts flow
  if (api.prompts.examples) {
    // Create example page
    const examplesPath = api.resolve.src('pages/QInputExExamples.vue')
    if (!existsSync(examplesPath)) {
      api.render('./templates/examples', {}, true)
      
      console.log('📦 QInputEx examples page created at src/pages/QInputExExamples.vue')
      console.log('💡 Add a route to this page in your routes configuration')
    }
  }

  // Update i18n if present
  const i18nPath = api.resolve.src('i18n/index.js')
  if (existsSync(i18nPath)) {
    console.log('🌐 Detected i18n - QInputEx comes with built-in i18n support')
  }

  // Success message
  console.log('✨ QInputEx App Extension has been installed!')
  console.log('')
  console.log('📚 Documentation: https://github.com/snowyu/qinputex')
  console.log('')
  console.log('🚀 To get started:')
  console.log('   - Import and use QInputEx in your components:')
  console.log('     import { QInputEx } from \'qinputex\'')
  console.log('   - Or use it globally (already registered via boot file)')
  console.log('')
  
  if (api.prompts.examples) {
    console.log('📋 Example page available at: src/pages/QInputExExamples.vue')
  }
}