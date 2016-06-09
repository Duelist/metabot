var ping = requireRoot('commands/ping')



describe('@default', () => {

  it('produces a pong', function* () {
    var expectedResult = 'pong'
    var result         = yield ping()
    result.should.eql(expectedResult)
  })

})
