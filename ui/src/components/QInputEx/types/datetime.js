import { TEXT_INPUT_TYPE } from './text';
import { format as formatDate, parse as parseDate } from 'date-fns';

function mergeTime(currentValue, aTime) {
  console.log('🚀 ~ file: datetime.js:5 ~mergeDate currentValue, aTime:', currentValue, aTime)
  if (!currentValue) {
    currentValue = new Date();
  }
  currentValue = formatDate(new Date(), 'yyyy-MM-dd');
  if (aTime) {
    currentValue = currentValue + ' ' + aTime;
    console.log('🚀 ~ file: datetime.js:12 ~ currentValue:', currentValue)
    currentValue = parseDate(currentValue, 'yyyy-MM-dd hh:mm', new Date())
  }
  console.log('🚀 ~ file: datetime.js:15 ~mergeTime result:', currentValue)
  return currentValue
}

function mergeDate(currentValue, aDate) {
  console.log('🚀 ~ file: datetime.js:14 ~mergeDate currentValue, aDate:', currentValue, aDate)
  if (!currentValue) {
    currentValue = new Date();
  }
  currentValue = formatDate(new Date(), 'HH:mm:ss');
  if (aDate) {
    currentValue = formatDate(aDate, 'yyyy-MM-dd') + ' ' + currentValue;
    return parseDate(currentValue, 'yyyy-MM-dd hh:mm:ss', new Date())
  }
  return currentValue
}

/**
 * datetime input type
 */
export const DATETIME_INPUT_TYPE = {
  ...TEXT_INPUT_TYPE,
  name: 'datetime',
  mask: '####-##-## ##:##:##',
  toDisplayValue(value) {
    console.log('🚀 ~ file: datetime.js:35 ~ toDisplayValue:', value)
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
  fromDisplayValue(value) {
    console.log('🚀 ~ file: datetime.js:44 ~ fromDisplayValue:', value)
    // convert the internal datetime string to ISO Date before emit input
    if (value) {
      const vDate = new Date(value);
      value = vDate.toISOString();
    }
    return value;
  },
  attaches: {
    append: [
      {
        icon: 'event',
        popup: {
          name: 'QDate',
          attrs: {
            mask: 'YYYY-MM-DD HH:mm:ss',
          },
          on: {
            'update:modelValue': function(value, reason, detail, { iValue, attrs, hidePopup }) {
              if (attrs.smartClosed !== false && ['day', 'today'].indexOf(reason) !== -1) {
                hidePopup();
              }
            },
          },
        },
      },
      {
        icon: 'access_time',
        popup: {
          name: 'QTime',
          attrs: {
            mask: 'YYYY-MM-DD HH:mm:ss',
          },
          // on: {
          //   'update:modelValue': function(value, reason, detail, { iValue, attrs, hidePopup }) {
          //     if (attrs.smartClosed !== false) {
          //       hidePopup();
          //     }
          //   },
          // },
        },
      },
    ],
  },
};

export default DATETIME_INPUT_TYPE;
