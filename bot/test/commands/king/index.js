let sinon    = require('sinon')

let commands = requireRoot('bot/commands')



describe('@default', () => {

  before(function* () {
    // Run the startup function
    yield commands.king.startup()
  })


  it('claims the throne if there is no old king', function* () {

    // Create test message options
    let options = {
      message : {
        author  : { username: 'Duelist' },
        channel : {
          sendMessage : function* (message) {
            return message
          }
        },
        content : '!king'
      }
    }

    // Create a spy on the send message function
    let sendMessageSpy = sinon.spy(options.message.channel, 'sendMessage')

    // Create an expected result
    let expectedResult = 'Duelist has claimed the throne.'

    // Run the command
    yield commands.king.message(options)

    // Ensure the send message function was called with the right message
    sendMessageSpy.calledOnce.should.eql(true)
    sendMessageSpy.lastCall.args[0].should.eql(expectedResult)

    // Clean up
    sendMessageSpy.restore()

  })


  it('retains the throne', function* () {

    // Create test message options
    let options = {
      message : {
        author  : { username: 'Duelist' },
        channel : {
          sendMessage : function* (message) {
            return message
          }
        },
        content : '!king'
      }
    }

    // Create a spy on the send message function
    let sendMessageSpy = sinon.spy(options.message.channel, 'sendMessage')

    // Create an expected result
    let expectedResult = 'Duelist has retained the throne.'

    // Run the command
    yield commands.king.message(options)

    // Ensure the send message function was called with the right message
    sendMessageSpy.calledOnce.should.eql(true)
    sendMessageSpy.lastCall.args[0].should.eql(expectedResult)

    // Clean up
    sendMessageSpy.restore()
  
  })


  it('usurps the throne from another player', function* () {
  
    // Create test message options
    let options = {
      message : {
        author  : { username: 'Momentum' },
        channel : {
          sendMessage : function* (message) {
            return message
          }
        },
        content : '!king'
      }
    }

    // Create a spy on the send message function
    let sendMessageSpy = sinon.spy(options.message.channel, 'sendMessage')

    // Create an expected result
    let expectedResult = 'Momentum has usurped the throne from Duelist.'

    // Run the command
    yield commands.king.message(options)

    // Ensure the send message function was called with the right message
    sendMessageSpy.calledOnce.should.eql(true)
    sendMessageSpy.lastCall.args[0].should.eql(expectedResult)

    // Clean up
    sendMessageSpy.restore()

  })

})
