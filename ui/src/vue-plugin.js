import QInputEx from './components/QInputEx/QInputEx.vue'
import QInputHistory from './components/QInputEx/QInputHistory.vue'
import {version} from '../package.json'

// const version = __UI_VERSION__

function install (app) {
  app.component(QInputHistory.name, QInputHistory)
  app.component(QInputEx.name, QInputEx)
}

export {
  version,
  QInputEx,
  QInputHistory,
  install
}
