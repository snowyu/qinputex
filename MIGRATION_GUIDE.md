# Migration Guide: QInputEx from Quasar v1 to Quasar v2

This guide helps you migrate your QInputEx components from Quasar v1 (Vue 2) to Quasar v2 (Vue 3).

## Overview

The migration involves updating to Vue 3's Composition API, new v-model syntax, and Quasar v2's updated component APIs. The core functionality remains the same, but the syntax and some APIs have changed.

## Prerequisites

- Update Quasar to v2.0.0 or higher
- Update Vue to v3.0.0 or higher
- Update Vue I18n to v9.0.0 or higher

## Breaking Changes

### 1. Component Import

**Quasar v1:**
```javascript
import { QInputEx } from 'qinputex/dist/es2015'
```

**Quasar v2:**
```javascript
import { QInputEx } from 'qinputex'
```

### 2. v-model Syntax

**Quasar v1:**
```vue
<q-input-ex :value="myValue" @input="updateValue" />
```

**Quasar v2:**
```vue
<q-input-ex v-model="myValue" />
<!-- or explicitly -->
<q-input-ex :model-value="myValue" @update:model-value="updateValue" />
```

### 3. Event Names

| Quasar v1 | Quasar v2 |
|-----------|-----------|
| `@input` | `@update:model-value` |
| `@change` | `@change` (unchanged) |
| `@search` | `@search` (unchanged) |

### 4. Component Registration

**Quasar v1 (Options API):**
```javascript
export default {
  components: {
    QInputEx
  }
}
```

**Quasar v2 (Composition API):**
```vue
<script setup>
import { QInputEx } from 'qinputex'
// No need to register in script setup
</script>
```

### 5. Custom Input Type Definition

**Quasar v1:**
```javascript
const CustomInput = {
  name: 'custom',
  on: {
    input(value) {
      // Access component instance with 'this'
      if (this.$attrs.smartClosed !== false) {
        // ...
      }
    }
  }
}
```

**Quasar v2:**
```javascript
const CustomInput = {
  name: 'custom',
  on: {
    input(value, reason, detail, attach) {
      // 'this' context is bound by the component
      const attrs = this.$attrs || {}
      if (attrs.smartClosed !== false) {
        // ...
      }
    }
  }
}
```

## Step-by-Step Migration

### Step 1: Update Dependencies

```json
{
  "dependencies": {
    "quasar": "^2.0.0",
    "vue": "^3.0.0",
    "vue-i18n": "^9.0.0",
    "qinputex": "^1.0.0"
  }
}
```

### Step 2: Update Quasar Config

In `quasar.config.js`:

```javascript
module.exports = function (ctx) {
  return {
    framework: {
      components: [
        'QBtn',
        'QIcon',
        'QPopupProxy',
        'QCard',
        'QCardSection',
        'QToolbar',
        'QToolbarTitle',
        'QInput',
        'QSelect',
        'QDate',
        'QTime',
        'QColor',
        'QChip'
      ]
    }
  }
}
```

### Step 3: Update Component Usage

**Before (Quasar v1):**
```vue
<template>
  <div>
    <q-input-ex
      :value="dateValue"
      @input="updateDate"
      type="date"
      :smart-closed="false"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      dateValue: ''
    }
  },
  methods: {
    updateDate(value) {
      this.dateValue = value
    }
  }
}
</script>
```

**After (Quasar v2):**
```vue
<template>
  <div>
    <q-input-ex
      v-model="dateValue"
      type="date"
      :smart-closed="false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QInputEx } from 'qinputex'

const dateValue = ref('')
</script>
```

### Step 4: Update Custom Input Types

If you have custom input types, update them for Vue 3 compatibility:

```javascript
// Updated for Vue 3
const MyCustomInput = {
  name: 'my-custom',
  type: 'text',
  attaches: {
    append: {
      icon: 'event',
      popup: {
        name: 'QDate',
        on: {
          input(value, reason, detail, attach) {
            // Use optional chaining for safety
            const smartClosed = this.$attrs?.smartClosed
            if (smartClosed !== false && ['day', 'today'].includes(reason)) {
              attach.popup?.hide?.()
            }
            return value
          }
        }
      }
    }
  }
}
```

## Common Issues and Solutions

### Issue 1: Component not updating

**Problem:** The component value doesn't update when using v-model.

**Solution:** Make sure you're using `v-model` or the explicit `:model-value` and `@update:model-value` syntax.

### Issue 2: TypeScript errors

**Problem:** TypeScript errors with Vue 3 types.

**Solution:** Update your TypeScript configuration and ensure you have the latest Vue 3 type definitions:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "lib": ["esnext", "dom"],
    "jsx": "preserve"
  }
}
```

### Issue 3: Popup not closing

**Problem:** Date/time popups don't close automatically.

**Solution:** Check your popup close logic and ensure you're calling the hide method correctly:

```javascript
attach.popup?.hide?.()
```

### Issue 4: i18n Errors

**Problem:** Vue I18n errors after migration.

**Solution:** Update to Vue I18n v9 and use the new API:

```javascript
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en-us',
  fallbackLocale: 'en-us',
  messages: {
    // your messages
  }
})
```

## New Features in v2

- Full Vue 3 Composition API support
- Better TypeScript integration
- Improved performance
- Modern build output (ES modules)

## Need Help?

If you encounter issues not covered in this guide:

1. Check the [README](./README.md) for updated usage examples
2. Review the component source code for API changes
3. Open an issue on the GitHub repository

Happy migrating! 🚀