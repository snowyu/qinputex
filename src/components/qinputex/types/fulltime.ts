import { InputType, register } from '../consts';

export const TimeInput: InputType = {
  name: 'fulltime',
  type: 'tel',
  mask: 'fulltime',
  rules: ['fulltime'],
  attaches: {
    append: {
      icon: 'access_time',
      popup: {
        ref: 'time',
        name: 'QTime',
        attrs: {
          'with-seconds': true,
        },
        on: {
          input(value: string, reason: string, detail: any, attach: any) {
            if (this.$attrs.smartClosed !== false) {
              attach.popup.hide();
            }
          },
        },
      },
    },
  },
};

register(TimeInput);
