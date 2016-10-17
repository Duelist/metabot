let sinon    = require('sinon')

let commands = requireRoot('bot/commands')



describe('@default', () => {

  it('produces a pong', function* () {

    // Create test message options
    let options = {
      message : {
        channel : {
          sendMessage : function* (message) {
            return message
          }
        },
        content : '!ping'
      }
    }

    // Create a spy on the send message function
    let sendMessageSpy = sinon.spy(options.message.channel, 'sendMessage')

    // Create an expected result
    let expectedResult = 'pong'

    // Run the command
    yield commands.ping.message(options)

    // Ensure the send message function was called with the right message
    sendMessageSpy.calledOnce.should.eql(true)
    sendMessageSpy.lastCall.args[0].should.eql(expectedResult)

    // Clean up
    sendMessageSpy.restore()

  })

})
