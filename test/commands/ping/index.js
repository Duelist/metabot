let commands = requireRoot('commands')



describe('@default', () => {

  it('produces a pong', function* () {

    // Create an expected result
    let expectedResult = 'pong'

    // Run the command
    let result = yield commands.ping.message()

    // Ensure the result is the expected result
    result.should.eql(expectedResult)

  })

})
