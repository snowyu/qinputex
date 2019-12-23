import { InputType, register } from '../consts';

// function padStr(value: number, size: number = 2): string {
//   var s = String(value);
//   while (s.length < size) {s = "0" + s;}
//   return s;
// }

// function getCurrentYM() {
//   const vDate = new Date();
//   const result = vDate.getFullYear() + '/' + padStr(vDate.getMonth()+1, 2);
//   return result;
// }

export const DateInput: InputType = {
  name: 'date',
  type: 'text',
  mask: 'date',
  rules: ['date'],
  attaches: {
    append: {
      icon: 'event',
      popup: {
        name: 'QDate',
        // attrs: {
        //   'default-year-month': getCurrentYM()
        // }
      },

    },
  },
};

register(DateInput);
