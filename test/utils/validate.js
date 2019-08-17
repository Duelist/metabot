let _ = require('lodash')

let validateUtil = requireRoot('utils/validate')

describe('@default', () => {
  test('returns validation functions in an object', () => {
    let functions = validateUtil({})
    let validateFunction = fn => {
      expect(typeof fn).toBe('function')
    }

    _.each(functions, validateFunction)
  })

  test('throws an error if no value was provided', () => {
    let isCaught = false

    try {
      validateUtil()
    } catch (err) {
      // Ensure the correct error message was given
      expect(err.message).toBe('Value must exist.')
      isCaught = true
    }

    // Ensure an error was thrown
    expect(isCaught).toBe(true)
  })
})

describe('#has', () => {
  test('validates an object', () => {
    // Create a test object
    let object = {
      one: 1,
      two: 'two',
    }

    // Validate the object with a schema
    validateUtil(object).has({
      one: {
        type: 'number',
      },
      two: {
        type: 'string',
      },
      three: {
        default: 3,
        type: 'number',
      },
    })

    // Ensure the modified object is correct
    expect(object).toEqual({
      one: 1,
      two: 'two',
      three: 3,
    })
  })

  test('throws an error when an object is invalid', () => {
    // Create a test object
    let object = { one: 1 }

    let isCaught = false

    try {
      // Validate the object with a schema
      validateUtil(object).has({
        one: { type: 'string' },
      })
    } catch (err) {
      // Ensure error message is correct
      expect(err.message).toBe('type should be string')
      isCaught = true
    }

    // Ensure an error was thrown
    expect(isCaught).toBe(true)
  })

  test('throws an error if a required value is not provided', () => {
    // Create a test object
    let object = {}

    let isCaught = false

    try {
      // Validate the object with a schema that has a required value
      validateUtil(object).has({
        test: {
          required: true,
          type: 'string',
        },
      })
    } catch (err) {
      // Ensure error message is correct
      expect(err.message).toBe("required should have required property 'test'")
      isCaught = true
    }

    // Ensure an error was thrown
    expect(isCaught).toBe(true)
  })
})

describe('#isA', () => {
  test('validates a value', () => {
    // Create a test value
    let value = 'test'
    validateUtil(value).isA('string')
  })

  test('throws an error if the value is invalid', () => {
    // Create a test value
    let value = 'test'

    let isCaught = false

    try {
      // Validate the value
      validateUtil(value).isA('number')
    } catch (err) {
      // Ensure the error message is correct
      expect(err.message).toBe('type should be number')
      isCaught = true
    }

    // Ensure an error was thrown
    expect(isCaught).toBe(true)
  })
})
