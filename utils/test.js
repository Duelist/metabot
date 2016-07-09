let uuid = require('node-uuid')



/**
 * Generate a random string with the provided length.
 * @param {Number} [length=10] Length of the generated string.
 * @return {String}
 */
function randomString(length) {

  let stringLength = length
  if (!stringLength) {
    stringLength = 10
  }

  return uuid.v4().replace(/-/g, '').slice(0, stringLength)

}



module.exports = {
  randomString
}
