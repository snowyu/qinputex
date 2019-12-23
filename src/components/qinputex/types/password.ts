import { InputType, register } from '../consts';

const PasswordInput: InputType = {
  name: 'password',
  type: 'password',
  attaches: {
    before: {
      icon: 'vpn_key',
    },
    append: {
      icon: 'visibility',
      click() {
        const vIsVisiblePwd = (this as any).isVisiblePwd = !(this as any).isVisiblePwd;
        (this as any).attaches.append.icon = vIsVisiblePwd ? 'visibility_off' : 'visibility';
        (this as any).nativeType = vIsVisiblePwd ? 'text' : 'password';
      },
    },
  },
};

register(PasswordInput);
