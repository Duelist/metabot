let sinon    = require('sinon')

let commands = requireRoot('bot/commands')



describe('@default', () => {

  it('produces a pong', function* () {

    // Create test message options
    let options = {
      message : {
        channel : {
          createMessage : function* (message) {
            return message
          }
        },
        content : '!ping'
      }
    }

    // Create a spy on the create message function
    let createMessageSpy = sinon.spy(options.message.channel, 'createMessage')

    // Create an expected result
    let expectedResult = 'pong'

    // Run the command
    yield commands.ping.message(options)

    // Ensure the create message function was called with the right message
    createMessageSpy.calledOnce.should.eql(true)
    createMessageSpy.lastCall.args[0].should.eql(expectedResult)

    // Clean up
    createMessageSpy.restore()

  })

})
