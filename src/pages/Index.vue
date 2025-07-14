<template lang="pug">
  q-page(class="flex flex-center")

    q-list(bordered separator)
      q-item
        q-item-section
          q-input-ex(
            ref="inputRef" 
            :type="type" 
            v-model="myValue" 
            @update:modelValue="onInput" 
            @search="onSearch"
            :q-input-history="{ icon: 'search', history: history, pinHistory: [{icon:'cake',value:'nice cake'}, {icon:'phone',value:'telphone'}], maxHistory: 3 }"
            :with-seconds='type==="datetime"'
            :slots="{replaced: ['append']}"
          )
            template(v-slot:before)
              q-btn(flat :label="type + ':'")
            template(v-slot:append)
              q-btn(label="append")
            template(v-slot:top)
              .q-gutter-xs
                q-chip(@click="doPrevClick" clickable color="primary" text-color="white" icon="arrow_back")
                  | Prev
                q-chip(removable @click="doNextClick" clickable @remove="log('Icecream')" color="primary" text-color="white" icon="cake")
                  | On
                q-chip(removable color="teal" text-color="white" icon="cake")
                  | The
                q-chip(removable color="orange" text-color="white" icon="cake")
                  | Top
                q-chip(disable removable color="red" text-color="white" icon="cake")
                  | Slot
                q-chip(@click="doNextClick" clickable color="primary" text-color="white" icon="arrow_forward")
                  | Next

        q-item-section(side)
          q-btn(@click="doNextClick" label="next")
      q-item
        q-item-section
          q-input-ex(type="datetime" :today-btn="true" :smart-closed="false" v-model="dateTimeValue" @update:modelValue="(val) => log('dt=', val)")
      q-item
        q-item-section
          q-input-ex(
            @update:modelValue="log"
            ref="customRef"
            :rules="[v => /\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/.test(v) || 'bad date']"
            mask="####-##-##T##:##:##"
            v-model="customValue"
            :type="customType"
          )
</template>

<script setup>
import { ref } from 'vue'
import { format } from 'date-fns'
import { GRegisteredTypes, QInputEx, QInputHistory } from '../components/qinputex'

const InputType = Object.keys(GRegisteredTypes)
let curr = 0

// Available input types: InputType

// Reactive data
const history = ref([])
const type = ref('search')
const myValue = ref('')
const dateTimeValue = ref('2012-01-01T12:33:22')
const customValue = ref('2024-01-01T00:00:00')

// Custom type configuration
const customType = {
  name: 'custom',
  caption: 'date',
  type: 'tel',
  attaches: {
    prepend: [
      {
        icon: 'event',
        popup: {
          ref: 'date',
          name: 'QDate',
          caption: 'date',
          toValue(value) {
            // Convert from YYYY-MM-DDTHH:mm:ss to YYYY/MM/DD for QDate
            if (value) {
              const dateOnly = value.split('T')[0]
              return dateOnly.replace(/-/g, '/')
            }
            return value
          },
          attrs: {
            'today-btn': true,
            mask: 'YYYY/MM/DD',
          },
          on: {
            input: (v, reason, detail, attach) => {
              // Date selected
              // Convert date format and update the full value
              if (v) {
                const currentValue = customValue.value || '2024-01-01T00:00:00'
                const timePart = currentValue.split('T')[1] || '00:00:00'
                const newDate = v.replace(/\//g, '-')
                const newValue = newDate + 'T' + timePart
                if (['day', 'today'].indexOf(reason) !== -1 && attach && attach.popup) {
                  attach.popup.hide()
                }
                // Return the full datetime value
                return newValue
              }
            },
          },
        },
      },
      {
        icon: 'access_time',
        popup: {
          ref: 'time',
          name: 'QTime',
          caption: 'time',
          toValue(value) {
            // Extract time from YYYY-MM-DDTHH:mm:ss
            if (value) {
              const timePart = value.split('T')[1]
              return timePart || '00:00:00'
            }
            return '00:00:00'
          },
          attrs: {
            mask: 'HH:mm:ss',
            'format24h': true,
            'with-seconds': true,
          },
          on: {
            input: (v, reason, detail, attach) => {
              // Time selected
              // Convert time format and update the full value
              if (v) {
                const currentValue = customValue.value || '2024-01-01T00:00:00'
                const datePart = currentValue.split('T')[0] || '2024-01-01'
                const newValue = datePart + 'T' + v
                // Don't close popup for time picker - let user click close button when done
                // Return the full datetime value
                return newValue
              }
            },
          },
        },
      }
    ],
    after: {
      icon: 'colorize',
      popup: {
        name: 'QColor',
        caption: 'color',
      },
    },
  },
}

// Template refs
const inputRef = ref(null)
const customRef = ref(null)

// Methods
const log = (...args) => {
  console.log(...args)
}

const onInput = (v) => {
  // Handle input event
}

const onSearch = (v) => {
  // Handle search event
  if (v && !history.value.includes(v)) {
    history.value.unshift(v)
  }
}

const doPrevClick = () => {
  myValue.value = ''
  curr--
  if (curr < 0) curr = InputType.length - 1
  type.value = InputType[curr]
}

const doNextClick = () => {
  myValue.value = ''
  type.value = InputType[curr]
  curr++
  if (curr >= InputType.length) curr = 0
}
</script>

<style></style>