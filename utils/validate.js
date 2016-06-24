var Ajv = require('ajv')
var _   = require('lodash')

var ajv = new Ajv({ useDefaults: true })



/**
 * Returns a set of functions used to validate a value.
 * @param {Any} value Value to be validated.
 * @return {Object}
 */
function validate(value) {
  return {
    has : createHas(value),
    isA : createIsA(value)
  }
}



/**
 * Creates a function that verifies an object's properties.
 * @param {Object} object Object to be validated.
 * @return {Function}
 */
function createHas(object) {

  return properties => {
    var validator = ajv.compile({ properties })
    return handleValidation(validator, object)
  }

}



/**
 * Creates a function that verifies a value's properties.
 * @param {Any} value Value to be validated.
 * @return {Function}
 */
function createIsA(value) {

  return type => {
    var validator = ajv.compile({ type })
    return handleValidation(validator, value)
  }

}



/**
 * Handle the validation of the value.
 * @param {Validator} validator
 * @param {Any} value Value to be validated.
 * @return {Any}
 * @throws {Error} If the object is invalid.
 */
function handleValidation(validator, value) {

  var isValid = validator(value)

  if (!isValid) {
    var errorMessages = _.map(validator.errors, error => `${error.keyword} ${error.message}`)
    throw new Error(errorMessages.join('/n'))
  }

  return value

}



module.exports = validate
