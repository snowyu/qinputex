export const PASSWORD_INPUT_TYPE = {
  name: 'password',
  type: 'password',
  attaches: {
    'before': {
      icon: 'vpn_key',
    },
    'append': {
      icon: 'visibility',
      click: function(e, { nativeType, attaches }) {
        const isVisiblePwd = nativeType.value === 'text';
        nativeType.value = isVisiblePwd ? 'password' : 'text';
        attaches.value.append.icon = isVisiblePwd ? 'visibility' : 'visibility_off';
      }
    }
  }
};
export default PASSWORD_INPUT_TYPE;
