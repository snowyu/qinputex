export type NativeInputType = 'password' | 'text' | 'textarea' | 'email' | 'search' | 'tel' | 'file' | 'number' | 'url' | 'select' | 'date' | 'time';

export interface InputPopupObject {
  name: string; // the Component name to popup
  caption?: string;
  attrs?: any;
  '@input'?: Function;
  'toValue'?: Function;
}

export type InputPopup = string|InputPopupObject;

export interface InputComponentAttach {
  name: string;
  props?: any;
  attrs?: any;
  on?: any;
}

export interface InputIconAttach {
  icon?: string;
  caption?: string;
  click?: Function;
  popup?: InputPopup;
  attrs?: any;
}

// export type InputAttach = InputIconAttach | InputComponentAttach;
export interface InputAttach extends InputIconAttach {
  name?: string;
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
  rules?: [string|Function];
  attaches?: InputAttaches;
  '@input'?: Function;
}

export const GRegisteredTypes: {[name: string]: InputType}  = {}

export function register(aType: InputType) {
  GRegisteredTypes[aType.name] = aType;
}

export function unregister(aTypeName: string) {
  delete GRegisteredTypes[aTypeName];
}
