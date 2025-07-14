import { defineComponent, ref, computed, watch, nextTick, PropType, h, VNode } from 'vue'
import { QInput, QSelect, QBtn, QPopupProxy, QCard, QToolbar, QToolbarTitle, QCardSection, QDate, QTime, QColor } from 'quasar'
import merge from 'lodash.merge'
import { useI18n } from 'vue-i18n'

import { hyphenate } from './hyphenate'
import {
  ExternalInputAttachNames,
  GRegisteredTypes, InputAttach, InputAttaches, InputAttachName,
  InputIconAttach, InputPopup, InputType,
  InternalInputAttachNames, register,
  TRuleFunc,
} from './consts'

register({ name: 'text', type: 'text' })
register({ name: 'textarea', type: 'textarea' })
register({ name: 'number', type: 'number' })

const popRefPrefix = 'pop'

function bindObj(obj: any, that: any) {
  if (obj) {
    Object.keys(obj).forEach(k => {
      if (typeof obj[k] === 'function') {
        obj[k] = obj[k].bind(that)
      }
    })
  }
  return obj
}

export const QInputEx = defineComponent({
  name: 'QInputEx',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    icon: String,
    type: {
      type: [String, Object] as PropType<string | InputType>,
      default: 'text'
    },
    slotAfterAttach: Boolean,
    mask: String,
    rules: Array as PropType<Array<string | TRuleFunc>>,
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs, slots, expose }) {
    const { t } = useI18n()
    const inputBoxRef = ref<any>(null)
    
    const iValue = ref<string | null>(props.modelValue)
    const iType = ref<InputType | null>(null)
    const attaches = ref<InputAttaches>({})
    const nativeType = ref('text')
    const maskValue = ref<string | undefined>('')
    const rulesValue = ref<Array<string | TRuleFunc> | null>(null)
    const inValue = ref<((v: any) => any) | undefined>()
    const outValue = ref<((v: any) => any) | undefined>()
    const propsValue = ref<any>()
    const mReason = ref<any>()
    const mDetail = ref<any>()
    const popupRefs = ref<Record<string, any>>({})

    const inputBox = computed(() => {
      const box = inputBoxRef.value
      return box?.$el?.querySelector('input') || box?.$el?.querySelector('textarea') || box
    })

    const clearType = () => {
      iValue.value = ''
      maskValue.value = ''
      iType.value = null
      rulesValue.value = null
      nativeType.value = 'text'
      attaches.value = {}
      resetValidation()
    }

    const resetValidation = () => {
      if (inputBoxRef.value?.resetValidation) {
        nextTick(() => inputBoxRef.value.resetValidation())
      }
    }

    const cloneType = (aType: InputType) => {
      iType.value = aType
      maskValue.value = props.mask || attrs.mask || aType.mask
      rulesValue.value = (props.rules || attrs.rules as any) || aType.rules
      inValue.value = aType.inValue
      outValue.value = aType.outValue
      nativeType.value = aType.type
      const vProps = propsValue.value = aType.props
      if (vProps) {
        bindObj(vProps, { emit, attrs, slots })
      }
      const vAttaches: any = attaches.value
      if (aType.attaches) {
        Object.keys(aType.attaches).forEach((attachName) => {
          const src: any = aType.attaches
          if (Array.isArray(src[attachName])) {
            vAttaches[attachName] = src[attachName].map((item: any) => Object.assign({}, item))
          } else {
            vAttaches[attachName] = Object.assign({}, src[attachName])
          }
        })
      }
      resetValidation()
    }

    const typeChanged = (value: string | InputType) => {
      const vInputType = typeof value === 'string' ? GRegisteredTypes[value] :
        value && value.name ? merge({}, GRegisteredTypes[value.name], value) : value
      if (!vInputType) { throw new Error(`The input '${value}' type is not exists`) }
      clearType()
      cloneType(vInputType)
    }

    const getPopupComponent = (popup?: InputPopup) => {
      const componentName = (typeof popup === 'object') ? popup.name : popup
      // Map string component names to actual components
      const componentMap: Record<string, any> = {
        'QDate': QDate,
        'QTime': QTime,
        'QColor': QColor
      }
      return typeof componentName === 'string' ? componentMap[componentName] || componentName : componentName
    }

    const getComponent = () => {
      return nativeType.value === 'select' ? QSelect : QInput
    }

    const focus = () => {
      inputBox.value?.focus()
    }

    const getPopup = (aName: string) => {
      return popupRefs.value[popRefPrefix + aName]
    }

    watch(() => props.modelValue, (value) => {
      iValue.value = value
    })

    watch(iValue, (value) => {
      emit('update:modelValue', value, mReason.value, mDetail.value)
    })

    watch(() => props.type, typeChanged, { immediate: true })

    expose({
      focus,
      getPopup,
      resetValidation
    })

    const getPopupEl = (attach: InputIconAttach): VNode => {
      const vPopup: any = attach.popup
      const toValue = vPopup.toValue
      const vValue = typeof toValue === 'function' ? toValue.call(null, iValue.value) : iValue.value
      
      const vPopupData: any = {
        maxHeight: '100vh',
        breakpoint: 800
      }
      
      const vComp = getPopupComponent(vPopup)
      const vCaption = vPopup.caption || iType.value!.name
      
      // Merge popup attributes with default attributes
      const vCompAttrs: any = Object.assign(
        { modelValue: vValue, filled: true },
        attrs,
        vPopup.attrs || {}
      )
      
      const vOn = Object.assign({}, vPopup.on)
      const onInput = vOn.input || vPopup['@input']
      delete vOn.input
      
      // Create a context object for the event handlers
      const context = {
        $attrs: attrs,
        emit,
        iValue,
        props: propsValue.value
      }
      
      bindObj(vOn, context)
      
      const handleInput = (value: any, reason: any, detail: any) => {
        if (typeof reason === 'object') {
          detail = reason
          reason = ''
        }
        reason = reason || vPopup.ref || iType.value!.name
        mReason.value = reason
        mDetail.value = detail
        if (typeof onInput === 'function') {
          const v: any = onInput.call(context, value, reason, detail, {
            attach,
            component: null,
            popup: popupInstance,
          })
          if (v !== undefined) { value = v }
        }
        iValue.value = value
      }

      const vCompEl = h(vComp, {
        ...vCompAttrs,
        'onUpdate:modelValue': handleInput,
        ...vOn
      })

      let popupInstance: any = null
      const popupRef = (el: any) => {
        popupInstance = el
        if (vPopup.ref) {
          popupRefs.value[popRefPrefix + vPopup.ref] = el
        }
      }

      return h(QPopupProxy, { ...vPopupData, ref: popupRef }, () => 
        h(QCard, {}, () => [
          h(QToolbar, {}, () => [
            h(QBtn, { flat: true, round: true, icon: attach.icon }),
            h(QToolbarTitle, {}, () => 
              t('Please select', { type: t(vCaption) }) as string
            ),
            h(QBtn, { 
              flat: true, 
              round: true, 
              color: 'secondary', 
              icon: 'close',
              onClick: () => {
                if (popupInstance && popupInstance.hide) {
                  popupInstance.hide()
                }
              }
            })
          ]),
          h(QCardSection, {}, () => vCompEl)
        ])
      )
    }

    const getAttach = (attach: InputAttach): VNode | undefined => {
      let result: VNode | undefined
      
      if (attach.name) {
        const vNodeData = {} as any
        const vCompName = typeof attach.name === 'string' ? attach.name : attach.name.name
        const vCompAttrs = attrs[hyphenate(vCompName)]
        vNodeData.props = Object.assign({}, attach.props, vCompAttrs)
        vNodeData.attrs = Object.assign({}, attach.attrs, vCompAttrs)
        
        if (attach.on) {
          const vOn = Object.assign({}, attach.on)
          bindObj(vOn, { emit, attrs, slots })
          vNodeData.on = vOn
        }
        
        result = h(attach.name, vNodeData)
      } else if (attach.icon || attach.caption) {
        const btnAttrs = Object.assign({ flat: true, dense: true }, attach.attrs)
        const handlers: any = {}
        const vClick = attach.click
        
        if (attach.icon) { btnAttrs.icon = attach.icon }
        if (attach.caption) { btnAttrs.label = attach.caption }
        if (vClick) { handlers.onClick = (e: MouseEvent) => vClick.call(null, e) }
        
        if (attach.popup) {
          result = h(QBtn, { ...btnAttrs, ...handlers }, () => [getPopupEl(attach)])
        } else {
          result = h(QBtn, { ...btnAttrs, ...handlers })
        }
      }
      
      return result
    }

    const genAttach = (name: InputAttachName) => {
      let vAttach: InputAttach | InputAttach[] | undefined = attaches.value[name]
      const vSlot: any = slots[name]
      
      if (vAttach || vSlot) {
        const vSlotAfterAttach = props.slotAfterAttach
        return (slotProps: any) => {
          const result: VNode[] = []
          
          if (vSlot && !vSlotAfterAttach) { 
            result.push(...(Array.isArray(vSlot(slotProps)) ? vSlot(slotProps) : [vSlot(slotProps)]))
          }
          
          if (vAttach) {
            if (!Array.isArray(vAttach)) { vAttach = [vAttach] }
            vAttach.forEach((item: InputAttach) => {
              const attach = getAttach(item)
              if (attach) result.push(attach)
            })
          }
          
          if (vSlot && vSlotAfterAttach) { 
            result.push(...(Array.isArray(vSlot(slotProps)) ? vSlot(slotProps) : [vSlot(slotProps)]))
          }
          
          return result
        }
      }
      return undefined
    }

    return () => {
      const scopedSlots: any = {}
      
      ExternalInputAttachNames.forEach((name: any) => {
        const slot = genAttach(name)
        if (slot) scopedSlots[name] = slot
      })
      
      const renderInput = () => {
        const defaultAttrs = {
          filled: true,
          mask: maskValue.value,
          rules: rulesValue.value,
          type: nativeType.value,
        }
        
        const vComp = getComponent()
        const inputProps = Object.assign({}, defaultAttrs, attrs, { modelValue: iValue.value })
        const inputScopedSlots: any = {}
        
        const vOn = Object.assign({}, iType.value?.on || {})
        const onInput = vOn.input || iType.value?.['@input']
        delete vOn.input
        
        // Create context for input event handlers
        const inputContext = {
          $attrs: attrs,
          emit,
          iValue,
          props: propsValue.value
        }
        
        if (vOn) { bindObj(vOn, inputContext) }
        
        const handleInput = (value: any, reason: any, detail: any) => {
          if (typeof reason === 'object') {
            detail = reason
            reason = ''
          }
          reason = reason || 'inputBox'
          mReason.value = reason
          mDetail.value = detail
          
          if (typeof onInput === 'function') {
            const v = onInput.call(inputContext, value, reason, detail, inputBoxRef.value)
            if (v !== undefined) { value = v }
          }
          iValue.value = value
        }
        
        InternalInputAttachNames.forEach((name: any) => {
          const slot = genAttach(name)
          if (slot) inputScopedSlots[name] = slot
        })
        
        return h(vComp, {
          ref: inputBoxRef,
          ...inputProps,
          placeholder: inputProps.placeholder,
          'onUpdate:modelValue': handleInput,
          ...vOn
        }, inputScopedSlots)
      }
      
      const vSlotTop = scopedSlots.top
      const vSlotBottom = scopedSlots.bottom
      
      if (vSlotTop || vSlotBottom) {
        const result: VNode[] = []
        
        if (vSlotTop) {
          result.push(h('div', { class: 'row q-field-top' }, vSlotTop()))
        }
        
        result.push(renderInput())
        
        if (vSlotBottom) {
          result.push(h('div', { class: 'row q-field-bottom' }, vSlotBottom()))
        }
        
        return h('div', { class: 'q-field-ex' }, result)
      } else {
        return renderInput()
      }
    }
  }
})