let sinon       = require('sinon')

let commands    = requireRoot('commands')
let metabotUtil = requireRoot('utils/metabot')



describe('#handleGatewayReady', () => {

  it('runs startup functions for every command', function* () {

    // Create a spy on the king command's startup function
    let kingStartupSpy = sinon.spy(commands.king, 'startup')

    yield metabotUtil.handleGatewayReady()

    // Ensure the startup function was called
    kingStartupSpy.calledOnce.should.eql(true)

    // Clean up
    kingStartupSpy.restore()

  })

})



describe('#handleMessageCreate', () => {

  it('sends a message', function* () {

    // Create a test event
    let event = {
      message : {
        channel : {
          sendMessage : function* (message) {
            return message
          }
        },
        content : '!ping'
      }
    }

    // Create spies on the command and send message function
    let pingSpy        = sinon.spy(commands.ping, 'message')
    let sendMessageSpy = sinon.spy(event.message.channel, 'sendMessage')

    // Handle the send message event
    yield metabotUtil.handleMessageCreate(event)

    // Ensure the ping command was called with the correct arguments
    pingSpy.calledOnce.should.eql(true)
    pingSpy.lastCall.args[0].should.eql({
      args    : [],
      message : event.message
    })

    // Ensure the send message function was called
    sendMessageSpy.calledOnce.should.eql(true)
    sendMessageSpy.lastCall.args[0].should.eql('pong')

    // Restore the spies
    pingSpy.restore()
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


  it('does nothing if the command does not exist', () => {

    // Create a test event
    let event = {
      message : {
        channel : {
          sendMessage : message => { return }
        },
        content : '!pong'
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
    commands.eping = {
      message : message => {
        throw new Error('fail ping')
      }
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
    sendMessageSpy.calledOnce.should.eql(true)
    sendMessageSpy.lastCall.args[0].should.eql(
      'Command failed: Error: fail ping'
    )

    // Restore the spy
    sendMessageSpy.restore()

  })

})
