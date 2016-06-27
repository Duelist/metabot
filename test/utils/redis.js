var redisUtil = requireRoot('utils/redis')



beforeEach(function* () {
  // Reset the cache
  yield redisUtil.reset()
})



describe('#addToSortedSet', () => {

  beforeEach(function* () {

    // Create a test key with a member
    yield redisUtil.addToSortedSet({
      key    : 'test',
      member : 'hi',
      score  : 0
    })

  })


  it('creates a sorted set with a key if it doesn’t exist yet', function* () {

    var result = yield redisUtil.getBatchFromSortedSet({ key: 'test' })

    // Ensure the sorted set was created with the member
    result.should.eql(['hi'])

  })


  it('adds to a sorted set with a key if it exists', function* () {

    // Add to the sorted set with another member
    yield redisUtil.addToSortedSet({
      key    : 'test',
      member : 'hey',
      score  : 1
    })

    var result = yield redisUtil.getBatchFromSortedSet({ key: 'test' })

    // Ensure the member was added to the sorted set
    result.should.eql(['hey', 'hi'])

  })

})



describe('#exists', () => {

  it('returns the existence of a redis key', function* () {

    // Add a test key with a member
    yield redisUtil.addToSortedSet({
      key    : 'test',
      member : 'hi',
      score  : 0
    })

    // Get the existence of the existing redis key
    var result = yield redisUtil.exists('test')

    // Ensure the redis key exists
    result.should.eql(1)

    // Get the existence of a redis key that doesn't exist
    result = yield redisUtil.exists('test2')

    // Ensure the redis key doesn't exist
    result.should.eql(0)

  })

})



describe('#getBatchFromSortedSet', () => {

  it('returns a batch of members from the sorted set', function* () {

    // Create an expected result
    var expectedResult = ['another test', 'test']

    // Add values from the expected result to the sorted set
    yield redisUtil.addToSortedSet({
      key    : 'test',
      member : expectedResult[1],
      score  : 0
    })
    yield redisUtil.addToSortedSet({
      key    : 'test',
      member : expectedResult[0],
      score  : 1
    })

    // Get a batch from the sorted set
    var result = yield redisUtil.getBatchFromSortedSet({ key: 'test' })

    // Ensure the returned result matches the expected result
    result.should.eql(expectedResult)

  })


  it('returns an empty array if the sorted set is empty or doesn’t exist', function* () {
    var result = yield redisUtil.getBatchFromSortedSet({ key: 'test' })
    result.should.eql([])
  })


  it('returns a batch of members upper bounded by score', function* () {

    // Add two members to the sorted set
    yield redisUtil.addToSortedSet({
      key    : 'test',
      member : 'test',
      score  : 1
    })
    yield redisUtil.addToSortedSet({
      key    : 'test',
      member : 'another test',
      score  : 2
    })

    // Get a batch from the sorted set with batch score
    var result = yield redisUtil.getBatchFromSortedSet({
      key       : 'test',
      lastScore : 2
    })

    // Ensure the returned result is correct
    result.should.eql(['test'])

  })


  it('returns a limited batch of members', function* () {

    // Add two members to the sorted set
    yield redisUtil.addToSortedSet({
      key    : 'test',
      member : 'test',
      score  : 1
    })
    yield redisUtil.addToSortedSet({
      key    : 'test',
      member : 'another test',
      score  : 2
    })

    // Get a batch from the sorted set with a limit
    var result = yield redisUtil.getBatchFromSortedSet({
      key   : 'test',
      limit : 1
    })

    // Ensure the returned result is correct
    result.should.eql(['another test'])

  })


  it('throws an error if no key is provided', function* () {

    var isCaught = false

    try {
      yield redisUtil.getBatchFromSortedSet({})
    }
    catch (err) {
      isCaught = true
    }

    // Ensure an error was thrown
    isCaught.should.eql(true)

  })

})
