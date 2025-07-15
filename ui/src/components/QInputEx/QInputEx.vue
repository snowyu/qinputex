

<template>
  <div v-if="hasTopOrBottomSlots" class="q-field-ex">
    <div v-if="slots.top || attaches.top" class="row q-field-top">
      <component
        v-for="(item, index) in genAttach('top')"
        :key="index"
        :is="item"
      />
    </div>
    <component :is="componentName" ref="inputBox" v-bind="inputProps" v-model="iValue">
      <template v-for="(slot, name) in internalQInputSlots" #[name]>
        <component :is="slot" />
      </template>
    </component>
    <div v-if="slots.bottom || attaches.bottom" class="row q-field-bottom">
      <component
        v-for="(item, index) in genAttach('bottom')"
        :key="index"
        :is="item"
      />
    </div>
  </div>
  <component v-else :is="componentName" ref="inputBox" v-bind="inputProps" v-model="iValue">
    <template v-for="(slot, name) in internalQInputSlots" #[name]>
      <component :is="slot" />
    </template>
  </component>
</template>

<script setup>
import { ref, computed, watch, onMounted, useAttrs, useSlots, h, nextTick, resolveComponent, shallowRef, Fragment } from 'vue';
import { useI18n } from 'vue-i18n';
import { QInput, QSelect, QBtn, QPopupProxy, QCard, QToolbar, QToolbarTitle, QCardSection } from 'quasar';
import merge from 'lodash.merge';
import { getRegisteredTypes, register, ExternalInputAttachNames, InternalInputAttachNames, hyphenate } from './utils.js';

defineOptions({ name: 'QInputEx' });

const { t } = useI18n();

