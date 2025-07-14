import { defineComponent, ref, watch, PropType, h } from 'vue'
import { QChip } from 'quasar'

export interface IHistoryItem {
  value: string;
  icon?: string;
  iconRight?: string;
  color?: string;
  textColor?: string;
  dense?: boolean;
  square?: boolean;
  outline?: boolean;
  removable?: boolean;
}

export type InputHistoryItem = string | IHistoryItem;

export const QInputHistory = defineComponent({
  name: 'QInputHistory',
  props: {
    history: {
      type: Array as PropType<InputHistoryItem[]>,
      default: () => []
    },
    maxHistory: {
      type: Number
    },
    pinHistory: {
      type: Array as PropType<InputHistoryItem[]>,
      default: () => []
    }
  },
  emits: ['removed', 'click'],
  setup(props, { emit, attrs }) {
    const items = ref<InputHistoryItem[]>(props.history || [])
    const pinItems = ref<InputHistoryItem[]>(props.pinHistory || [])

    watch(() => props.history, (val) => {
      if (val && props.maxHistory && val.length > props.maxHistory) {
        val.length = props.maxHistory
      }
      items.value = val || []
    }, { immediate: true })

    watch(() => props.pinHistory, (val) => {
      if (val && props.maxHistory && val.length > props.maxHistory) {
        val.length = props.maxHistory
      }
      pinItems.value = val || []
    }, { immediate: true })

    const add = (aItem: InputHistoryItem) => {
      items.value.unshift(aItem)
    }

    const remove = (index: number) => {
      return items.value.splice(index, 1)
    }

    const removeItem = (aItems: InputHistoryItem[], index: number) => {
      emit('removed', aItems.splice(index, 1), aItems)
    }

    const getHistories = (aItems: InputHistoryItem[], removable = true) => {
      if (aItems && aItems.length) {
        return aItems.map((item: InputHistoryItem, index) => {
          const text = typeof item === 'string' ? item : item?.value
          const itemProps = typeof item === 'object' ? item : {}
          const chipProps = Object.assign({ removable }, attrs, itemProps)
          delete chipProps.value

          return h(QChip, {
            ...chipProps,
            clickable: true,
            onRemove: () => removeItem(aItems, index),
            onClick: () => emit('click', text, index, item)
          }, () => text)
        })
      }
      return []
    }

    return () => {
      if (items.value || pinItems.value) {
        return h('div', { class: 'q-input-history q-gutter-xs' }, [
          ...getHistories(pinItems.value, false),
          ...getHistories(items.value)
        ])
      }
      return null
    }
  }
})