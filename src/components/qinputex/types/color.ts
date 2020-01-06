import { InputType, register } from '../consts';

export const ColorInput: InputType = {
  name: 'color',
  type: 'text',
  attaches: {
    append: {
      icon: 'colorize',
      popup: {
        ref: 'color',
        name: 'QColor',
      },
    },
  },
};

register(ColorInput);
