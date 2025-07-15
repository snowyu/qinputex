<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Test Popup</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input v-model="internalValue" label="Popup Input" filled />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="OK" color="primary" @click="emitValue" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue;
});

function emitValue() {
  emit('update:modelValue', internalValue.value);
}
</script>