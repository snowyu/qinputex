import { CreateElement, VNode } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

export interface IHistoryItem {
  value: string;
  icon?: string;
  iconRight?: string;
  color?: string;
  textColor?: string;
  dense?: boolean;
  square?: boolean;
  outline?: boolean;
  removable?: boolean;
}

export type InputHistoryItem = string|IHistoryItem;

@Component({
  components: {
  },
})
export class QInputHistory extends Vue {
  @Prop({type: Array}) history!: InputHistoryItem[];
  @Prop(Number) maxHistory!: number;
  @Prop({type: Array}) pinHistory!: InputHistoryItem[];
  protected items: InputHistoryItem[] = this.history;
  protected pinItems: InputHistoryItem[] = this.pinHistory;

  @Watch('history')
  onHistoryChanged(val: InputHistoryItem[]) {
    if (val && this.maxHistory && val.length > this.maxHistory) {
      val.length = this.maxHistory;
    }
    this.items = val;
  }
  @Watch('pinHistory')
  onPinHistoryChanged(val: InputHistoryItem[]) {
    if (val && this.maxHistory && val.length > this.maxHistory) {
      val.length = this.maxHistory;
    }
    this.pinItems = val;
  }

  add(aItem: InputHistoryItem) {
    this.items.unshift(aItem);
  }

  remove(index: number) {
    return this.items.splice(index, 1);
  }

  removeItem(aItems: InputHistoryItem[], index: number) {
    this.$emit('removed', aItems.splice(index, 1), aItems);
  }

  __getHistories(aItems: InputHistoryItem[], removable = true) {
    if (aItems && aItems.length) {
      return aItems.map((item: InputHistoryItem, index) => {
        const text = typeof item === 'string' ? item : item && item.value;
        const props = Object.assign({removable}, this.$attrs, item);
        delete props.value;
				// console.log('TCL: QInputHistory -> __getHistories -> props', props)
				// console.log('TCL: QInputHistory -> render -> this.$attrs', this.$attrs)
				// console.log('TCL: QInputHistory -> render -> this.$props', this.$props)
        return <q-chip {...{props}} clickable
          onRemove={() => this.removeItem(aItems, index)}
          onClick ={() => this.$emit('click', text, index, item)}
        >{text}</q-chip>;
      });
    }
  }

  render() {
    if (this.items) {
      return <div class='q-input-history q-gutter-xs'>
        {this.__getHistories(this.pinItems, false)}
        {this.__getHistories(this.items)}
      </div>;
    }
  }
}
