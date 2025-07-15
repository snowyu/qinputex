import { TEXT_INPUT_TYPE } from './text';

/**
 * color input type
 */
export const COLOR_INPUT_TYPE = {
  ...TEXT_INPUT_TYPE,
  name: 'color',
  attaches: {
    append: {
      icon: 'colorize',
      popup: {
        name: 'QColor',
      },
    },
  },
};

export default COLOR_INPUT_TYPE;
