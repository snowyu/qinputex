import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { Quasar } from 'quasar'

export default async ({ app }) => {
  // zh-hans是RFC 4646中的规范，但是目前用的少了，更多是用iso 639 (zh-cn)
  // const defaultLanguage = 'en-us';
  const defaultLanguage = 'zh-hans';

  // Create I18n instance
  const i18n = createI18n({
    locale: defaultLanguage,
    fallbackLocale: 'en-us',
    legacy: false, // Use Composition API mode
    globalInjection: true, // Inject $t, $tc, etc. globally
    messages
  });

  // Tell app to use the I18n instance
  app.use(i18n);

  // Set Quasar language pack
  try {
    // Map zh-hans to zh-CN for Quasar v2
    const quasarLang = defaultLanguage === 'zh-hans' ? 'zh-CN' : defaultLanguage;
    
    // For Vite, we need to use a more explicit import
    let lang
    if (quasarLang === 'zh-CN') {
      const langModule = await import('quasar/lang/zh-CN')
      lang = langModule
    } else if (quasarLang === 'en-us') {
      const langModule = await import('quasar/lang/en-US')
      lang = langModule
    } else {
      // Fallback to en-US
      const langModule = await import('quasar/lang/en-US')
      lang = langModule
    }
    
    // bug 中文日期的时区被固定为UTC:
    if (defaultLanguage === 'zh-hans' || defaultLanguage === 'zh-hant') {
      lang.default.date.headerTitle = function (date) {
        return new Intl.DateTimeFormat('zh-hans', {
          weekday: 'short', month: 'short', day: 'numeric'
        }).format(date)
      }
    }
    Quasar.lang.set(lang.default);
  } catch (err) {
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
    console.error('Error loading Quasar language pack:', err);
  }
}