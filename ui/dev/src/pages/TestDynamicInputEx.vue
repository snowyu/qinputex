<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-gutter-md">
      <q-btn label="Previous" @click="previousType" />
      <q-input-ex
        v-model="dynamicValue"
        :label="`Dynamic Input (${currentType})`"
        :type="currentType"
        class="col"
      />
      <q-btn label="Next" @click="nextType" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';

// Dynamic QInputEx
const types = ['text', 'number', 'textarea', 'date', 'password', 'time', 'datetime', 'fulltime', 'color', 'search'];
const typeIndex = ref(0);
const dynamicValue = ref('');

const currentType = computed(() => types[typeIndex.value]);

function nextType() {
  typeIndex.value = (typeIndex.value + 1) % types.length;
  dynamicValue.value = ''; // Clear value when type changes
}

function previousType() {
  typeIndex.value = (typeIndex.value - 1 + types.length) % types.length;
  dynamicValue.value = ''; // Clear value when type changes
}
</script>