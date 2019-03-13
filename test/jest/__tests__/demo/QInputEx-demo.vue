<template lang="pug">
div
  q-input-ex(ref="i" :type="type" :value="myValue" @input="onInput")
    template(v-slot:before)
      q-btn(label="hi")
  q-btn(id="mybutton" @click="increment" label="next")

</template>

<script>
import { GRegisteredTypes } from "~/src/components/qinputex";

const InputType = Object.keys(GRegisteredTypes);

export default {
  name: 'QINPUTEX',
  data () {
    return {
      type: 'color',
      counter: 0,
      myValue: ''//format(new Date, 'yyyy/MM/dd')
    }
  },
  methods: {
    onInput: (v)=>{
    },
    increment: function() {
      this.type = InputType[this.counter];
      this.counter++;
      if (this.counter >= InputType.length) this.counter = 0;
    }
  }
}
</script>
