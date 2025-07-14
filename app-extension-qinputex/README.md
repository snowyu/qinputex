# Quasar App Extension - QInputEx

> Advanced Input Component for Quasar Framework v2

This is the official Quasar App Extension for QInputEx, providing an easy way to add advanced input components to your Quasar project.

## Features

- 🎯 **Multiple Input Types**: date, time, datetime, fulltime, password, color, search
- 🔍 **Search with History**: Built-in search history management
- 📅 **Smart Date/Time Pickers**: Integrated with Quasar's components
- 🎨 **Easy Installation**: One command to add to your project
- 🚀 **Auto Import**: Components are automatically registered globally

## Install

```bash
quasar ext add qinputex
```

## Uninstall

```bash
quasar ext remove qinputex
```

## Usage

Once installed, you can use QInputEx components in your templates without importing:

```vue
<template>
  <q-input-ex v-model="date" type="date" />
  <q-input-ex v-model="time" type="time" />
  <q-input-ex v-model="color" type="color" />
</template>

<script setup>
import { ref } from 'vue'

const date = ref('')
const time = ref('')
const color = ref('#1976D2')
</script>
```

### Available Input Types

- `text` - Standard text input
- `textarea` - Multi-line text input  
- `number` - Number input
- `date` - Date picker (YYYY/MM/DD)
- `time` - Time picker (HH:mm)
- `fulltime` - Time picker with seconds (HH:mm:ss)
- `datetime` - Combined date and time picker
- `color` - Color picker
- `password` - Password input with visibility toggle
- `search` - Search input with history management

### Search Input with History

```vue
<template>
  <q-input-ex
    v-model="searchValue"
    type="search"
    @search="handleSearch"
    :q-input-history="{
      history: searchHistory,
      pinHistory: [
        { icon: 'star', value: 'Popular search' }
      ],
      maxHistory: 5
    }"
  />
</template>

<script setup>
import { ref } from 'vue'

const searchValue = ref('')
const searchHistory = ref([])

const handleSearch = (value) => {
  console.log('Searching:', value)
  searchHistory.value.unshift(value)
}
</script>
```

### Slots

QInputEx supports all QInput slots plus two additional:

- `top` - Content above the input
- `bottom` - Content below the input

```vue
<q-input-ex v-model="value" type="date">
  <template v-slot:top>
    <q-chip>Top content</q-chip>
  </template>
  <template v-slot:bottom>
    <div class="text-caption">Bottom content</div>
  </template>
</q-input-ex>
```

## Manual Import

If you prefer manual imports or need tree-shaking:

```javascript
import { QInputEx } from 'qinputex'

export default {
  components: {
    QInputEx
  }
}
```

## API

See the [main QInputEx documentation](https://github.com/snowyu/qinputex) for detailed API reference.

## Support

- [GitHub Issues](https://github.com/snowyu/qinputex/issues)
- [Documentation](https://github.com/snowyu/qinputex)

## License

MIT