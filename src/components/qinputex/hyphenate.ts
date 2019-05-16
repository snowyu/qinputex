const hyphenateRE = /\B([A-Z])/g
export function hyphenate(str: string): string {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}
