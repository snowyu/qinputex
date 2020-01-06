import { VueConstructor } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

export type NativeInputType = 'password' | 'text' | 'textarea' | 'email' | 'search' | 'tel' |
  'file' | 'number' | 'url' | 'select' | 'date' | 'time';

export type TInputFunc = (value: any) => void;
export type TValueFunc = (value: any) => any;
export type TClickEvent = (evt: MouseEvent) => void;
export type TRuleFunc = (value: any) => boolean|string;

export interface InputPopupObject {
  name: string; // the Component name to popup
  ref?: string;
  caption?: string;
  attrs?: any;
  '@input'?: TInputFunc;
  'toValue'?: TValueFunc;
}

export type InputPopup = string|InputPopupObject;

export interface InputComponentAttach {
  name: string|VueConstructor<Vue>;
  props?: any;
  attrs?: any;
  on?: any;
}

export interface InputIconAttach {
  icon?: string;
  caption?: string;
  click?: TClickEvent;
  popup?: InputPopup;
  attrs?: any;
}

// export type InputAttach = InputIconAttach | InputComponentAttach;
export interface InputAttach extends InputIconAttach {
  name?: string|VueConstructor<Vue>;
  props?: any;
  on?: any;
  isAfter?: boolean;
}

export type InputAttachName = 'before' | 'after' | 'prepend' | 'append' | 'top' | 'bottom';
export const InternalInputAttachNames = ['before' , 'after' , 'prepend' , 'append'];
export const ExternalInputAttachNames = ['top' , 'bottom'];

export interface InputAttaches {
  before?: InputAttach|InputAttach[];
  after?: InputAttach|InputAttach[];
  prepend?: InputAttach|InputAttach[];
  append?: InputAttach|InputAttach[];
  top?: InputAttach|InputAttach[];
  bottom?: InputAttach|InputAttach[];
}

export interface InputType {
  name: string;
  type: NativeInputType;
  value?: any; // the default value
  mask?: string;
  rules?: [string|TRuleFunc];
  attaches?: InputAttaches;
  '@input'?: TInputFunc;
  props?: any;
  on?: any;
  inValue?: (value: any) => any;
  outValue?: (value: any) => any;
}

export const GRegisteredTypes: {[name: string]: InputType}  = {};

export function register(aType: InputType) {
  GRegisteredTypes[aType.name] = aType;
}

export function unregister(aTypeName: string) {
  delete GRegisteredTypes[aTypeName];
}
