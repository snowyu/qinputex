import { register, InputType } from '../consts';

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
  const tzoffset = aDate.getTimezoneOffset() * 60000; //offset in milliseconds
  const result = (new Date(aDate.valueOf() - tzoffset)).toISOString().slice(0, -1);
  return result;
}

function mergeTime(that: any, aTime: string) {
  const v = new Date(that.iValue || 0);
  const vTime: any = aTime.split(':').map(i=>parseInt(i, 10));
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
  type: 'text',
  // mask: 'date',
  // rules: ['date'],
  // '@input': function(value: string) {

  // },
  attaches: {
    'append': [
      {
        icon: 'event',
        popup: {
          name: 'QDate',
          caption: 'date',
          'toValue': function(value:any) {
            // convert the value of the input box to the popup component
            let result: any = value;
            if (result) {
              result = result.split('T');
              if (result.length) {
                result = result[0].replace(/-/g, '/')
              }
            }
            return result;
          },
          '@input': function(value: string) {
            //convert the value of popup to the input.
            const that: any = this;
            if (value) that.iValue = mergeDate(that, value);
          },
        }
      },
      {
        icon: 'access_time',
        popup: {
          name: 'QTime',
          caption: 'time',
          'toValue': function(value:any) {
            let result: any = value;
            if (result) {
              result = result.split('T');
              if (result.length > 1) {
                result = result[1];
              }
            }
            return result;
          },
          '@input': function(value: string) {
            const that: any = this;
            if (value) that.iValue = mergeTime(that, value);
          },
        }
      },
    ],
  }
}

register(DateTimeInput);
