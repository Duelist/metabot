var commands = requireRoot('commands')



describe('@default', () => {

  it('produces a pong', function* () {

    // Create an expected result
    var expectedResult = 'pong'

    // Run the command
    var result = yield commands.ping()

    // Ensure the result is the expected result
    result.should.eql(expectedResult)

  })

})
