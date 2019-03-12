import { register, InputType } from '../consts';

const PasswordInput = {
  name: 'password',
  type: 'password',
  attaches: {
    'before': {
      icon: 'vpn_key',
    },
    'append': {
      icon: 'visibility',
      click: function() {
        this.isVisiblePwd = !this.isVisiblePwd;
        this.attaches.append.icon = this.isVisiblePwd ? 'visibility_off' : 'visibility';
        this.nativeType = this.isVisiblePwd ? 'text': 'password';
      }
    }
  }
}

register(PasswordInput);
