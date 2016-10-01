let template = requireRoot('template')



describe('@default', () => {

  it('returns a function that creates a tagged template literal', function* () {
    let templateFunction = template`Hello ${0}`
    templateFunction('user.').should.eql('Hello user.')
  })

})
