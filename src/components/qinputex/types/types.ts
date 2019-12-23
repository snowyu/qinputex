import { InputType, register } from '../consts';

register({
  name: 'email',
  type: 'email',
  attaches: {
    before: {
      icon: 'email',
    },
  },
});

register({
  name: 'url',
  type: 'url',
  attaches: {
    before: {
      icon: 'link',
    },
  },
});

register({
  name: 'tel',
  type: 'tel',
  attaches: {
    before: {
      icon: 'phone',
    },
  },
});
