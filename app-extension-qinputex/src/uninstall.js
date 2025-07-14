/**
 * Quasar App Extension uninstall script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/uninstall-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/UninstallAPI.js
 */

import { existsSync, unlinkSync } from 'fs'

export default function (api) {
  // Remove boot file
  api.removePath('src/boot/qinputex.js')
  
  // Remove example files if they exist
  const examplesPath = api.resolve.src('pages/QInputExExamples.vue')
  if (existsSync(examplesPath)) {
    if (api.prompts.removeExamples !== false) {
      unlinkSync(examplesPath)
      console.log('🗑️  Removed QInputEx examples page')
    }
  }

  console.log('👋 QInputEx App Extension has been uninstalled')
  console.log('   Note: You may need to manually remove any QInputEx components from your code')
}