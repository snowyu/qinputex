import { InputType, register } from '../consts';

export const TimeInput: InputType = {
  name: 'time',
  type: 'tel',
  mask: 'time',
  rules: ['time'],
  attaches: {
    append: {
      icon: 'access_time',
      popup: {
        ref: 'time',
        name: 'QTime',
      },

    },
  },
};

register(TimeInput);
