let Ajv = require('ajv')
let R   = require('ramda')

let ajv = new Ajv({ useDefaults: true })



/**
 * Returns a set of functions used to validate a value.
 * @param {Any} value Value to be validated.
 * @return {Object}
 */
function validate(value) {

  if (!value) {
    throw new Error('Value must exist.')
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

    let validationSchema = {
      properties,
      type : 'object'
    }

    validationSchema = transformValidationSchema(validationSchema)

    let validator = ajv.compile(validationSchema)
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
    let validator = ajv.compile({ type })
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

  let isValid = validator(value)

  if (!isValid) {

    let errorMessages = R.map(
      error => `${error.keyword} ${error.message}`,
      validator.errors
    )

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

  // Clone the schema
  let updatedSchema = R.clone(schema)

  // Set required properties
  let requiredProperties = R.compose(
    Object.getOwnPropertyNames,
    R.filter(value => value.required)
  )(updatedSchema.properties)

  // Remove required properties from values
  updatedSchema.properties = R.map(
    value => R.dissoc('required', value),
    updatedSchema.properties
  )

  // Update the schema with the required properties
  if (!R.isEmpty(requiredProperties)) {
    updatedSchema.required = requiredProperties
  }

  return updatedSchema

}



module.exports = validate
