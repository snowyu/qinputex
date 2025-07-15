import { defineBoot } from '#q-app/wrappers'
import VuePlugin from '../../../src' // "ui" is aliased in quasar.conf.js

export default defineBoot(({ app }) => {
  app.use(VuePlugin)
})
