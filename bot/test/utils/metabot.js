const sinon = require('sinon')

const commands    = requireRoot('bot/commands')
const metabotUtil = requireRoot('bot/utils/metabot')



describe('#handleMessageCreate', () => {

  test('sends a message', async () => {

    // Create a test message
    let message = {
      channel : { createMessage: jest.fn() },
      content : '!ping'
    }

    // Create spies on the command and create message function
    let pingSpy = sinon.spy(commands.ping, 'message')

    // Handle the create message event
    await metabotUtil.handleMessageCreate(message)

    // Ensure the ping command was called with the correct arguments
    expect(pingSpy.callCount).toBe(1)
    expect(pingSpy.lastCall.args[0]).toHaveProperty('args', [])
    expect(pingSpy.lastCall.args[0]).toHaveProperty('message', message)

    // Ensure the create message function was called
    expect(message.channel.createMessage).toHaveBeenCalled()
    expect(message.channel.createMessage.mock.calls[0][0]).toBe('pong')

    // Restore the spy
    pingSpy.restore()

  })


  test('does nothing if the command does not contain the message prefix', () => {

    // Create a test message
    let message = {
      channel : { createMessage: jest.fn() },
      content : 'ping'
    }

    // Handle the create message event
    metabotUtil.handleMessageCreate(message)

    // Ensure the create message function was not called
    expect(message.channel.createMessage).not.toHaveBeenCalled()

  })


  test('does nothing if the command does not exist', () => {

    // Create a test message
    let message = {
      channel : { createMessage: jest.fn() },
      content : '!pong'
    }

    // Handle the create message event
    metabotUtil.handleMessageCreate(message)

    // Ensure the create message function was not called
    expect(message.channel.createMessage).not.toHaveBeenCalled()

  })


  test('notifies the user if the command failed', () => {

    // Add a command that will fail on purpose
    commands.eping = {
      message: message => { throw new Error('fail ping') }
    }

    // Create a test message
    let message = {
      channel : { createMessage: jest.fn() },
      content : '!eping'
    }

    // Handle the create message event
    metabotUtil.handleMessageCreate(message)

    // Ensure the create message function was called
    expect(message.channel.createMessage).toHaveBeenCalled()
    expect(message.channel.createMessage.mock.calls[0][0]).toBe(
      'Command failed: Error: fail ping'
    )

  })

})
