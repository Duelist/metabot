let testUtil = requireRoot('utils/test')



describe('#randomString', () => {

  it('generates a random string', () => {

    // Generate two random strings
    let randomString        = testUtil.randomString()
    let anotherRandomString = testUtil.randomString()

    // Ensure the two random strings are different
    randomString.should.be.type('string')
    anotherRandomString.should.be.type('string')
    randomString.should.not.eql(anotherRandomString)

  })


  it('generates a random string with the given length', () => {

    // Generate a random string
    let randomString = testUtil.randomString(2)

    // Ensure the returned string length is correct
    randomString.length.should.eql(2)

  })

})