let commands = requireRoot('bot/commands')



describe('@default', () => {

  test('produces a pong', async () => {

    // Create test message options
    let options = {
      message: {
        channel : { createMessage: jest.fn() },
        content : '!ping'
      }
    }

    // Run the command
    await commands.ping.message(options)

    // Ensure the create message function was called with the right message
    expect(options.message.channel.createMessage).toHaveBeenCalled()
    expect(options.message.channel.createMessage.mock.calls[0][0]).toBe('pong')

  })

})
