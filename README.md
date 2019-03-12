# Quasar Advance Input Component

The Quasar Advance Input Component iss used as single-line input box for date, time, password, color etc.

It can register other input types more easy. such as the date type for QDate:

```ts
import { register, InputType } from 'qinputex';
import QInputEx from 'qinputex';

function padStr(value: number, size: number): string {
    var s = String(value);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

function getCurrentYM() {
  const vDate = new Date();
  const result = vDate.getFullYear() + '/' + padStr(vDate.getMonth()+1, 2);
  return result;
}

const DateInput: InputType = {
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

const PasswordInput: InputType = {
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



```


