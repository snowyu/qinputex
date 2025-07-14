import { boot } from 'quasar/wrappers'
import { QInputEx, QInputHistory } from 'qinputex'

// Import all input types to ensure they are registered
import 'qinputex/src/components/qinputex/types'

export default boot(({ app }) => {
  // Register components globally
  app.component('QInputEx', QInputEx)
  app.component('QInputHistory', QInputHistory)
})