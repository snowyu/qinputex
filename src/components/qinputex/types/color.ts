import { register, InputType } from '../consts';

export const ColorInput: InputType = {
  name: 'color',
  type: 'text',
  attaches: {
    'append': {
      icon: 'colorize',
      popup: {
        name: 'QColor',
      }

    }
  }
}

register(ColorInput);
