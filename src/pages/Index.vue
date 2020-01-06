<template lang="pug">
  q-page(class="flex flex-center")

    q-list(border separator)
      q-item
        //- q-item-section(avatar)
        //-   q-icon(name="input" color="primary")
        q-item-section
          q-input-ex(ref="i" :type="type" :value="myValue" @input="onInput" @search="onSearch"
            :q-input-history=`{
              icon: 'search', history: history,
              pinHistory:[
                {icon:'cake',value:'nice cake'},
                {icon:'phone',value:'telphone'},
              ],
              maxHistory: 3}`
            :with-seconds='type==="datetime"'
            :slots="{replaced: ['append']}"
          )
            template(v-slot:before)
              q-btn(flat :label='`${type}:`')
            template(v-slot:append)
              q-btn(label="append")
            template(v-slot:top)
              .q-gutter-xs
                q-chip(@click="doPrevClick" clickable color="primary" text-color="white" icon="prev")
                  | Prev
                q-chip(removable="" @click="doNextClick" clickable @remove="log('Icecream')" color="primary" text-color="white" icon="cake")
                  | On
                q-chip(removable="" color="teal" text-color="white" icon="cake")
                  | The
                q-chip(removable="" color="orange" text-color="white" icon="cake")
                  | Top
                q-chip(disable="" removable="" color="red" text-color="white" icon="cake")
                  | Slot
                q-chip(@click="doNextClick" clickable color="primary" text-color="white" icon="next")
                  | Next

        q-item-section(side)
          q-btn(@click="doNextClick" label="next")
      q-item
        q-item-section
          q-input-ex(type="datetime" todayBtn :smartClosed="false" value="2012-01-01T12:33:22" @input="log('dt=', $event)")
      q-item
        //- @click="$refs.custom.getPopup('date').show()"
        q-item-section
          q-input-ex(
            @input="log"
            ref="custom"
            :rules="[v => /\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/.test(v) || 'bad date']"
            mask="####-##-##T##:##:##"
            :type=`{
            name: 'custom',
            caption: 'date',
            type: 'tel',
            attaches: {
              prepend: [
                {
                  icon: 'event',
                  popup: {
                    ref: 'date',
                    name: 'QDate',
                    'caption': 'date',
                    attrs: {
                      todayBtn: true,
                      mask: 'YYYY-MM-DDTHH:mm:ss',
                    //   'default-year-month': getCurrentYM()
                    },
                    on: {
                      input(v, reason, detail, attach) {
                        if (['day', 'today'].indexOf(reason) !== -1) attach.popup.hide()
                      },
                    },
                  },
                },
                {
                  icon: 'access_time',
                  popup: {
                    ref: 'time',
                    'name': 'QTime',
                    'caption': 'time',
                    attrs: {
                      mask: 'YYYY-MM-DDTHH:mm:ss',
                      format24h: true,
                    },
                    on: {
                      input(v, reason, detail, attach) {
                        attach.popup.hide()
                      },
                    },
                  },
                }
              ],
              after: {
                icon: 'colorize',
                popup: {
                  name: 'QColor',
                  'caption': 'color',
                },
              },
            },
          }`)
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
    log(){console.log.apply(console, arguments)},
    onInput: (v)=>{
      console.log('input',v)
    },
    onSearch: (v)=>{
      console.log('search', v)
    },
    doPrevClick: function() {
      this.myValue = '';
      curr--;
      if (curr < 0) curr =  InputType.length - 1;
      this.type = InputType[curr];
    },
    doNextClick: function() {
      this.myValue = '';
      this.type = InputType[curr];
      curr++;
      if (curr >= InputType.length) curr = 0;
    }
  },
  name: "PageIndex"
};
</script>
