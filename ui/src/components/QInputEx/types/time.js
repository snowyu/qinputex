
import { TEXT_INPUT_TYPE } from './text';

/**
 * time input type
 */
export const TIME_INPUT_TYPE = {
  ...TEXT_INPUT_TYPE,
  name: 'time',
  mask: 'time',
  rules: ['time'],
  attaches: {
    append: {
      icon: 'access_time',
      popup: {
        name: 'QTime',
        on: {
          'update:modelValue': function(value, reason, detail, { attrs, hidePopup }) {
            if (attrs.smartClosed !== false) {
              hidePopup();
            }
          }
        }
      }
    }
  }
};

export default TIME_INPUT_TYPE;
