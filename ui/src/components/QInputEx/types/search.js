import { TEXT_INPUT_TYPE } from './text';
import QInputHistory from '../QInputHistory.vue';
// console.log('🚀 ~ file: search.js:3 ~ QInputHistory:', QInputHistory)

/**
 * search input type
 */
export const SEARCH_INPUT_TYPE = {
  ...TEXT_INPUT_TYPE,
  name: 'search',
  on: {
    keyup(event, { iValue, emit }) {
      if (event.keyCode === 13) {
        if (iValue.value) {
          emit('search', iValue.value);
        }
      }
    },
  },
  attaches: {
    append: {
      icon: 'search',
      click(e, { iValue, emit }) {
        if (iValue.value) {
          emit('search', iValue.value);
        }
      },
    },
    bottom: {
      name: QInputHistory,
      on: {
        click(text, index, { iValue, inputBox, emit }) {
          if (text !== iValue.value) {
            iValue.value = text;
          }
          inputBox.value.focus();
          emit('search', iValue.value);
        },
      },
    },
  },
};

export default SEARCH_INPUT_TYPE;
