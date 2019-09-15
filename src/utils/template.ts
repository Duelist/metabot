/**
 * Creates a tagged template literal function.
 */
function template(
  strings: TemplateStringsArray,
  ...keys: (string | number)[]
): Function {
  return (...values) => {
    const dict = values[values.length - 1] || {}
    const result = [strings[0]]
    keys.forEach(function(key, i) {
      const value = typeof key === 'number' ? values[key] : dict[key]
      result.push(value, strings[i + 1])
    })
    return result.join('')
  }
}

export default template
