/*
高级文本输入框控件 The Advance Text QInputEx Component

主要用于单行输入控件： 可在输入框前和输入框后增加图标和其它信息。
增加位置是输入框前两个(before, prepend)，输入框后两个(append, after)
这个称为挂件（attach）

before/after: 在输入框外面， append/prepend: 在输入框里面。

输入框可以定制 mask, 以及校验内容。

目标：
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
*/

// import { QBtn, QPopupProxy, QCard, QCardSection, QToolbar, QToolbarTitle } from 'quasar';
import merge from 'lodash.merge';
import { QPopupProxy } from 'quasar';
import { CreateElement, VNode, VNodeData } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { hyphenate } from './hyphenate';

import {
  ExternalInputAttachNames,
  GRegisteredTypes, InputAttach, InputAttaches, InputAttachName,
  InputIconAttach, InputPopup, InputType,
  InternalInputAttachNames, register,
  TRuleFunc,
} from './consts';

register({name: 'text', type: 'text'});
register({name: 'textarea', type: 'textarea'});
register({name: 'number', type: 'number'});

const popRefPrefix = 'pop';

function bindObj(obj: any, that: any) {
  if (obj) {
    Object.keys(obj).forEach(k => {
      if (typeof obj[k] === 'function') {
        obj[k] = obj[k].bind(that);
      }
    });
  }
  return obj;
}

/**
 * The Advanced Input Component
 * text can be typed or selected.
 *
 */

@Component({
  components: {
    // Selector,
  },
  // inheritAttrs: false,
  // subscriptions: function(): Observables {return {
  //   ready$: this.device.ready$
  // }}
})
export class QInputEx extends Vue {

  get inputBox() {
    const inputBox: any = this.$refs.inputBox;
    return inputBox.$refs.input || inputBox.$refs.target;
  }

  get focused() {
    const input: any = this.$refs.inputBox;
    const inputbox = this.inputBox;
    const el = document.activeElement;
    return (inputbox && inputbox === el) || (el && el.id === input.targetUid);
  }

  // @Prop(String) icon!: string;
  @Prop() value!: string;
  /**
   * @property type string|InputType
   *   InputType: can customize InputType, or override exits InputType via name.
   */
  @Prop({default: 'text', type: [String, Object]}) type!: string|InputType;
  @Prop(Boolean) slotAfterAttach!: boolean;
  // @Prop(String) mask!: string;
  // @Prop() rules!: null|[string];

  protected iValue: null|string = null;
  protected iType: null|InputType = null;
  protected attaches: InputAttaches = {};
  protected nativeType: string = 'text';
  protected mask: undefined|string = '';
  protected rules: null|[string|TRuleFunc] = null;
  protected inValue?: (v: any) => any;
  protected outValue?: (v: any) => any;
  protected props: any;
  private mReason: any;
  private mDetail: any;

  created() {
    this.typeChanged(this.type);
    // this.iValue = this.value;
    this.valueChanged(this.value);
  }

  @Watch('value')
  valueChanged(value: any) {
    if (this.inValue) { value = this.inValue(value); }
    if (String(this.iValue) !== String(value)) {
      this.iValue = value;
    }
  }

  @Watch('iValue')
  iValueChanged(value: any) {
    if (this.outValue) { value = this.outValue(value); }
    if (String(value) !== String(this.value)) {
      this.$emit('input', value, this.mReason, this.mDetail);
    }
  }

  clearType() {
    this.iValue = '';
    this.mask = '';
    this.iType = null;
    this.rules = null;
    this.nativeType = 'text';
    this.attaches = {};
    this.resetValidation();
  }

  resetValidation() {
    const vInput: any = this.$refs.inputBox;
    if ( vInput && vInput.resetValidation) {
      this.$nextTick(() => vInput.resetValidation());
      // vInput.resetValidation();
    }
  }

