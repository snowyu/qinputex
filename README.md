# Quasar Advance Input Component

The Quasar Advance Input Component iss used as single-line input box for date, time, password, color etc.


## Usage

You should enable these quasar components before used(`quasar.conf.js`):

QBtn, QIcon, QPopupProxy, QCard, QCardSection, QToolbar, QToolbarTitle,
QInput, QSelect, QDate, QTime, QColor

and the quasar directive: `close-dialog`.

```ts
import { QInputEx } from 'qinputex';
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { VNode, CreateElement } from 'vue';

@Component({
  components: {
    QInputEx,
  }
})
export class MyApp extends Vue {
  //<q-input-ex type="color" value="#ff0000"/>
  render(h: CreateElement) {
    return h(QInputEx, {props:{type: 'color', value: '#ff0000'}})
  }
}
```

## Create a new input type

It can register other input types more easy. such as the date type for QDate:

```ts
import { QInputEx, register, InputType } from 'qinputex';

function padStr(value: number, size: number = 2): string {
  var s = String(value);
  while (s.length < size) {s = "0" + s;}
  return s;
}

function getCurrentYM() {
  const vDate = new Date();
  const result = vDate.getFullYear() + '/' + padStr(vDate.getMonth()+1, 2);
  return result;
}

export const DateInput: InputType = {
  name: 'date',
  type: 'text',
  mask: 'date',
  rules: ['date'],
  attaches: {
    'append': {
      icon: 'event',
      popup: {
        name: 'QDate',
        attrs: {
          'default-year-month': getCurrentYM()
        }
      }

    }
  }
}

const PasswordInput = {
  name: 'password',
  type: 'password',
  attaches: {
    'before': {
      icon: 'vpn_key',
    },
    'append': {
      icon: 'visibility',
      click: function() {
        this.isVisiblePwd = !this.isVisiblePwd;
        this.attaches.append.icon = this.isVisiblePwd ? 'visibility_off' : 'visibility';
        this.nativeType = this.isVisiblePwd ? 'text': 'password';
      }
    }
  }
}

register(DateInput);
register(PasswordInput);
```


