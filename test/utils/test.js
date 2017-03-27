let testUtil = requireRoot('utils/test')



describe('#rewireRoot', () => {

  it('rewires a module at a given path from root', () => {
    let result = testUtil.rewireRoot('utils/test')
    // HACK: Checking type only is not the best way to test this
    true.should.eql(typeof result === 'object')
  })

})
