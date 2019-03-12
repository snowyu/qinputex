# Quasar Advance Input Component

The Quasar Advance Input Component iss used as single-line input box for date, time, password, color etc.

It can register other input types more easy. such as the date type for QDate:

```ts
import { register, InputType } from 'qinputex';
import QInputEx from 'qinputex';

const DateInput: InputType = {
  name: 'date',
  type: 'text',
  mask: 'date',
  rules: ['date'],
  attaches: {
    'append': {
      icon: 'event',
      popup: 'QDate',
    }
  }
}

register(DateInput);

```


