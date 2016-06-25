var ping = requireRoot('commands/ping')



describe('@default', () => {

  it('produces a pong', () => {

    // Create an expected result
    var expectedResult = 'pong'

    // Run the command
    var result = ping()

    // Ensure the result is the expected result
    result.should.eql(expectedResult)

  })

})
