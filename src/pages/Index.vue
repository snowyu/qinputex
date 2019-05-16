<template lang="pug">
  q-page(class="flex flex-center")

    q-list
      q-item
        //- q-item-section(avatar)
        //-   q-icon(name="input" color="primary")
        q-item-section
          q-input-ex(ref="i" :type="type" :value="myValue" @input="onInput"
            :q-input-history="{icon: 'search', history: history, pinHistory:[{icon:'cake',value:'nicecake'}],maxHistory: 3}"
            :with-seconds='type==="datetime"'
          )
            template(v-slot:before)
              q-btn(flat :label='`${type}:`')
            template(v-slot:append)
              q-btn(label="append")
            template(v-slot:top)
              .q-gutter-xs
                q-chip(removable="" @click="doNextClick" clickable @remove="log('Icecream')" color="primary" text-color="white" icon="cake")
                  | On
                q-chip(removable="" color="teal" text-color="white" icon="cake")
                  | The
                q-chip(removable="" color="orange" text-color="white" icon="cake")
                  | Top
                q-chip(disable="" removable="" color="red" text-color="white" icon="cake")
                  | Slot

        q-item-section(side)
          q-btn(@click="doNextClick" label="next")
</template>

<style></style>

<script>
import { format } from 'date-fns'

// import QInputEx from "../components/qinput_ex.vue";
import { GRegisteredTypes } from "../components/qinputex";
// import QInputEx from "../components/qinputex/qinputex.vue";
import { QInputEx } from "../components/qinputex/qinputex";
import { QInputHistory } from "../components/qinputex/qinput-history";

const InputType = Object.keys(GRegisteredTypes);
let curr = 0;

console.log(InputType);

export default {
  components: {
    QInputEx,
  },
  data: () => {
    return {
      history: []
      ,type: 'search'//InputType[0]
      ,myValue: ''//format(new Date, 'yyyy/MM/dd')
    }
  },
  computed: {
  },
  watch: {
    'history' : function(val) {
      console.log('changed', val)
    }
  },
  methods: {
    onInput: (v)=>{
      console.log('qExt',v)
    },
    doNextClick: function() {
      console.log(arguments)
      this.myValue = '';
      this.type = InputType[curr];
      curr++;
      if (curr >= InputType.length) curr = 0;
    }
  },
  name: "PageIndex"
};
</script>
