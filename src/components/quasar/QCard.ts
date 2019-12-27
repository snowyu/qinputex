import { QCard as Comp, QCardSection as CompSection } from 'quasar';
import * as tsx from 'vue-tsx-support';

interface Props {
  dark?: boolean;
  square?: boolean;
  flat?: boolean;
  bordered?: boolean;
}

interface SectionProps {
  align?: 'left' | 'center' | 'right' | 'between' | 'around';
  vertical?: boolean;
}

interface ScopedSlots {
  default: any;
}

interface Events {
}

export const QCard = tsx.ofType<Props, Events, ScopedSlots>().convert(Comp);

export const QCardSection = tsx.ofType<SectionProps, Events, ScopedSlots>().convert(CompSection);
