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
        attrs: {
          'today-btn': true,
          mask: 'YYYY/MM/DD',
        },
        on: {
          input(value: string, reason: string, detail: any, attach: any) {
            // In Quasar v2, we need to handle the popup close differently
            // The smartClosed logic is preserved but adapted for v2
            const attrs = (this as any).attrs || (this as any).$attrs || {};
            if (attrs.smartClosed !== false && ['day', 'today'].indexOf(reason) !== -1) {
              // For v2, we'll need to emit a close event instead
              attach.popup?.hide?.();
            }
          },
        },
    },

    },
  },
};

register(DateInput);
