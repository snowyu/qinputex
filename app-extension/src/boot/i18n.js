import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from '../i18n'

export default boot(({ app }) => {
  const i18n = createI18n({
    locale: 'zh-hans',
    fallbackLocale: 'en-us',
    messages,
    legacy: false
  })

  // Tell app to use the I18n instance
  app.use(i18n)
})
