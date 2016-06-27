var Ajv = require('ajv')
var _   = require('lodash')

var ajv = new Ajv({ useDefaults: true })



/**
 * Returns a set of functions used to validate a value.
 * @param {Any} value Value to be validated.
 * @return {Object}
 */
function validate(value) {

  if (!value) {
    return
  }

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

    var validationSchema = {
      properties,
      type : 'object'
    }

    validationSchema = transformValidationSchema(validationSchema)

    var validator = ajv.compile(validationSchema)
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
 *
 * @param {Validator} validator
 * @param {Any} value Value to be validated.
 *
 * @return {Any}
 *
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



/**
 * Transforms validation schema for compilation.
 * @param {Object} schema Schema to be transformed.
 * @return {Object}
 */
function transformValidationSchema(schema) {

  var updatedSchema = schema

  // Set required properties
  var requiredProperties = _.map(updatedSchema.properties, (property, name) => {

    var requiredProperty
    if (property.required && property.required === true) {
      requiredProperty = name
      delete property.required
    }

    return requiredProperty

  })

  requiredProperties = _.compact(requiredProperties)

  if (!_.isEmpty(requiredProperties)) {
    updatedSchema.required = requiredProperties
  }

  return updatedSchema

}



module.exports = validate
