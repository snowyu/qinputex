<template>
  <q-page padding>
    <div class="q-pa-md">
      <h4>QInputEx Examples</h4>
      
      <div class="q-gutter-md">
        <!-- Basic Input Types -->
        <div class="text-h6">Basic Input Types</div>
        
        <q-input-ex
          v-model="text"
          type="text"
          label="Text Input"
          hint="Standard text input"
        />
        
        <q-input-ex
          v-model="number"
          type="number"
          label="Number Input"
          hint="Number only input"
        />
        
        <q-input-ex
          v-model="textarea"
          type="textarea"
          label="Textarea"
          hint="Multi-line text input"
        />
        
        <!-- Date and Time -->
        <div class="text-h6 q-mt-lg">Date and Time</div>
        
        <q-input-ex
          v-model="date"
          type="date"
          label="Date Picker"
          hint="Click the calendar icon"
        />
        
        <q-input-ex
          v-model="time"
          type="time"
          label="Time Picker"
          hint="Select time (HH:mm)"
        />
        
        <q-input-ex
          v-model="fulltime"
          type="fulltime"
          label="Time with Seconds"
          hint="Select time (HH:mm:ss)"
        />
        
        <q-input-ex
          v-model="datetime"
          type="datetime"
          label="Date & Time"
          hint="Combined date and time picker"
          :with-seconds="true"
        />
        
        <!-- Special Types -->
        <div class="text-h6 q-mt-lg">Special Types</div>
        
        <q-input-ex
          v-model="color"
          type="color"
          label="Color Picker"
          hint="Click to select color"
        />
        
        <q-input-ex
          v-model="password"
          type="password"
          label="Password"
          hint="Toggle visibility with eye icon"
        />
        
        <q-input-ex
          v-model="search"
          type="search"
          label="Search with History"
          hint="Search history is maintained"
          @search="onSearch"
          :q-input-history="{
            history: searchHistory,
            pinHistory: [
              { icon: 'star', value: 'Popular search 1' },
              { icon: 'trending_up', value: 'Trending search' }
            ],
            maxHistory: 5
          }"
        />
        
        <!-- Custom Slots -->
        <div class="text-h6 q-mt-lg">With Custom Slots</div>
        
        <q-input-ex
          v-model="customSlots"
          type="date"
          label="Date with Custom Slots"
        >
          <template v-slot:before>
            <q-icon name="event" />
          </template>
          <template v-slot:append>
            <q-btn 
              flat 
              round 
              dense 
              icon="close" 
              @click="customSlots = ''"
            />
          </template>
          <template v-slot:top>
            <q-chip size="sm" color="primary">
              Top slot content
            </q-chip>
          </template>
          <template v-slot:bottom>
            <div class="text-caption text-grey">
              Bottom slot content
            </div>
          </template>
        </q-input-ex>
        
        <!-- Values Display -->
        <div class="text-h6 q-mt-lg">Current Values</div>
        <q-card>
          <q-card-section>
            <pre>{{ values }}</pre>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

// Model values
const text = ref('Hello QInputEx!')
const number = ref(42)
const textarea = ref('Multiple\nlines\nof text')
const date = ref('')
const time = ref('')
const fulltime = ref('')
const datetime = ref('')
const color = ref('#1976D2')
const password = ref('secret123')
const search = ref('')
const customSlots = ref('')

// Search history
const searchHistory = ref([])

// Methods
const onSearch = (value) => {
  console.log('Searching for:', value)
  if (value && !searchHistory.value.includes(value)) {
    searchHistory.value.unshift(value)
    if (searchHistory.value.length > 5) {
      searchHistory.value.pop()
    }
  }
}

// Computed
const values = computed(() => ({
  text: text.value,
  number: number.value,
  textarea: textarea.value,
  date: date.value,
  time: time.value,
  fulltime: fulltime.value,
  datetime: datetime.value,
  color: color.value,
  password: password.value,
  search: search.value,
  customSlots: customSlots.value
}))
</script>

<style scoped>
.q-gutter-md > * {
  margin-bottom: 16px;
}
</style>