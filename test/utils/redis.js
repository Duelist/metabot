var redis = requireRoot('utils/redis')



beforeEach(function* () {
  // Reset the cache
  yield redis.reset()
})



describe('#addToSortedSet', () => {

  beforeEach(function* () {
    // Create a test key with a member
    yield redis.addToSortedSet('test', { score: 0, member: 'hi' })
  })


  it('creates a sorted set with a key if it doesn’t exist yet', function* () {

    var result = yield redis.getBatchFromSortedSet('test')

    // Ensure the sorted set was created with the member
    result.should.eql(['hi'])

  })


  it('adds to a sorted set with a key if it exists', function* () {

    // Add to the sorted set with another member
    yield redis.addToSortedSet('test', { score: 1, member: 'hey' })

    var result = yield redis.getBatchFromSortedSet('test')

    // Ensure the member was added to the sorted set
    result.should.eql(['hey', 'hi'])

  })

})



describe('#exists', () => {

  it('returns the existence of a redis key', function* () {

    // Add a test key with a member
    yield redis.addToSortedSet('test', { score: 0, member: 'hi' })

    // Get the existence of the existing redis key
    var result = yield redis.exists('test')

    // Ensure the redis key exists
    result.should.eql(1)

    // Get the existence of a redis key that doesn't exist
    result = yield redis.exists('test2')

    // Ensure the redis key doesn't exist
    result.should.eql(0)

  })

})



describe('#getBatchFromSortedSet', () => {
  // TODO: Finish tests here.
})
