import { QBtn as Comp } from 'quasar';
import * as tsx from 'vue-tsx-support';

interface Props {
  ripple?: boolean | any;
  type?: string;
  to?: string | any;
  replace?: boolean;
  label?: string | number;
  icon?: string;
  iconRight?: string;
  round?: boolean;
  outline?: boolean;
  flat?: boolean;
  unelevated?: boolean;
  rounded?: boolean;
  push?: boolean;
  glossy?: boolean;
  size?: string;
  fab?: boolean;
  fabMini?: boolean;
  color?: string;
  textColor?: string;
  noCaps?: boolean;
  noWrap?: boolean;
  dense?: boolean;
  tabindex?: number | string;
  align?: string;
  stack?: boolean;
  stretch?: boolean;
  loading?: boolean;
  disable?: boolean;
  percentage?: number;
  darkPercentage?: boolean;
}

interface ScopedSlots {
  default: any;
  loading: any;
}

interface Events {
    // all memebers must be prefixed by 'on'
    onShow: (evt: any) => void;
    onHide: (evt: any) => void;
    // If event handler has only one parameter, you can specify parameter type as a shorthand.
    // For example, this is equivalent to `onError: (arg: { code: number, detail: string }) => void`
    onInput: { value: any };
    onBeforeShow: {evt: Event};
    onBeforeHide: {evt: Event};
}

export const QBtn = tsx.ofType<Props, Events, ScopedSlots>().convert(Comp);
