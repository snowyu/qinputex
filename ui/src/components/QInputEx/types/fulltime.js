import { TIME_INPUT_TYPE } from './time';

/**
 * fulltime input type
 */
export const FULLTIME_INPUT_TYPE = {
  ...TIME_INPUT_TYPE,
  name: 'fulltime',
  mask: 'fulltime',
  rules: ['fulltime'],
  attaches: {
    append: {
      ...TIME_INPUT_TYPE.attaches.append,
      popup: {
        ...TIME_INPUT_TYPE.attaches.append.popup,
        attrs: {
          'with-seconds': true,
        },
      },
    },
  },
};

export default FULLTIME_INPUT_TYPE;
