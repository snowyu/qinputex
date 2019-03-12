import enUS from './en-us'
import zhCN from './zh-hans'
import fr from './fr'

export default {
  'en-us': enUS,
  'zh-hans': zhCN,
  fr
}

/**
 * Usage:
 *  In template: `{{ $t("message.hello") }}`
 *  In JS: Vue.i18n.t(key, [locale], [values])
 */
