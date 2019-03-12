import dateLocale from 'date-fns/locale/zh-CN';
// import 'moment/locale/zh-cn';

dateLocale.localize.dayNames = {
  today: '今天',
  yesterday: '昨天',
  current: '这',
  last: '上',
  next: '下',
  beforeYesterday: '前天',
  tomorrow: '明天',
  afterTomorrow: '后天',
  thisMonth: '本月',
  lastMonth: '上月',
  nextMonth: '下月',
  thisYear: '今年',
  lastYear: '去年',
  nextYear: '明年',
  thisWeek: '这',
  lastWeek: '上',
  nextWeek: '下',
}

dateLocale.localize.ordinalNumber = function(dirtyNumber, dirtyOptions) {
  var options = dirtyOptions || {};
  var unit = String(options.unit);
  // console.log('unit',options, dirtyNumber)
  const Units = {
    'year': '年',
    'quarter': '季度',
    'month': '月',
    'week': '周',
    'date': '日',
    'dayOfYear': '',
    'day': '日',
    'hour': '时',
    'minute': '分',
    'second': '秒'
  }

  // where `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
  // 'day', 'hour', 'minute', 'second'
  var number = Number(dirtyNumber);
  return number.toString() + Units[unit];
}

const validation = {
  required: "“{propName}”是必填项",
  integer: "“{propName}”应该是整数",
  decimal: "“{propName}”应该是小数",
  email: "“{propName}”不是合法的电子邮件",
  url: "“{propName}”不是合法的url",
  ipAddress: "“{propName}”不是合法的ip地址",
  macAddress: "“{propName}”不是合法的mac地址",
  maxLength: "“{propName}”的个数最多为{max}",
  minLength: "“{propName}”的个数至少为{max}",
  minValue: "“{propName}”的最小值应该是{min}",
  maxValue: "“{propName}”的最大值应该是{max}",
}
export default {
  dateLocale: dateLocale,
  validation,
  locale: 'zh-cn', //used by moment
  "APP_NAME": "我爱我家",
  "About": "关于",
  "already logined": "已登录",
  "Type a message": "在这里输入消息...",
	"Hello world !": "你好世界！",
	"Home": "我的家",
  "Cancel": "取消",
  "Can not connect to the server": "无法连接服务器",
  "Change language": "切换语言",
  "Check Login Name": "检查登录名",
  "Click 'OK' button after done": "完成后请点击“确定”按钮",
  "Contacts":"通讯录",
  "date": "日期",
  "time": "时间",
  "fulltime": "时间",
  "color": "颜色",
  "Family Events": "家事",
  "Genealogy": "家谱",
  "Language": "语言",
  "My Profile": "我的",
  "Ok": "确定",
  "Login": "登录",
  "Register": "注册",
  "Select EMoji": "选择表情",
  "Submitting": "提交中",
  "LoginName":"姓名",
  "LoginNameDesc":"点下划线这里输入姓名",
	"Logout": "注销",
  "Next": "下一步",
	"Password": "密码",
  "Password is required": "密码必须填写",
  "Please correct errors first": "请先纠正错误",
  "Please select": "请选择{type}",
	"Username": "用户名",
	"Username is required": "输入用户名必填",
  "Username or password incorrect": "用户名或密码不对",
  "required": "必填",
	"Remember me": "记住我",
	"Version": "版本"
}
