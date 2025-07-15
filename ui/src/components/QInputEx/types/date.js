function padStr(value, size = 2) {
  var s = String(value);
  while (s.length < size) {s = "0" + s;}
  return s;
}

function getCurrentYM() {
  const vDate = new Date();
  const result = vDate.getFullYear() + '/' + padStr(vDate.getMonth()+1, 2);
  return result;
}

export const DATE_INPUT_TYPE = {
  name: 'date',
  type: 'text',
  mask: 'date',
  rules: ['date'],
  attaches: {
    'append': {
      icon: 'event',
      popup: {
        ref: 'date',
        name: 'QDate',
        attrs: {
          'default-year-month': getCurrentYM()
        },
        toValue: (iValue) => {
          // This function transforms the QInputEx's internal iValue before passing it to QDate.
          // For example, if iValue was a full datetime string, and QDate only needs the date part.
          // In this case, QDate can usually handle the string format directly, so we just pass it through.
          return iValue;
        },
        on: {
          'update:modelValue': function(value, reason, detail, { iValue, nativeType, attaches, popupRef, hidePopup }) {
            // close the popup.
            if (['day', 'today'].indexOf(reason) !== -1) hidePopup();
            // if you wanna change the value here:
            return value;
          }
        }
      }

    }
  }
};
export default DATE_INPUT_TYPE;
