let metacoins = requireRoot('bot/commands/metacoins')
let METACOINS = requireRoot('bot/commands/metacoins/constants')



describe('@default', () => {

  test('responds with a user’s metacoin count', async () => {

    // Create test message options
    let options = {
      message: {
        author  : { id: '1', mention: '@User' },
        channel : { createMessage: jest.fn() }
      }
    }

    await metacoins.message(options)

    expect(options.message.channel.createMessage).toHaveBeenCalled()
    expect(options.message.channel.createMessage.mock.calls[0][0]).toBe(
      METACOINS.MESSAGE.METACOIN_COUNT('@User', '0')
    )

  })

})
