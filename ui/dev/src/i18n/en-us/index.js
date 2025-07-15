// This is just an example,
// so you can safely delete all default props below
import defaultLocale from 'date-fns/locale/en-US';

defaultLocale.localize.dayNames = {
  today: 'today',
  yesterday: 'yesterday',
  current: 'this',
  last: 'last',
  next: 'next',
  beforeYesterday: 'the day before yesterday',
  tomorrow: 'tomorrow',
  afterTomorrow: 'the day after tomorrow',
  thisMonth: 'this month',
  lastMonth: 'last month',
  nextMonth: 'next month',
  thisYear: 'this year',
  lastYear: 'last year',
  nextYear: 'next year',
  thisWeek: 'this ',
  lastWeek: 'last ',
  nextWeek: 'next ',
}

const validation = {
  required: "“{propName}” is required",
  integer: "“{propName}” should be an integer",
  decimal: "“{propName}” should be a decimal",
  email: "“{propName}” is not a valid email",
  url: "“{propName}” is not a valid url",
  ipAddress: "“{propName}” is not a valid ipAddress",
  macAddress: "“{propName}” is not a valid macAddress",
  maxLength: "“{propName}” should be at most {max} count",
  minLength: "“{propName}” should be at least {min} count",
  minValue: "“{propName}” should be at least {min} value",
  maxValue: "“{propName}” should be at most {max} value",
}
export default {
  dateLocale: defaultLocale, // used by datefns
  validation,
  locale: 'en-us', // used by moment
  "Change language": "Change language",
  "date": "Date",
  "time": "Time",
  "fulltime": "Time",
  "color": "Color",
  "Language": "Language",
  "Ok": "Ok",
  "Login": "Login",
  "Register": "Register",
  "Select EMoji": "Select EMoji",
  "Submitting": "Submitting",
  "Next": "Next",
  "Password": "Password",
  "Password is required": "Password is required",
  "Please correct errors first": "Please correct errors first",
  "Please select": "Please Select {type}",
  "required": "required",
  "Remember me": "Remember me",
  "Version": "Version",
  "text": "Text",
  "textarea": "Text Area",
  "number": "Number",
  "date": "Date",
  "datetime": "Date and Time",
  "password": "Password",
  "search": "Search"
}
