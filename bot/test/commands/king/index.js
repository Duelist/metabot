let sinon    = require('sinon')

let commands = requireRoot('bot/commands')



describe('@default', () => {

  it('claims the throne if there is no old king', function* () {

    // Create test message options
    let options = {
      message : {
        author  : { username: 'Duelist' },
        channel : {
          createMessage : function* (message) {
            return message
          }
        },
        content : '!king'
      }
    }

    // Create a spy on the create message function
    let createMessageSpy = sinon.spy(options.message.channel, 'createMessage')

    // Create an expected result
    let expectedResult = 'Duelist has claimed the throne.'

    // Run the command
    yield commands.king.message(options)

    // Ensure the create message function was called with the right message
    createMessageSpy.calledOnce.should.eql(true)
    createMessageSpy.lastCall.args[0].should.eql(expectedResult)

    // Clean up
    createMessageSpy.restore()

  })


  it('retains the throne', function* () {

    // Create test message options
    let options = {
      message : {
        author  : { username: 'Duelist' },
        channel : {
          createMessage : function* (message) {
            return message
          }
        },
        content : '!king'
      }
    }

    // Create a spy on the create message function
    let createMessageSpy = sinon.spy(options.message.channel, 'createMessage')

    // Create an expected result
    let expectedResult = 'Duelist has retained the throne.'

    // Run the command
    yield commands.king.message(options)

    // Ensure the create message function was called with the right message
    createMessageSpy.calledOnce.should.eql(true)
    createMessageSpy.lastCall.args[0].should.eql(expectedResult)

    // Clean up
    createMessageSpy.restore()
  
  })


  it('usurps the throne from another player', function* () {
  
    // Create test message options
    let options = {
      message : {
        author  : { username: 'Momentum' },
        channel : {
          createMessage : function* (message) {
            return message
          }
        },
        content : '!king'
      }
    }

    // Create a spy on the create message function
    let createMessageSpy = sinon.spy(options.message.channel, 'createMessage')

    // Create an expected result
    let expectedResult = 'Momentum has usurped the throne from Duelist.'

    // Run the command
    yield commands.king.message(options)

    // Ensure the create message function was called with the right message
    createMessageSpy.calledOnce.should.eql(true)
    createMessageSpy.lastCall.args[0].should.eql(expectedResult)

    // Clean up
    createMessageSpy.restore()

  })

})
