import { InputType, register } from '../consts';

export const TimeInput: InputType = {
  name: 'fulltime',
  type: 'text',
  mask: 'fulltime',
  rules: ['fulltime'],
  attaches: {
    append: {
      icon: 'access_time',
      popup: {
        name: 'QTime',
        attrs: {
          'with-seconds': true,
        },
      },

    },
  },
};

register(TimeInput);
