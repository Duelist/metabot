/**
 * Creates a tagged template literal function.
 *
 * @param {String[]} strings Strings in template literal.
 * @param {String} keys Keys of values to replace in literal.
 *
 * @return {Function}
 */
function template(strings, ...keys) {
  return (...values) => {
    let dict = values[values.length - 1] || {}
    let result = [strings[0]]
    keys.forEach(function(key, i) {
      let value = Number.isInteger(key) ? values[key] : dict[key]
      result.push(value, strings[i + 1])
    })
    return result.join('')
  }
}

module.exports = template
