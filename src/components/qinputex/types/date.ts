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
  type: 'tel',
  mask: 'date',
  rules: ['date'],
  attaches: {
    append: {
      icon: 'event',
      popup: {
        ref: 'date',
        name: 'QDate',
        // attrs: {
        //   'default-year-month': getCurrentYM()
        // },
        on: {
          input(value: string, reason: string, detail: any, attach: any) {
            if (this.$attrs.smartClosed !== false && ['day', 'today'].indexOf(reason) !== -1) {
              attach.popup.hide();
            }
          },
        },
    },

    },
  },
};

register(DateInput);
