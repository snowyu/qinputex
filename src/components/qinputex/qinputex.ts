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

import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { VNode, CreateElement } from 'vue';
import { QBtn, QIcon, QPopupProxy, QCard, QCardSection, QToolbar, QToolbarTitle } from 'quasar';

import {
  NativeInputType, InputPopupObject, InputPopup, InputAttach, InputAttaches, InputType,
  InputAttachName, InputAttachNames,
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
export class QInputEx extends Vue {
  @Prop(String) icon!: string;
  @Prop() value!: string;
  @Prop({default: 'text', type: String}) type!: string;
  // @Prop(String) mask!: string;
  // @Prop() rules!: null|[string];

  iValue : null|string = null;
  iType: null|InputType = null;
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
    this.iType = null;
    this.rules = null;
    this.nativeType = 'text';
    this.attaches = {};
    const vInput: any = this.$refs.inputBox;
    if ( vInput && vInput.resetValidation) {
      vInput.resetValidation();
    }
  }

  cloneType(aType: InputType) {
    this.iType = aType;
    if (aType.mask) this.mask = aType.mask;
    if (aType.rules) this.rules = aType.rules;
    this.nativeType = aType.type;
    const vAttaches: any = this.attaches;
    if (aType.attaches)
      Object.keys(aType.attaches).forEach((attachName)=>{
        const src: any = aType.attaches;
        if (Array.isArray(src[attachName])) {
          vAttaches[attachName] = src[attachName].map((item:any)=>Object.assign({}, item));
        } else {
          vAttaches[attachName] = Object.assign({}, src[attachName]);
        }
      })
  }

  @Watch('type')
  typeChanged(value: string) {
    const vInputType = GRegisteredTypes[value];
    if (!vInputType) throw new Error(`The input '${value}' type is not exists`);
    this.clearType();
    this.cloneType(vInputType);
  }

  getPopupComponent(popup?: InputPopup) {
    return (typeof popup === 'object') ? popup.name : popup;
  }

  getComponent() {
    return this.nativeType === 'select' ? 'QSelect' : 'QInput';
  }

  // render helper functions:
  __getPopup(h: CreateElement, attach: InputAttach): VNode {
    const toValue = (attach.popup as any).toValue;
    const vValue = typeof toValue === 'function' ? toValue.call(this, this.iValue) : this.iValue;
    const popupAttrs:any = Object.assign({value: vValue, filled: true}, this.$attrs);
    const vComp = this.getPopupComponent(attach.popup);
    if (typeof attach.popup !== 'string' && attach.popup!.attrs) {
      Object.assign(popupAttrs, (attach.popup as any).attrs)
    }
    const vCaption = (attach.popup as any).caption || this.type;
    const onInput = (attach.popup as any)['@input'];
    // type: 'dialog',
    // breakpoint: 800, maxHeight: '99vh', cover: false
    return h(QPopupProxy, {props: {maxHeight: '100vh', breakpoint: 800}}, [
      //, 'max-height':'480px'
      //{staticStyle: {'width': '100%', 'height': '800px'}},
      h(QCard, [
        h(QToolbar, [
          h(QBtn, {props:{flat: true, round: true, icon: attach.icon}}),
          h(QToolbarTitle, this.$t('Please select', {type: this.$t(vCaption)}) as string),
          // h(QBtn, {
          //   props:{flat: true, dense: true, color: "secondary", label:this.$q.lang.label.ok, icon: 'done'},
          //   directives: [{name: 'close-dialog'}]
          // }),
          h(QBtn, {
            props:{flat: true, round: true, color: "secondary", icon: 'close'},
            directives: [{name: 'close-dialog'}]
          }),
        ]),
        h(QCardSection, [
          h(vComp, {
            props: popupAttrs,
            on: {
              input: (value:any)=> {
                if (typeof onInput === 'function') {
                  onInput.call(this, value);
                } else {
                  this.iValue = value;
                }
              }
            }
          })
        ]),
      ])
    ])
  }
  __getAttach(h: CreateElement, attach: InputAttach): VNode {
    let result:any;
    if (attach.icon || attach.caption) {
      const attrs = Object.assign({flat: true, dense: true}, attach.attrs);
      const on: any = {};
      const vClick = attach.click;
      if (attach.icon) attrs.icon = attach.icon;
      if (attach.caption) attrs.label = attach.caption;
      if (vClick) on.click = (e: MouseEvent)=> vClick.call(this, e);
      if (attach.popup) {
        result = h(QBtn, {props:attrs, on}, [this.__getPopup(h, attach)]);
      } else {
        result = h(QBtn, {props:attrs, on});
      }
    }
    return result;
  }

  render(h: CreateElement): VNode {
    const defaultAttrs = {
      filled: true, mask: this.mask, rules: this.rules, type: this.nativeType,
      value: this.iValue,
    };
    const vComp = this.getComponent();
    const props = Object.assign({}, defaultAttrs, this.$attrs);
    const scopedSlots: any = {};
    const that = this;
    const onInput = this.iType!['@input'];
    InputAttachNames.forEach((name: any)=>{
      genAttach(name)
    })

    return h(vComp, {
      ref: 'inputBox',
      props,
      on: {
        input: (value: any)=> {
          if (typeof onInput === 'function') {
            onInput.call(that, value)
          } else {
            this.iValue = value;
          }
        },
      },
      scopedSlots,
    });

    function genAttach(name: InputAttachName) {
      let vAttach: any = that.attaches[name];
      const vSlot: any = that.$scopedSlots[name];
      if (vAttach || vSlot) {
        scopedSlots[name] = (props: any) => {
          const result: any = [];
          if (vAttach) {
            if (!Array.isArray(vAttach)) vAttach = [vAttach];
            // result.concat(vAttach.map((item: InputAttach) => that.__getAttach(h, item)))
            vAttach.forEach((item: InputAttach) => {
              result.push(that.__getAttach(h, item));
            });
          }
          if (vSlot) result.push(vSlot(props));
          return result;
        }
      }
      }
  }

}
