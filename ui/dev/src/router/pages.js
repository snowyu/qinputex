/*
 * Export files list for /pages folder
 */

function kebabCase (str) {
  const result = str.replace(
    /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
    match => '-' + match.toLowerCase()
  )
  return (str[0] === str[0].toUpperCase())
    ? result.substring(1)
    : result
}

function slugify (str) {
  return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
}

const pages = [
  { file: 'TestQInputEx', title: 'TestQInputEx.vue', path: slugify(kebabCase('TestQInputEx')) },
  { file: 'TestDynamicInputEx', title: 'TestDynamicInputEx.vue', path: slugify(kebabCase('TestDynamicInputEx')) }
]

export default pages
