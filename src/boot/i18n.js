import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
import { Quasar } from 'quasar'

export default async ({ app, Vue }) => {
  Vue.use(VueI18n);
  // zh-hans是RFC 4646中的规范，但是目前用的少了，更多是用iso 639 (zh-cn)
  // const defaultLanguage = 'en-us';
  const defaultLanguage = 'zh-hans';

  // Set i18n instance on app
  Vue.i18n = app.i18n = new VueI18n({
    locale: defaultLanguage,
    fallbackLocale: 'en-us',
    messages
  });
  const lang = await import(`quasar/lang/${defaultLanguage}`);
  // bug 中文日期的时区被固定为UTC:
  if (defaultLanguage === 'zh-hans' || defaultLanguage === 'zh-hant') {
    lang.default.date.headerTitle = function (date) {
      return new Intl.DateTimeFormat('zh-hans', {
        weekday: 'short', month: 'short', day: 'numeric'
      }).format(date)
    }
  }
  Quasar.lang.set(lang.default);
}
