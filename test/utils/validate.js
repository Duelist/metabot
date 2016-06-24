var validateUtil = requireRoot('utils/validate')



describe('#has', () => {

  it('validates an object', () => {

    // Create a test object
    var object = {
      one : 1,
      two : 'two'
    }

    // Validate the object with a schema
    validateUtil(object).has({
      one   : { type: 'number' },
      two   : { type: 'string' },
      three : { default: 3, type: 'number' }
    })

    // Ensure the modified object is correct
    object.should.eql({
      one   : 1,
      two   : 'two',
      three : 3
    })

  })


  it('throws an error when an object is invalid', () => {

    // Create a test object
    var object = { one: 1 }

    var isCaught = false

    try {
      // Validate the object with a schema
      validateUtil(object).has({
        one : { type: 'string' }
      })
    }
    catch (err) {
      // Ensure error message is correct
      err.message.should.eql('type should be string')
      isCaught = true
    }

    // Ensure an error was thrown
    isCaught.should.eql(true)
    
  })

})



describe('#isA', () => {

  it('validates a value', () => {
    // Create a test value
    var value = 'test'
    validateUtil(value).isA('string')
  })


  it('throws an error if the value is invalid', () => {
    // Create a test value
    var value = 'test'

    var isCaught = false

    try {
      // Validate the value
      validateUtil(value).isA('number')
    }
    catch (err) {
      // Ensure the error message is correct
      err.message.should.eql('type should be number')
      isCaught = true
    }

    // Ensure an error was thrown
    isCaught.should.eql(true)

  })

})
