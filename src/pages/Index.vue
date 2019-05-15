<template lang="pug">
  q-page(class="flex flex-center")

    q-list
      q-item
        //- q-item-section(avatar)
        //-   q-icon(name="input" color="primary")
        q-item-section
          q-input-ex(ref="i" :type="type" :value="myValue" @input="onInput" :with-seconds='type==="datetime"')
            template(v-slot:before)
              q-btn(flat :label='`${type}:`')
            template(v-slot:append)
              q-btn(label="append")
            template(v-slot:bottom)
              .q-gutter-xs
                q-chip(removable="" @remove="log('Icecream')" color="primary" text-color="white" icon="cake")
                  | On
                q-chip(removable="" @remove="log('Icecream')" color="teal" text-color="white" icon="cake")
                  | The
                q-chip(removable="" @remove="log('Icecream')" color="orange" text-color="white" icon="cake")
                  | Bottom
                q-chip(disable="" removable="" @remove="log('Icecream')" color="red" text-color="white" icon="cake")
                  | Slot
            template(v-slot:top)
              .q-gutter-xs
                q-chip(removable="" @remove="log('Icecream')" color="primary" text-color="white" icon="cake")
                  | On
                q-chip(removable="" @remove="log('Icecream')" color="teal" text-color="white" icon="cake")
                  | The
                q-chip(removable="" @remove="log('Icecream')" color="orange" text-color="white" icon="cake")
                  | Top
                q-chip(disable="" removable="" @remove="log('Icecream')" color="red" text-color="white" icon="cake")
                  | Slot

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

console.log(InputType);

export default {
  components: {
    QInputEx,
  },
  data: () => {
    return {
      type: InputType[0],
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
      this.myValue = '';
      this.type = InputType[curr];
      curr++;
      if (curr >= InputType.length) curr = 0;
    }
  },
  name: "PageIndex"
};
</script>
