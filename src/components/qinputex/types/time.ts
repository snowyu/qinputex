import { register, InputType } from '../consts';

export const TimeInput: InputType = {
  name: 'time',
  type: 'text',
  mask: 'time',
  rules: ['time'],
  attaches: {
    'append': {
      icon: 'access_time',
      popup: {
        name: 'QTime',
      }

    }
  }
}

register(TimeInput);
