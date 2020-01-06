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
      click(this: any) {
        const vIsVisiblePwd = this.isVisiblePwd = !this.isVisiblePwd;
        this.attaches.append.icon = vIsVisiblePwd ? 'visibility_off' : 'visibility';
        this.nativeType = vIsVisiblePwd ? 'text' : 'password';
      },
    },
  },
};

register(PasswordInput);
