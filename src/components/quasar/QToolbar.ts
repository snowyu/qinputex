import { QToolbar as Comp, QToolbarTitle as Title } from 'quasar';
import * as tsx from 'vue-tsx-support';

interface Props {
  inset?: boolean;
}

interface TitleProps {
  shrink?: boolean;
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

export const QToolbar = tsx.ofType<Props, Events, ScopedSlots>().convert(Comp);

export const QToolbarTitle = tsx.ofType<TitleProps, Events, ScopedSlots>().convert(Title);