  cloneType(aType: InputType) {
    this.iType = aType;
    this.mask = this.$attrs.mask || aType.mask;
    this.rules = (this.$attrs.rules as any) || aType.rules;
    this.inValue = aType.inValue;
    this.outValue = aType.outValue;
    this.nativeType = aType.type;
    // additional properties and methods for the InputType here.
    const vProps = this.props = aType.props;
    if (vProps) {
      bindObj(vProps, this);
    }
    const vAttaches: any = this.attaches;
    if (aType.attaches) {
      Object.keys(aType.attaches).forEach((attachName) => {
        const src: any = aType.attaches;
        if (Array.isArray(src[attachName])) {
          vAttaches[attachName] = src[attachName].map((item: any) => Object.assign({}, item));
        } else {
          vAttaches[attachName] = Object.assign({}, src[attachName]);
        }
      });
    }
    this.resetValidation();
  }

  @Watch('type')
  typeChanged(value: string|InputType) {
    const vInputType = typeof value === 'string' ? GRegisteredTypes[value] :
      value && value.name ? merge({}, GRegisteredTypes[value.name], value) : value;
    if (!vInputType) { throw new Error(`The input '${value}' type is not exists`); }
    this.clearType();
    this.cloneType(vInputType);
  }

  getPopupComponent(popup?: InputPopup) {
    return (typeof popup === 'object') ? popup.name : popup;
  }

  getComponent() {
    return this.nativeType === 'select' ? 'QSelect' : 'QInput';
  }

  focus() {
    this.inputBox.focus();
  }

  getPopup(aName: string) {
    return this.$refs[popRefPrefix + aName] as QPopupProxy;
  }

  render(h: CreateElement): VNode {
    const scopedSlots: any = {};
    ExternalInputAttachNames.forEach((name: any) => {
      this.__genAttach(h, name, scopedSlots);
    });
    const vSlotTop = scopedSlots.top;
    const vSlotBottom = scopedSlots.bottom;

    if (vSlotTop || vSlotBottom) {
      const result: any = [];
      if (vSlotTop) {
        result.push(h('div', {staticClass: `row q-field-${name}`}, vSlotTop()));
      }
      result.push(this.__render(h));
      if (vSlotBottom) {
        result.push(h('div', {staticClass: `row q-field-${name}`}, vSlotBottom()));
      }
      return h('div', {staticClass: 'q-field-ex'}, result);
    } else {
      return this.__render(h);
    }
  }

  // render helper functions:
  protected __getPopup(h: CreateElement, attach: InputIconAttach): VNode {
    const that = this;
    const vPopup: any = attach.popup;
    const toValue = vPopup.toValue;
    const vValue = typeof toValue === 'function' ? toValue.call(this, this.iValue) : this.iValue;
    // type: 'dialog',
    // breakpoint: 800, maxHeight: '99vh', cover: false
    // , 'max-height':'480px'
    // {staticStyle: {'width': '100%', 'height': '800px'}},
    const vPopupData: VNodeData = {
      props: {maxHeight: '100vh', breakpoint: 800},
    };
    const vCompAttrs: any = Object.assign({value: vValue, filled: true}, this.$attrs);
    const vComp = this.getPopupComponent(vPopup);
    const vCaption = vPopup.caption || this.iType!.name;
    const vOn = Object.assign({}, vPopup.on);
    const onInput = vOn.input || vPopup['@input'];
    delete vOn.input;
    bindObj(vOn, this);
    vOn.input = function(value: any, reason: any, detail: any) {
      if (typeof reason === 'object') {
        detail = reason;
        reason = '';
      }
      reason = reason || vPopup.ref || that.iType!.name;
      that.mReason = reason;
      that.mDetail = detail;
      if (typeof onInput === 'function') {
        const v: any = onInput.call(that, value, reason, detail, {
          attach,
          component: vCompEl.componentInstance,
          popup: vPopupEl.componentInstance,
        });
        if (v !== undefined) { value = v; }
      }
      that.iValue = value;
    };
    const vCompData: VNodeData = {
      props: vCompAttrs,
      on: vOn,
    };

    if (typeof vPopup === 'object') {
      if (vPopup.ref) {
        vPopupData.ref = popRefPrefix + vPopup.ref;
        vCompData.ref = vPopup.ref;
      }
      if (vPopup.attrs) {
        Object.assign(vCompAttrs, vPopup.attrs);
      }
    }
    const vCompEl = h(vComp, vCompData);
    const vPopupEl = h('QPopupProxy', vPopupData, [
      h('QCard', [
        h('QToolbar', [
          h('QBtn', {props: {flat: true, round: true, icon: attach.icon}}),
          h('QToolbarTitle', this.$t('Please select', {type: this.$t(vCaption)}) as string),
          // h(QBtn, {
          //   props:{flat: true, dense: true, color: "secondary", label:this.$q.lang.label.ok, icon: 'done'},
          //   directives: [{name: 'close-popup'}]
          // }),
          h('QBtn', {
            props: {flat: true, round: true, color: 'secondary', icon: 'close'},
            directives: [{name: 'close-popup'}],
          }),
        ]),
        h('QCardSection', [vCompEl]),
      ]),
    ]);
    return vPopupEl;
  }
  protected __getAttach(h: CreateElement, attach: InputAttach): VNode {
    let result: any;
    if (attach.name) {
      // custom attach component
      const vNodeData = {} as any;
      const vCompName = typeof attach.name  === 'string' ? attach.name : attach.name.name;
      const vCompAttrs = this.$attrs && this.$attrs[hyphenate(vCompName)];
      vNodeData.props = Object.assign({}, attach.props, vCompAttrs);
      vNodeData.attrs = Object.assign({}, attach.attrs, vCompAttrs);
      if (attach.on) {
        const vOn = Object.assign({}, attach.on);
        bindObj(vOn, this);
        vNodeData.on = vOn;
      }
      result = h(attach.name, vNodeData);
    } else if (attach.icon || attach.caption) {
      const attrs = Object.assign({flat: true, dense: true}, attach.attrs);
      const on: any = {};
      const vClick = attach.click;
      if (attach.icon) { attrs.icon = attach.icon; }
      if (attach.caption) { attrs.label = attach.caption; }
      if (vClick) { on.click = (e: MouseEvent) => vClick.call(this, e); }
      if (attach.popup) {
        result = h('QBtn', {props: attrs, on}, [this.__getPopup(h, attach)]);
      } else {
        result = h('QBtn', {props: attrs, on});
      }
    }
    return result;
  }

