<template>
  <div class="q-input-history">
    <q-chip v-for="(item, index) in history" :key="index" clickable @click="onClick(item)">
      {{ item }}
    </q-chip>
  </div>
</template>

<script setup>
defineOptions({ name: 'QInputHistory' });

const props = defineProps({
  history: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['click']);

function onClick(item) {
  emit('click', item);
}
</script>

<style lang="sass">
.q-input-history
  .q-chip
    cursor: pointer
</style>

