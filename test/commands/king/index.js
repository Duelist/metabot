let commands = requireRoot('commands')



describe('@default', () => {

  before(function* () {
    // Run the startup function
    yield commands.king.startup()
  })


  it('claims the throne if there is no old king', function* () {

    let event = {
      message : {
        author  : {
          username : 'Duelist'
        },
        content : '!king'
      }
    }

    // Create an expected result
    let expectedResult = 'Duelist has claimed the throne.'

    // Run the command
    let result = yield commands.king.message(event)

    // Ensure the result is the expected result
    result.should.eql(expectedResult)

  })


  it('retains the throne', function* () {

    let event = {
      message : {
        author  : {
          username : 'Duelist'
        },
        content : '!king'
      }
    }

    // Create an expected result
    let expectedResult = 'Duelist has retained the throne.'

    // Run the command
    let result = yield commands.king.message(event)

    // Ensure the result is the expected result
    result.should.eql(expectedResult)
  
  })


  it('usurps the throne from another player', function* () {
  
    let event = {
      message : {
        author  : {
          username : 'Momentum'
        },
        content : '!king'
      }
    }

    // Create an expected result
    let expectedResult = 'Momentum has usurped the throne from Duelist.'

    // Run the command
    let result = yield commands.king.message(event)

    // Ensure the result is the expected result
    result.should.eql(expectedResult)
  
  })

})
