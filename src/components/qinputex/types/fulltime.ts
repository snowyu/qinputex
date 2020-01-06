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
      },

    },
  },
};

register(TimeInput);
