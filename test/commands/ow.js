var ow = requireRoot('commands/ow')



describe('@default', () => {

  it('Returns profile stats for your battletag', function* () {
    var expectedResult = 'Zapyre'
    var result         = ow('Zapyre-1177')
    result.should.eql(expectedResult)
  })

})
