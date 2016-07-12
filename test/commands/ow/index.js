var ow = requireRoot('commands/ow/index')



describe('@default', () => {

  it('Returns profile stats for your battletag', function* () {
    let expectedResult = 'Zapyre'
    let result         = ow('Zapyre-1177')
    result.indexOf(expectedResult).should.not.eql(-1)
  })

})
