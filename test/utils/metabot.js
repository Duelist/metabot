var sinon       = require('sinon')

var commands    = requireRoot('commands')
var metabotUtil = requireRoot('utils/metabot')



describe('#handleMessageCreate', () => {

  it('sends a message', () => {

    // Create a test event
    var event = {
      message : {
        channel : {
          sendMessage : message => { return }
        },
        content: '!ping'
      }
    }

    // Create a spy on the send message function
    var sendMessageSpy = sinon.spy(event.message.channel, 'sendMessage')

    // Handle the send message event
    metabotUtil.handleMessageCreate(event)

    // Ensure the send message function was called
    sendMessageSpy.callCount.should.eql(1)
    sendMessageSpy.lastCall.args[0].should.eql('pong')

    // Restore the spy
    sendMessageSpy.restore()

  })


  it('does nothing if the command does not contain the message prefix', () => {
  
    // Create a test event
    var event = {
      message : {
        channel : {
          sendMessage : message => { return }
        },
        content: 'ping'
      }
    }

    // Create a spy on the send message function
    var sendMessageSpy = sinon.spy(event.message.channel, 'sendMessage')

    // Handle the send message event
    metabotUtil.handleMessageCreate(event)

    // Ensure the send message function was not called
    sendMessageSpy.callCount.should.eql(0)

    // Restore the spy
    sendMessageSpy.restore()

  })


  it('notifies the user if the command failed', () => {

    // Add a command that will fail on purpose
    commands.eping = {
      process: (message) => { throw('fail ping') }
    }

    // Create a test event
    var event = {
      message : {
        channel : {
          sendMessage : message => { return }
        },
        content: '!eping'
      }
    }

    // Create a spy on the send message function
    var sendMessageSpy = sinon.spy(event.message.channel, 'sendMessage')

    // Handle the send message event
    metabotUtil.handleMessageCreate(event)

    // Ensure the send message function was called
    sendMessageSpy.callCount.should.eql(1)
    sendMessageSpy.lastCall.args[0].should.eql('Command failed: fail ping')

    // Restore the spy
    sendMessageSpy.restore()

  })

})