const props = defineProps({
  modelValue: {},
  type: { type: [String, Object], default: 'text' },
  slotAfterAttach: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);
const attrs = useAttrs();
const slots = useSlots();

const inputBox = ref(null);
const iValue = ref(props.modelValue);
const iType = ref(null);
const attaches = shallowRef({});
const nativeType = ref('text');
const mask = ref('');
const rules = ref(null);
const fromDisplayValue = shallowRef(null);
const toDisplayValue = shallowRef(null);
const componentProps = ref({});
const popupRef = ref(null);

let mReason = null;
let mDetail = null;

const GRegisteredTypes = getRegisteredTypes();

watch(() => props.modelValue, (newValue) => {
  if (toDisplayValue.value) { newValue = toDisplayValue.value(newValue); }
  if (String(iValue.value) !== String(newValue)) {
    iValue.value = newValue;
  }
});

watch(iValue, (newValue) => {
  if (fromDisplayValue.value) { newValue = fromDisplayValue.value(newValue); }
  if (String(newValue) !== String(props.modelValue)) {
    emit('update:modelValue', newValue, mReason, mDetail);
  }
});

function clearType() {
  iValue.value = '';
  mask.value = '';
  iType.value = null;
  rules.value = null;
  nativeType.value = 'text';
  attaches.value = {};
  resetValidation();
}

function resetValidation() {
  if (inputBox.value && inputBox.value.resetValidation) {
    nextTick(() => inputBox.value.resetValidation());
  }
}

function assignFromType(aType) {
  iType.value = aType;
  mask.value = attrs.mask || aType.mask;
  rules.value = attrs.rules || aType.rules;
  toDisplayValue.value = aType.toDisplayValue;
  fromDisplayValue.value = aType.fromDisplayValue;
  nativeType.value = aType.type;
  componentProps.value = aType.props;

  const vAttaches = {};
  if (aType.attaches) {
    Object.keys(aType.attaches).forEach((attachName) => {
      const src = aType.attaches;
      if (Array.isArray(src[attachName])) {
        vAttaches[attachName] = src[attachName].map((item) => {
          const newItem = { ...item };
          return newItem;
        });
      } else {
        const newItem = { ...src[attachName] };
        vAttaches[attachName] = newItem;
      }
    });
  }
  attaches.value = vAttaches;
  resetValidation();
}

watch(() => props.type, (newType) => {
  const vInputType = typeof newType === 'string' ? GRegisteredTypes[newType] :
    newType && newType.name ? merge({}, GRegisteredTypes[newType.name], newType) : newType;
  if (!vInputType) { throw new Error(`The input '${newType}' type is not exists`); }
  clearType();
  assignFromType(vInputType);
}, { immediate: true });

const componentName = computed(() => (nativeType.value === 'select' ? QSelect : QInput));

const inputProps = computed(() => {
  return {
    ...attrs,
    filled: true,
    mask: mask.value,
    rules: rules.value,
    type: nativeType.value,
    ...componentProps.value
  };
});

const hasTopOrBottomSlots = computed(() => {
  return (slots.top || attaches.value.top) || (slots.bottom || attaches.value.bottom);
});

const internalQInputSlots = computed(() => {
  const result = {};
  const qInputSlots = ['prepend', 'append', 'before', 'after']; // These are the slots QInput provides

  qInputSlots.forEach(name => {
    const generatedContent = genAttach(name);
    if (generatedContent && generatedContent.length > 0) {
      result[name] = () => generatedContent;
    }
  });
  return result;
});

function getPopupComponent(popup) {
  const comp = (typeof popup === 'object') ? popup.name : popup;
  return typeof comp === 'string' ? resolveComponent(comp) : comp;
}

function getPopup() {
  return popupRef.value;
}

function genAttach(name) {
  let vAttach = attaches.value[name];
  const vSlot = slots[name];
  if (vAttach || vSlot) {
    const vSlotAfterAttach = props.slotAfterAttach;
    const result = [];
    if (vSlot && !vSlotAfterAttach) { result.push(vSlot()); }
    if (vAttach) {
      if (!Array.isArray(vAttach)) { vAttach = [vAttach]; }
      vAttach.forEach((item) => {
        result.push(getAttach(item));
      });
    }
    if (vSlot && vSlotAfterAttach) { result.push(vSlot()); }

    // NOTE: VUE3 can not use VNode[] in `<component :is="...">` directly, see template for more details
    return result;
  }
  return null;
}

function getAttach(attach) {
  if (attach.name) {
    const vCompName = typeof attach.name === 'string' ? attach.name : attach.name.name;
    const vCompAttrs = attrs[hyphenate(vCompName)] || {};
    const props = { ...attach.props, ...vCompAttrs };
    const on = {};
    if (attach.on) {
      Object.keys(attach.on).forEach(eventName => {
        const parts = eventName.split(':');
        let onEventName = 'on' + parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        if (parts.length > 1) {
          onEventName += ':' + parts[1];
        }
        onEventName = onEventName.replace(/-(\w)/g, (match, p1) => p1.toUpperCase());
        on[onEventName] = attach.on[eventName];
      });
    }
    const vComp = attach.name // resolveComponent(attach.name)
    const vNode = h(vComp, { ...props, ...on });
    return vNode;
  } else if (attach.icon || attach.caption) {
    const btnProps = { flat: true, dense: true, ...attach.attrs };
    if (attach.icon) btnProps.icon = attach.icon;
    if (attach.caption) btnProps.label = attach.caption;

    const btnOn = {};
    if (attach.click) btnOn.onClick = (e) => attach.click(e, { iValue, nativeType, attaches, emit }); // 'this' is not available in setup context for binding

    if (attach.popup) {
      return h(QBtn, { ...btnProps, ...btnOn }, () => [getPopupVNode(attach)]);
    } else {
      return h(QBtn, { ...btnProps, ...btnOn });
    }
  }
  return null;
}

function getPopupVNode(attach) {
  const vPopup = attach.popup;
  const toValue = vPopup.toValue;
  const vValue = typeof toValue === 'function' ? toValue(iValue.value) : iValue.value;

  const popupProps = { maxHeight: '100vh', breakpoint: 800, ...vPopup.attrs };
  const compAttrs = { modelValue: vValue, filled: true, ...attrs, ...vPopup.attrs };
  const compName = getPopupComponent(vPopup);
  const caption = vPopup.caption || iType.value.name;

  const compOn = {};
  // Merge events from vPopup.on, ensuring correct camelCase for Vue 3
  if (vPopup.on) {
    Object.keys(vPopup.on).forEach(eventName => {
      const parts = eventName.split(':');
      let onEventName = 'on' + parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      if (parts.length > 1) {
        onEventName += ':' + parts[1];
      }
      onEventName = onEventName.replace(/-(\w)/g, (match, p1) => p1.toUpperCase());

      compOn[onEventName] = vPopup.on[eventName];
    });
  }

  // Override or add the primary onUpdate:modelValue handler
  const originalOnUpdateModelValue = compOn['onUpdate:modelValue'];

  compOn['onUpdate:modelValue'] = function (value, reason, detail) {

    if (typeof reason === 'object') {
      detail = reason;
      reason = '';
    }
    reason = reason || vPopup.ref || iType.value.name;
    mReason = reason;
    mDetail = detail;

    // Call the original handler from datetime.js if it exists
    if (typeof originalOnUpdateModelValue === 'function') {
      console.log('QInputEx - Calling originalOnUpdateModelValue from datetime.js');
      const val = originalOnUpdateModelValue.call(null, value, reason, detail, {
        iValue,
        nativeType,
        attaches,
        popupRef,
        attrs: attrs,
        hidePopup: () => popupRef.value.hide(),
        emit
      });
      if (val !== undefined) {value = val}
    }
    iValue.value = value;
  };

  const comp = h(compName, { ...compAttrs, ...compOn });

  return h(QPopupProxy, { ...popupProps, ref: popupRef }, () =>
    h(QCard, null, () => [
      h(QToolbar, null, () => [
        h(QBtn, { flat: true, round: true, icon: attach.icon }),
        h(QToolbarTitle, null, () => t('Please select', {type: t(caption)})),
        h(QBtn, { flat: true, round: true, color: 'secondary', icon: 'close', onClick: () => popupRef.value.hide() })
      ]),
      h(QCardSection, null, () => comp)
    ])
  );
}

// Expose public methods
defineExpose({
  focus: () => inputBox.value?.focus(),
  resetValidation,
  getPopup
});

onMounted(() => {
  // Initial setup
});

</script>
