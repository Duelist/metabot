let commands = requireRoot('bot/commands')



describe('@default', () => {

  test('claims the throne if there is no old king', async () => {

    // Create test message options
    let options = {
      message: {
        author  : { username: 'Duelist' },
        channel : { createMessage: jest.fn() },
        content : '!king'
      }
    }

    // Run the command
    await commands.king.message(options)

    // Ensure the create message function was called with the right message
    expect(options.message.channel.createMessage).toHaveBeenCalled()
    expect(options.message.channel.createMessage.mock.calls[0][0])
      .toBe('Duelist has claimed the throne.')

  })


  test('retains the throne', async () => {

    // Create test message options
    let options = {
      message: {
        author  : { username: 'Duelist' },
        channel : { createMessage: jest.fn() },
        content : '!king'
      }
    }

    // Run the command
    await commands.king.message(options)

    // Ensure the create message function was called with the right message
    expect(options.message.channel.createMessage).toHaveBeenCalled()
    expect(options.message.channel.createMessage.mock.calls[0][0])
      .toBe('Duelist has retained the throne.')
  
  })


  test('usurps the throne from another player', async () => {
  
    // Create test message options
    let options = {
      message: {
        author  : { username: 'Momentum' },
        channel : { createMessage: jest.fn() },
        content : '!king'
      }
    }

    // Run the command
    await commands.king.message(options)

    // Ensure the create message function was called with the right message
    expect(options.message.channel.createMessage).toHaveBeenCalled()
    expect(options.message.channel.createMessage.mock.calls[0][0])
      .toBe('Momentum has usurped the throne from Duelist.')

  })

})
