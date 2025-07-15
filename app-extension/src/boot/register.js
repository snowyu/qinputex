import { boot } from 'quasar/wrappers'
import VuePlugin from 'quasar-ui-qinputex'

export default boot(({ app }) => {
  app.use(VuePlugin)
})
