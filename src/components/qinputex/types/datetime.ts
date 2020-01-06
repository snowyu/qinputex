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

function tolocalISOString(aDate: Date) {
  const tzoffset = aDate.getTimezoneOffset() * 60000; // offset in milliseconds
  const result = (new Date(aDate.valueOf() - tzoffset)).toISOString().slice(0, -1);
  return result;
}

function mergeTime(that: any, aTime: string) {
  const v = new Date(that.iValue || 0);
  const vTime: any = aTime.split(':').map(i => parseInt(i, 10));
  v.setHours.apply(v, vTime);
  return tolocalISOString(v);
}

function mergeDate(that: any, aDate: string) {
  const v = new Date(that.iValue || 0);
  const vDate: any = aDate.split('/');
  vDate[1] = parseInt(vDate[1], 10) - 1;
  const vTime: any = [v.getHours(), v.getMinutes(), v.getSeconds(), v.getMilliseconds()];
  const result = new Date(vDate[0], vDate[1], vDate[2], vTime[0], vTime[1], vTime[2], vTime[3]);
  return tolocalISOString(result);
}

export const DateTimeInput: InputType = {
  name: 'datetime',
  type: 'tel',
  mask: '####-##-## ##:##:##',
  inValue(value: string) {
    // pass the ISODateTime value into the DateTime Component
    if (value) {
      const vDate = new Date(value);
      value = vDate.getFullYear() + '-' +
        ('0' + (vDate.getMonth() + 1)).slice(-2) + '-' +
        ('0' + vDate.getDate()).slice(-2) +
        ' ' +
        ('0' + vDate.getHours()).slice(-2) + ':' +
        ('0' + vDate.getMinutes()).slice(-2) + ':' +
        ('0' + vDate.getSeconds()).slice(-2);
    }
    return value;
  },
  outValue(value: string) {
    // convert the internal datetime string to ISO Date before emit input
    if (value) {
      const vDate = new Date(value);
      value = vDate.toISOString();
    }
    return value;
  },
  // rules: ['date'],
  // '@input': function(value: string) {

  // },
  attaches: {
    append: [
      {
        icon: 'event',
        popup: {
          ref: 'date',
          name: 'QDate',
          caption: 'date',
          attrs: {
            mask: 'YYYY-MM-DD HH:mm:ss',
          },
          on: {
            input(value: string, reason: string, detail: any, attach: any) {
              if (this.$attrs.smartClosed !== false && ['day', 'today'].indexOf(reason) !== -1) {
                attach.popup.hide();
              }
            },
          },
          /*
          'toValue'(value: any) {
            // convert the value of the input box to the popup component
            let result: any = value;
            if (result) {
              result = result.split('T');
              if (result.length) {
                result = result[0].replace(/-/g, '/');
              }
            }
            return result;
          },
          '@input'(value: string) {
            // convert the value of popup to the input.
            const that: any = this;
            if (value) { that.iValue = mergeDate(that, value); }
          },
          */
        },
      },
      {
        icon: 'access_time',
        popup: {
          ref: 'time',
          name: 'QTime',
          caption: 'time',
          attrs: {
            mask: 'YYYY-MM-DD HH:mm:ss',
          },
          on: {
            input(value: string, reason: string, detail: any, attach: any) {
              if (this.$attrs.smartClosed !== false) {
                attach.popup.hide();
              }
            },
          },
          /*
          toValue(value: any) {
            let result: any = value;
            if (result) {
              result = result.split('T');
              if (result.length > 1) {
                result = result[1];
              }
            }
            return result;
          },
          '@input'(value: string) {
            const that: any = this;
            if (value) { that.iValue = mergeTime(that, value); }
          },
          */
        },
      },
    ],
  },
};

register(DateTimeInput);
