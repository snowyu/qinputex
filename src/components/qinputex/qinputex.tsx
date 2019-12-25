// // why can not merge in .d.ts file?
declare module 'quasar/dist/types/' {
  interface QVueGlobals {
    lang: any;
  }
}

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

import { CreateElement, VNode } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
// import { QBtn, QPopupProxy, QCard, QCardSection, QToolbar, QToolbarTitle } from 'quasar';
// import * as tsx from "vue-tsx-support";

import { QBtn, QCard, QCardSection, QPopupProxy, QToolbar, QToolbarTitle } from '../quasar';
import { hyphenate } from './hyphenate';

import {
  ExternalInputAttachNames,
  GRegisteredTypes, InputAttach, InputAttaches, InputAttachName,
  InputIconAttach, InputPopup, InputType,
  InternalInputAttachNames, register,
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
  @Prop(String) icon!: string;
  @Prop() value!: string;
  @Prop({default: 'text', type: [String, Object]}) type!: string|InputType;
  @Prop(Boolean) slotAfterAttach!: boolean;
  // @Prop(String) mask!: string;
  // @Prop() rules!: null|[string];

  protected iValue: null|string = null;
  protected iType: null|InputType = null;
  protected attaches: InputAttaches = {};
  protected nativeType: string = 'text';
  protected mask: string = '';
  protected rules: null|[string|Function] = null;

  created() {
    this.typeChanged(this.type);
    this.iValue = this.value;
  }

  @Watch('value')
  valueChanged(value: any) {
    this.iValue = value;
  }

  @Watch('iValue')
  iValueChanged(value: any) {
    this.$emit('input', value);
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
    if (aType.mask) { this.mask = aType.mask; }
    if (aType.rules) { this.rules = aType.rules; }
    this.nativeType = aType.type;
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
    const vInputType = typeof value === 'string' ? GRegisteredTypes[value] : value;
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
    const toValue = (attach.popup as any).toValue;
    const vValue = typeof toValue === 'function' ? toValue.call(this, this.iValue) : this.iValue;
    const popupAttrs: any = Object.assign({value: vValue, filled: true}, this.$attrs);
    const vComp = this.getPopupComponent(attach.popup);
    if (typeof attach.popup !== 'string' && attach.popup!.attrs) {
      Object.assign(popupAttrs, (attach.popup as any).attrs);
    }
    const vCaption = (attach.popup as any).caption || this.type;
    const onInput = (attach.popup as any)['@input'];
    // type: 'dialog',
    // breakpoint: 800, maxHeight: '99vh', cover: false
    return (
      <QPopupProxy maxHeight='100vh' breakpoint={800}>
        <QCard>
          <QToolbar>
            <QBtn flat={true} round={true} icon={attach.icon} />
            <QToolbarTitle>
              {this.$t('Please select', {type: this.$t(vCaption)}) as string}
            </QToolbarTitle>
            {/* <QBtn flat={true} dense={true} color="secondary" icon="done"
              label={this.$q.lang.label.ok}
              {...{directives: [{name: 'close-popup'}]}}
            /> */}
            <QBtn flat={true} round={true} color='secondary' icon='close'
              {...{directives: [{name: 'close-popup'}]}}
            />
          </QToolbar>
          <QCardSection>
            <vComp {...{props: popupAttrs}}
              onInput={(value: any) => {
                if (typeof onInput === 'function') {
                  onInput.call(this, value);
                } else {
                  this.iValue = value;
                }
              }}
            />
          </QCardSection>
        </QCard>
      </QPopupProxy>
    );
  }
  protected __getAttach(h: CreateElement, attach: InputAttach): VNode {
    let result: any;
    if (attach.name) {
      const vNodeData = {} as any;
      const vCompName = typeof attach.name  === 'string' ? attach.name : attach.name.name;
			// console.log('TCL: QInputEx -> vCompName', hyphenate(vCompName))
      const vCompAttrs = this.$attrs && this.$attrs[hyphenate(vCompName)];
      vNodeData.props = Object.assign({}, attach.props, vCompAttrs);
			// console.log('TCL: QInputEx -> vNodeData.props', vNodeData.props)
      vNodeData.attrs = Object.assign({}, attach.attrs, vCompAttrs);
			// console.log('TCL: QInputEx -> vNodeData.attrs', vNodeData.attrs)
      if (attach.on) {
        const vOn = {} as any;
        Object.keys(attach.on).forEach(name => {
          if (typeof attach.on[name] === 'function') {
            vOn[name] = attach.on[name].bind(this);
          }
        });
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
				// // console.log('TCL: QInputEx -> protected__genAttach -> name', name, result)

        return result;
      };
    }
  }

  protected __render(h: CreateElement): VNode {
    const defaultAttrs = {
      filled: true, mask: this.mask, rules: this.rules, type: this.nativeType,
      value: this.iValue,
    };
    const vComp = this.getComponent();
    const props = Object.assign({}, defaultAttrs, this.$attrs);
    const scopedSlots: any = {};
    const that = this;
    const onInput = this.iType!['@input'];
    InternalInputAttachNames.forEach((name: any) => {
      this.__genAttach(h, name, scopedSlots);
    });

    return h(vComp, {
      ref: 'inputBox',
      props,
      attrs: {placeholder: props.placeholder},
      on: {
        ...this.$listeners,
        input: (value: any) => {
          if (typeof onInput === 'function') {
            onInput.call(that, value);
          } else {
            this.iValue = value;
          }
        },
      },
      scopedSlots,
    });
  }

}
