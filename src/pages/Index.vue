<template lang="pug">
  q-page(class="flex flex-center")
    q-avatar(size="128px" square)
      img(alt="Quasar logo" src="~assets/quasar-logo-full.svg")
      //- q-icon(name="email")
    q-input-ex(ref="i" :type="type" :value="myValue" @input="onInput")
    q-btn(@click="doclick")
</template>

<style></style>

<script>
import QInputEx from "../components/qinput_ex.vue";
import { format } from 'date-fns'
import { functionDeclaration } from 'babel-types';
const InputType = ['password' , 'text' , 'textarea' , 'email' , 'search' , 'tel' , 'file' , 'number' , 'url' , 'select' , 'date' , 'time' , 'fulltime' , 'color'];
let curr = 0;

export default {
  components: {
    QInputEx,
  },
  data: () => {
    return {
      type: 'color',
      myValue: ''//format(new Date, 'yyyy/MM/dd')
    }
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
