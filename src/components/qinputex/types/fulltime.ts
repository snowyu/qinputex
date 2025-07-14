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
          input(this: any, value: string, reason: string, detail: any, attach: any) {
            // For time picker, don't auto-close on input
            // User should manually close or use the close button
            // Only auto-close if explicitly requested
            const smartClosed = this.$attrs?.smartClosed;
            if (smartClosed === true && reason === 'close') {
              attach.popup.hide();
            }
          },
        },
      },
    },
  },
};

register(TimeInput);
