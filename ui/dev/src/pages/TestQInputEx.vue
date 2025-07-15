<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md">
      <q-input-ex v-model="text1" label="Default Text Input" />

      <q-input-ex v-model="text2" label="Number Input" type="number" />

      <q-input-ex v-model="text3" label="Textarea Input" type="textarea" />

      <q-input-ex v-model="text4" label="Input with Prepend and Append">
        <template #prepend>
          <q-icon name="event" />
        </template>
        <template #append>
          <q-icon name="close" @click="text4 = ''" class="cursor-pointer" />
        </template>
      </q-input-ex>

      <q-input-ex v-model="text5" label="Input with Before and After">
        <template #before>
          <q-avatar icon="person" />
        </template>
        <template #after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-input-ex>

      <q-input-ex v-model="text6" label="Input with Popup" :type="popupType" />

      <q-input-ex v-model="dateValue" label="Date Input" type="date" >
        <template #prepend>
          <q-icon name="event" />
        </template>
      </q-input-ex>

      <q-input-ex v-model="passwordValue" label="Password Input" type="password" />

      <q-input-ex v-model="timeValue" label="Time Input" type="time" />

      <q-input-ex v-model="datetimeValue" label="Datetime Input" type="datetime" />

      <q-input-ex v-model="fulltimeValue" label="Full Time Input" type="fulltime" />

      <q-input-ex v-model="colorValue" label="Color Input" type="color" />

      <q-input-ex v-model="searchValue" label="Search Input" type="search" @search="onSearch" :history="searchHistory" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, markRaw } from 'vue';
import TestPopupComponent from '../components/TestPopupComponent.vue';

const text1 = ref('Hello QInputEx');
const text2 = ref(123);
const text3 = ref('This is a textarea example.');
const text4 = ref('Input with icons');
const text5 = ref('Input with buttons');
const text6 = ref('Popup Value');
const dateValue = ref('2023/07/05');
const passwordValue = ref('mysecretpassword');
const timeValue = ref('10:30');
const datetimeValue = ref('2023-07-05 10:30:00');
const fulltimeValue = ref('10:30:00');
const colorValue = ref('#ff0000');
const searchValue = ref('');
const searchHistory = ref(['apple', 'banana', 'orange']);

function onSearch(value) {
  console.log('Search event:', value);
  if (searchHistory.value.indexOf(value) === -1) {
    searchHistory.value.unshift(value);
  }
}

const popupType = markRaw({
  name: 'test-popup',
  type: 'text',
  attaches: {
    append: {
      icon: 'edit',
      popup: markRaw({
        name: TestPopupComponent,
        caption: 'Edit Value',
        toValue: (v) => v,
        on: {
          input: (value, reason, detail) => {
            console.log('Popup input event:', value, reason, detail);
          }
        }
      }),
    }
  }
});
</script>
