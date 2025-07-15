import types from './types';

const GRegisteredTypes = {};

export const ExternalInputAttachNames = ['top', 'bottom', 'before', 'after'];
export const InternalInputAttachNames = ['prepend', 'append'];
export const InputAttachNames = [...ExternalInputAttachNames, ...InternalInputAttachNames];

export function register(aType) {
  if (aType && aType.name) {
    GRegisteredTypes[aType.name] = aType;
  }
}

export function getRegisteredTypes() {
  return GRegisteredTypes;
}

const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = (str) => str.replace(hyphenateRE, '-$1').toLowerCase();

Object.values(types).forEach(t => register(t));
