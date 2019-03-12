<!--
高级文本输入框控件 The Advance Text QInputEx Component

主要用于单行输入控件： 可在输入框前和输入框后增加图标和其它信息。
增加位置是输入框前两个(before, prepend)，输入框后两个(append, after)
这个称为挂件（attach）

before/after: 在输入框外面， append/prepend: 在输入框里面。

输入框可以定制 mask, 以及校验内容。

终极目标：
可以注册各种输入类型，动态改变输入类型，即可进行各种类型的输入。

挂件（attach）:可以有文字，图标，可以点击或者popup.
简单点，用btn作为挂件，图标文字都可以加上。抽象点，就是一个slot。

AbstractInputAttach:

* 如果是一个slot，那么就是nothing.

InputAttach:

* icon: string
* caption: string
* click: Function
* popup: String|Object, the Component name to popup.
  * name: the Component name to popup.
  * the attributes to pass through into popup component.

InputType:

* name: register type name
* type: org input type.
* mask?:
* rules?:
* attaches:
  * before,after, prepend/append: InputAttach

-->

<template lang="pug">
  mixin showicon(icon)
    q-icon.cursor-pointer(:name=icon+'.name' v-if=icon+'.name'
      @click='iconClick(' + icon + '.click)'
    )
      //- transition-show="flip-up" transition-hide="flip-down"
      q-popup-proxy(v-if=icon+'.component')
        q-card
          q-toolbar
            q-btn(flat round :icon=icon+'.name')
            q-toolbar-title {{$t('Please select', {type: $t(type)})}}
            q-btn(icon="done" color="secondary"
              :label="$q.lang.label.ok" v-close-dialog
            )
            //- @click="$emit('input', iValue)"
            //- q-btn(flat round dense icon="close" v-close-dialog)
          q-card-section
            component(
              :is=icon+'.component' v-bind=icon+'.attrs' v-model="iValue" :default-year-month="getCurrentYM()"
            )

  component(
    filled
    ref="inputBox"
    :is="getComponent()" v-bind="$attrs" v-model="iValue" bottom-slots :type="getInputType()"
    :mask="mask" :rules="rules"
  )
    template(v-slot:before v-if="iconBefore.name || $slots.before")
      +showicon('iconBefore')
      slot(name="before")
    template(#prepend v-if="iconPrepend.name || $slots.prepend")
      +showicon('iconPrepend')
      slot(name="prepend")
    template(#append v-if="iconAppend.name || $slots.append")
      +showicon('iconAppend')
      slot(name="append")
    template(#after v-if="iconAfter.name || $slots.after")
      +showicon('iconAfter')
      slot(name="after")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator';

type InputType = 'password' | 'text' | 'textarea' | 'email' | 'search' | 'tel' | 'file' | 'number' | 'url' | 'select' | 'date' | 'time' | 'fulltime' | 'color';

interface IIconOnInput {
  name?: string;
  component?: string;
  attrs?: object;
  click?: ()=>void;
  mask?: string;
  rules?: [string|Function];
  onChanged?: (v:any)=>void;
}

function padStr(value: number, size: number): string {
    var s = String(value);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

/**
 * The Generanl Input Component
 * text can be typed or selected.
 *
 */

@Component({
  components: {
    // Selector,
  }
  // inheritAttrs: false,
  // subscriptions: function(): Observables {return {
  //   ready$: this.device.ready$
  // }}
})
export default class QInputEx extends Vue {
  @Prop(String) icon!: string;
  @Prop() value!: string;
  @Prop({default: 'text', type: String}) type!: InputType;
  // @Prop(String) mask!: string;
  // @Prop() rules!: null|[string];

  isVisiblePwd = false;
  iconBefore: IIconOnInput = {};
  iconPrepend: IIconOnInput = {};
  iconAppend: IIconOnInput = {};
  iconAfter: IIconOnInput = {};
  iValue : null|string = null;
  mask = '';
  rules: null|[string] = null;

  created() {
    this.iValue = this.value;
    this.typeChanged(this.type);
  }

  @Watch('iValue')
  iValueChanged(value: any) {
    this.$emit('input', value);
  }

  clearType() {
    this.iValue = '';
    this.mask = '';
    this.rules = null;
    this.iconBefore = {};
    this.iconPrepend = {};
    this.iconAppend = {};
    this.iconAfter  = {};
    const vInput: any = this.$refs.inputBox;
    if ( vInput && vInput.resetValidation) {
      vInput.resetValidation();
    }
  }

  @Watch('type')
  typeChanged(value: string) {
    console.log('typeChanged', value)
    this.clearType();
    switch (this.type) {
      case 'password':
        this.iconBefore.name = 'vpn_key';
        this.iconAppend.name = 'visibility';
        this.isVisiblePwd = false;
        this.iconAppend.click = ()=>{
          this.isVisiblePwd = !this.isVisiblePwd;
          this.iconAppend.name = this.isVisiblePwd ? 'visibility_off' : 'visibility';
        }
        break;
      case 'date':
        this.iconAppend.name = 'event';
        this.iconAppend.component = 'QDate';
        this.mask = 'date';
        this.rules = ['date'];
        break;
      case 'time':
        this.iconAppend.name = 'access_time';
        this.iconAppend.component = 'QTime';
        this.mask = 'time';
        this.rules = ['time'];
        break;
      case 'fulltime':
        this.iconAppend.name = 'access_time';
        this.iconAppend.component = 'QTime';
        this.iconAppend.attrs = {'with-seconds': true};
        this.mask = 'fulltime';
        this.rules = ['fulltime'];
        break;
      case 'color':
        this.iconAppend.name = 'colorize';
        this.iconAppend.component = 'QColor';
        break;
      case 'email':
        this.iconPrepend.name = 'email';
        break;
      case 'url':
        this.iconPrepend.name = 'link';
        break;
      case 'tel':
        this.iconPrepend.name = 'phone';
        break;

      default:
        break;
    }
  }

  iconClick(evt: ()=>void) {
    if (evt) {evt.call(this)}
  }

  onInput(value: string) {
    this.iValue = value;
  }

  onInputOk(value:string) {
    this.iValue = value;
  }

  getComponent() {
    return this.type === 'select' ? 'QSelect' : 'QInput';
    // if (this.type == 'select') {
    //   return 'QSelect'
    // } else {
    //   return 'QInput'
    // }
  }

  getCurrentYM() {
    const vDate = new Date();
    const result = vDate.getFullYear() + '/' + padStr(vDate.getMonth()+1, 2);
    return result;
  }

  getInputType() {
    let result = this.type;
    switch (result) {
      case 'password':
        if (this.isVisiblePwd) result = 'text';
        break;
      case 'date':
      case 'color':
      case 'time':
      case 'file':
        result = 'text';
        break;

      default:
        break;
    }
    return result;
  }
}
</script>

<style lang="stylus">
// https://quasar-framework.org/components/stylus-variables.html
// @import '~quasar-variables'

</style>
