let sinon       = require('sinon')

let commands    = requireRoot('commands')
let metabotUtil = requireRoot('utils/metabot')



describe('#handleMessageCreate', () => {

  it('sends a message', function* () {

    // Create a test event
    let event = {
      message : {
        channel : {
          sendMessage : message => { return }
        },
        content : '!ping'
      }
    }

    // Create a spy on the send message function
    let sendMessageSpy = sinon.spy(event.message.channel, 'sendMessage')

    // Handle the send message event
    yield metabotUtil.handleMessageCreate(event)

    // Ensure the send message function was called
    sendMessageSpy.callCount.should.eql(1)
    sendMessageSpy.lastCall.args[0].should.eql('pong')

    // Restore the spy
    sendMessageSpy.restore()

  })


  it('does nothing if the command does not contain the message prefix', () => {
  
    // Create a test event
    let event = {
      message : {
        channel : {
          sendMessage : message => { return }
        },
        content : 'ping'
      }
    }

    // Create a spy on the send message function
    let sendMessageSpy = sinon.spy(event.message.channel, 'sendMessage')

    // Handle the send message event
    metabotUtil.handleMessageCreate(event)

    // Ensure the send message function was not called
    sendMessageSpy.callCount.should.eql(0)

    // Restore the spy
    sendMessageSpy.restore()

  })


  it('notifies the user if the command failed', () => {

    // Add a command that will fail on purpose
    commands.eping = (message) => {
      throw new Error('fail ping')
    }

    // Create a test event
    let event = {
      message : {
        channel : {
          sendMessage : message => { return }
        },
        content : '!eping'
      }
    }

    // Create a spy on the send message function
    let sendMessageSpy = sinon.spy(event.message.channel, 'sendMessage')

    // Handle the send message event
    metabotUtil.handleMessageCreate(event)

    // Ensure the send message function was called
    sendMessageSpy.callCount.should.eql(1)
    sendMessageSpy.lastCall.args[0].should.eql(
      'Command failed: Error: fail ping'
    )

    // Restore the spy
    sendMessageSpy.restore()

  })

})
