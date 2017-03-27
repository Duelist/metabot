const sinon = require('sinon')

const commands    = requireRoot('bot/commands')
const metabotUtil = requireRoot('bot/utils/metabot')



describe('#handleMessageCreate', () => {

  it('sends a message', function* () {

    // Create a test message
    let message = {
      channel: {
        createMessage: function* (message) { return message }
      },
      content: '!ping'
    }

    // Create spies on the command and create message function
    let pingSpy        = sinon.spy(commands.ping, 'message')
    let createMessageSpy = sinon.spy(message.channel, 'createMessage')

    // Handle the create message event
    yield metabotUtil.handleMessageCreate(message)

    // Ensure the ping command was called with the correct arguments
    pingSpy.calledOnce.should.eql(true)
    pingSpy.lastCall.args[0].should.eql({
      args: [],
      message,
    })

    // Ensure the create message function was called
    createMessageSpy.calledOnce.should.eql(true)
    createMessageSpy.lastCall.args[0].should.eql('pong')

    // Restore the spies
    pingSpy.restore()
    createMessageSpy.restore()

  })


  it('does nothing if the command does not contain the message prefix', () => {

    // Create a test message
    let message = {
      channel: {
        createMessage: message => { return }
      },
      content: 'ping'
    }

    // Create a spy on the create message function
    let createMessageSpy = sinon.spy(message.channel, 'createMessage')

    // Handle the create message event
    metabotUtil.handleMessageCreate(message)

    // Ensure the create message function was not called
    createMessageSpy.callCount.should.eql(0)

    // Restore the spy
    createMessageSpy.restore()

  })


  it('does nothing if the command does not exist', () => {

    // Create a test message
    let message = {
      channel: {
        createMessage: message => { return }
      },
      content: '!pong'
    }

    // Create a spy on the create message function
    let createMessageSpy = sinon.spy(message.channel, 'createMessage')

    // Handle the create message event
    metabotUtil.handleMessageCreate(message)

    // Ensure the create message function was not called
    createMessageSpy.callCount.should.eql(0)

    // Restore the spy
    createMessageSpy.restore()

  })


  it('notifies the user if the command failed', () => {

    // Add a command that will fail on purpose
    commands.eping = {
      message: message => { throw new Error('fail ping') }
    }

    // Create a test message
    let message = {
      channel: {
        createMessage: function* (message) { return }
      },
      content: '!eping'
    }

    // Create a spy on the create message function
    let createMessageSpy = sinon.spy(message.channel, 'createMessage')

    // Handle the create message event
    metabotUtil.handleMessageCreate(message)

    // Ensure the create message function was called
    createMessageSpy.calledOnce.should.eql(true)
    createMessageSpy.lastCall.args[0].should.eql(
      'Command failed: Error: fail ping'
    )

    // Restore the spy
    createMessageSpy.restore()

  })

})
