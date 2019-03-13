<template lang="pug">
  q-page(class="flex flex-center")
    q-list
      q-item
        q-item-section(avatar)
          q-icon(name="input" color="primary")
        q-item-section
          q-input-ex(ref="i" :type="type" :value="myValue" @input="onInput" with-seconds)
            template(v-slot:before)
              q-btn(:label="type")
            template(v-slot:append)
              q-btn(label="append")
        q-item-section(side)
          q-btn(@click="doclick" label="next")
</template>

<style></style>

<script>
// import QInputEx from "../components/qinput_ex.vue";
import { GRegisteredTypes } from "../components/qinputex";
// import QInputEx from "../components/qinputex/qinputex.vue";
import { QInputEx } from "../components/qinputex/qinputex";
import { format } from 'date-fns'

const InputType = Object.keys(GRegisteredTypes);
let curr = 0;

export default {
  components: {
    QInputEx,
  },
  data: () => {
    return {
      type: 'datetime',
      myValue: ''//format(new Date, 'yyyy/MM/dd')
    }
  },
  computed: {
  },
  methods: {
    onInput: (v)=>{
      console.log('qExt',v)
    },
    doclick: function() {
      this.type = InputType[curr];
      curr++;
      if (curr >= InputType.length) curr = 0;
    }
  },
  name: "PageIndex"
};
</script>
