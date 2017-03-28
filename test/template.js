let template = requireRoot('template')



describe('@default', () => {

  test('returns a function that creates a tagged template literal', () => {
    let templateFunction = template`Hello ${0}`
    expect(templateFunction('user.')).toBe('Hello user.')
  })

})
