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
        // Toggle password visibility
        const vIsVisiblePwd = this.isVisiblePwd = !this.isVisiblePwd;
        // Update icon and input type based on visibility state
        this.attaches.append.icon = vIsVisiblePwd ? 'visibility_off' : 'visibility';
        this.nativeType = vIsVisiblePwd ? 'text' : 'password';
      },
    },
  },
};

register(PasswordInput);