  protected __genAttach(h: CreateElement, name: InputAttachName, scopedSlots: any) {
    const that = this;
    let vAttach: InputAttach|InputAttach[]|undefined = that.attaches[name];
    const vSlot: any = that.$scopedSlots[name];
    if (vAttach || vSlot) {
      const vSlotAfterAttach = that.slotAfterAttach;
      scopedSlots[name] = (props: any) => {
        const result: any = [];
        if (vSlot && !vSlotAfterAttach) { result.push(vSlot(props)); }
        if (vAttach) {
          if (!Array.isArray(vAttach)) { vAttach = [vAttach]; }
          // result.concat(vAttach.map((item: InputAttach) => that.__getAttach(h, item)))
          vAttach.forEach((item: InputAttach) => {
            result.push(that.__getAttach(h, item));
          });
        }
        if (vSlot && vSlotAfterAttach) { result.push(vSlot(props)); }

        return result;
      };
    }
  }

  protected __render(h: CreateElement): VNode {
    const defaultAttrs = {
      filled: true, mask: this.mask, rules: this.rules, type: this.nativeType,
      // value: this.iValue,
    };
    const vComp = this.getComponent();
    const props = Object.assign({}, defaultAttrs, this.$attrs, {value: this.iValue});
    const scopedSlots: any = {};
    const that = this;
    const vOn = Object.assign({}, this.iType!.on, this.$listeners);
    const onInput = vOn.input || this.iType!['@input'];
    delete vOn.input;
    if (vOn) { bindObj(vOn, this); }
    if (typeof onInput === 'function') {
      vOn.input = function(value: any, reason: any, detail: any) {
        if (typeof reason === 'object') {
          detail = reason;
          reason = '';
        }
        reason = reason || 'inputBox';
        that.mReason = reason;
        that.mDetail = detail;
        if (typeof onInput === 'function') {
          const v = onInput.call(that, value, reason, detail, vInputBoxEl.componentInstance);
          if (v !== undefined) { value = v; }
        }
        that.iValue = value;
      };
    }
    InternalInputAttachNames.forEach((name: any) => {
      this.__genAttach(h, name, scopedSlots);
    });

    const vInputBoxEl = h(vComp, {
      ref: 'inputBox',
      props,
      attrs: {placeholder: props.placeholder},
      on: vOn,
      scopedSlots,
    });
    return vInputBoxEl;
  }

}
