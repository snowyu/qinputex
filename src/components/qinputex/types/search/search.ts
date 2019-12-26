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
  on: {
    keyup(this: any, event: KeyboardEvent) {
      if (event.keyCode === 13) {
        this.props.search();
      }
    },
  },
  props: {
    search(this: any) {
      const value = this.iValue;
      const vInputHis = this.$attrs['q-input-history'];
      const vHistory =  vInputHis && vInputHis.history;
      const vPinHistory = vInputHis && vInputHis.pinHistory;
      if (value) {
        if (vHistory && indexOf(vHistory, value) === -1 && (!vPinHistory || indexOf(vPinHistory, value) === -1)) {
          vHistory.unshift(value);
        }
        // console.log('search', value)
        this.$emit('search', value);
      }
    },
  },
  attaches: {
    after: {
      icon: 'search',
      click(this: InputType) {
        this.props.search();
      },
    },
    bottom: {
      name: QInputHistory,
      props: {
        //
      },
      on: {
        click(text: string, index: number) {
          if (text !== this.iValue) {
            this.iValue = text;
            // this.props.search();
          }
          this.focus();
        },
      },
    },
  },
};

register(SearchInput);
