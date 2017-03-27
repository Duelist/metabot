let uuid   = require('uuid')
let rewire = require('rewire')



/**
 * Generate a random string with the provided length.
 *
 * @param {Number} [length=10] Length of the generated string.
 *
 * @return {String}
 */
function randomString(length) {

  let stringLength = length
  if (!stringLength) {
    stringLength = 10
  }

  return uuid.v4().replace(/-/g, '').slice(0, stringLength)

}



/**
 * Rewires a module with a path from root.
 *
 * @param {String} name Path from root.
 *
 * @return {Module}
 */
function rewireRoot(name) {
  let path = process.cwd() + '/' + name
  return rewire(path)
}



module.exports = {
  randomString,
  rewireRoot
}
