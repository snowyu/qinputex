import { InputType, register } from '../../consts';
import { InputHistoryItem, QInputHistory } from '../../qinput-history';

function indexOf(that: InputHistoryItem[], aValue: string): number {

  for (let i = 0; i < that.length; i++) {
    let item = that[i];
    if (item) {
      if (typeof item !== 'string') { item = item.value; }
      if (item === aValue) { return i; }
    }
  }
  return -1;
}

export const SearchInput: InputType = {
  name: 'search',
  type: 'text',
  attaches: {
    after: {
      icon: 'search',
      click() {
        const that = this as any;
        const value = that.iValue;
        const vHistory = that.$attrs['q-input-history'] && that.$attrs['q-input-history'].history;
        if (value) {
          if (vHistory && indexOf(vHistory, value) === -1) {
            vHistory.unshift(value);
          }
          that.$emit('search', value);
        }
      },
    },
    bottom: {
      name: QInputHistory,
      props: {
        //
      },
      on: {
        click(text: string, index: number) {
          this.iValue = text;
        },
      },
    },
  },
};

register(SearchInput);
