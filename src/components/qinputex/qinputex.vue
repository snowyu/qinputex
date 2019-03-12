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
  mixin showattach(attach)
    q-icon.cursor-pointer(:name=attach+'.icon' v-if=attach+'.icon'
      @click='iconClick(' + attach + '.click)'
    )
      //- transition-show="flip-up" transition-hide="flip-down"
      q-popup-proxy(v-if=attach+'.popup')
        q-card
          q-toolbar
            q-btn(flat round :icon=attach+'.icon')
            q-toolbar-title {{$t('Please select', {type: $t(type)})}}
            q-btn(icon="done" color="secondary"
              :label="$q.lang.label.ok" v-close-dialog
            )
            //- @click="$emit('input', iValue)"
            //- q-btn(flat round dense icon="close" v-close-dialog)
          q-card-section
            component(
              :is='getPopupComponent('+ attach+'.popup)' v-bind=attach+'.popup.attrs' v-model="iValue"
            )

  component(
    filled
    ref="inputBox"
    :is="getComponent()" v-bind="$attrs" v-model="iValue" :type="nativeType"
    :mask="mask" :rules="rules"
  )
    template(v-slot:before v-if="attaches.before || $slots.before")
      +showattach('attaches.before')
      slot(name="before")
    template(#prepend v-if="attaches.prepend || $slots.prepend")
      +showattach('attaches.prepend')
      slot(name="prepend")
    template(#append v-if="attaches.append || $slots.append")
      +showattach('attaches.append')
      slot(name="append")
    template(#after v-if="attaches.after || $slots.after")
      +showattach('attaches.after')
      slot(name="after")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator';

import {
  NativeInputType, InputPopupObject, InputPopup, InputAttach, InputAttaches, InputType,
  GRegisteredTypes, register, unregister
} from './consts';

register({name: 'text', type: 'text'});
register({name: 'textarea', type: 'textarea'});
register({name: 'number', type: 'number'});

/**
 * The Advanced Input Component
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
  @Prop({default: 'text', type: String}) type!: string;
  // @Prop(String) mask!: string;
  // @Prop() rules!: null|[string];

  iValue : null|string = null;
  attaches: InputAttaches = {};
  nativeType: string = 'text';
  mask: string = '';
  rules: null|[string|Function] = null;


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
    this.nativeType = 'text';
    this.attaches = {};
    const vInput: any = this.$refs.inputBox;
    if ( vInput && vInput.resetValidation) {
      vInput.resetValidation();
    }
  }

  cloneType(aType: InputType) {
    if (aType.mask) this.mask = aType.mask;
    if (aType.rules) this.rules = aType.rules;
    this.nativeType = aType.type;
    const vAttaches: any = this.attaches;
    if (aType.attaches)
      Object.keys(aType.attaches).forEach((attachName)=>{
        const src: any = aType.attaches;
        vAttaches[attachName] = Object.assign({}, src[attachName]);
      })
  }

  @Watch('type')
  typeChanged(value: string) {
    const vInputType = GRegisteredTypes[value];
    if (!vInputType) throw new Error(`The input '${value}' type is not exists`);
    this.clearType();
    this.cloneType(vInputType);
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

  getPopupComponent(popup: InputPopup) {
    return (typeof popup === 'string') ? popup : popup.name;
  }

  getComponent() {
    return this.nativeType === 'select' ? 'QSelect' : 'QInput';
    // if (this.type == 'select') {
    //   return 'QSelect'
    // } else {
    //   return 'QInput'
    // }
  }

}

</script>

<style lang="stylus">
// https://quasar-framework.org/components/stylus-variables.html
// @import '~quasar-variables'

</style>
