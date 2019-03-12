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

  onInput(value: string) {
    this.iValue = value;
  }

  getPopupComponent(popup?: InputPopup) {
    return (typeof popup === 'object') ? popup.name : popup;
  }

  getComponent() {
    return this.nativeType === 'select' ? 'QSelect' : 'QInput';
  }

  __getPopup(h: CreateElement, attach: InputAttach): VNode {
    const popupAttrs:any = {value: this.iValue};
    const vComp = this.getPopupComponent(attach.popup);
    if (typeof attach.popup !== 'string') {
      Object.assign(popupAttrs, (attach.popup as any).attrs)
    }
    return h(QPopupProxy, [
      h(QCard, [
        h(QToolbar, [
          h(QBtn, {attrs:{flat: true, round: true, icon: attach.icon}}),
          h(QToolbarTitle, this.$t('Please select', {type: this.$t(this.type)}) as string),
          h(QBtn, {
            attrs:{flat: true, color: "secondary", label:this.$q.lang.label.ok, icon: 'done'},
            directives: [{name: 'close-dialog'}]
          }),
        ]),
        h(QCardSection, [
          h(vComp, {
            props: popupAttrs,
            on: {
              input: (e:any)=> {
                if (typeof e === 'object' && e.target) {
                  this.iValue = e.target.value;
                } else {
                  this.iValue = e;
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
      const attrs = Object.assign({flat: true}, attach.attrs);
      const on: any = {};
      if (attach.icon) attrs.icon = attach.icon;
      if (attach.caption) attrs.label = attach.caption;
      if (attach.click) on.click = attach.click;
      if (attach.popup) {
        result = h(QBtn, {attrs, on}, [this.__getPopup(h, attach)]);
      } else {
        result = h(QBtn, {attrs, on});
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
    Object.keys(this.attaches).forEach((name: any)=>{
      getAttach(name)
    })

    return h(vComp, {
      ref: 'inputBox',
      props,
      on: {
        input: (e: any)=> {
          if (typeof e === 'object' && e.target) {
            this.iValue = e.target.value;
          } else {
            this.iValue = e;
          }
        },
      },
      scopedSlots,
    });

    function getAttach(name: InputAttachName) {
      const vAttach = that.attaches[name];
      if (vAttach) {
        scopedSlots[name] = (props: any) => {
          const result = [that.__getAttach(h, vAttach)];
          const vSlot: any = that.$scopedSlots[name];
          if (vSlot) result.push(vSlot(props));
          return result;
        }
      }
      }
  }

}
