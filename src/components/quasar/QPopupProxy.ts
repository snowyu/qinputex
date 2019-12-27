import { QPopupProxy as Comp } from 'quasar';
import * as tsx from 'vue-tsx-support';

interface Props {
  breakpoint?: number|string;
  target?: boolean | string;
  contextMenu?: boolean;
}

interface ScopedSlots {
  default: any;
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

export const QPopupProxy = tsx.ofType<Props, Events, ScopedSlots>().convert(Comp);
