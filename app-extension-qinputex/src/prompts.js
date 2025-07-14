/**
 * Quasar App Extension prompts script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/prompts-api
 */

export default function () {
  return [
    {
      name: 'examples',
      type: 'confirm',
      message: 'Install example page?',
      default: true
    },
    {
      name: 'importStrategy', 
      type: 'list',
      message: 'How do you want to import QInputEx?',
      choices: [
        {
          name: 'Auto import (Recommended - Only imports what you use)',
          value: 'auto'
        },
        {
          name: 'Import all input types',
          value: 'all'
        },
        {
          name: 'Manual import (You handle the imports)',
          value: 'manual'
        }
      ],
      default: 'auto'
    }
  ]
}