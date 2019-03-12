import { register, InputType } from '../consts';

register({
  name: 'email',
  type: 'email',
  attaches: {
    prepend: {
      icon: 'email',
    }
  }
});

register({
  name: 'url',
  type: 'url',
  attaches: {
    prepend: {
      icon: 'link',
    }
  }
});

register({
  name: 'tel',
  type: 'tel',
  attaches: {
    prepend: {
      icon: 'phone',
    }
  }
});

