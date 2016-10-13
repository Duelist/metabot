let redisUtil = requireRoot('utils/redis')



let redis

beforeEach(function* () {

  // Reset the cache
  yield redisUtil.reset()

  // Register redis commands with a namespace
  redis = yield redisUtil.register()

})



describe('#addToSortedSet', () => {

  beforeEach(function* () {

    // Create a test key with a member
    yield redis.addToSortedSet({
      key    : 'test',
      member : 'hi',
      score  : 0
    })

  })


  it('creates a sorted set with a key if it doesn’t exist yet', function* () {

    let result = yield redis.getBatchFromSortedSet({ key: 'test' })

    // Ensure the sorted set was created with the member
    result.should.eql(['hi'])

  })


  it('adds to a sorted set with a key if it exists', function* () {

    // Add to the sorted set with another member
    yield redis.addToSortedSet({
      key    : 'test',
      member : 'hey',
      score  : 1
    })

    let result = yield redis.getBatchFromSortedSet({ key: 'test' })

    // Ensure the member was added to the sorted set
    result.should.eql(['hey', 'hi'])

  })

})



describe('#getString', () => {

  it('gets a string at the given key', function* () {

    // Create an expected string
    let expectedString = 'test'

    // Set the key to a string
    yield redis.setString({ key: 'test', value: expectedString })

    // Retrieve the string at the key
    let result = yield redis.getString({ key: 'test' })

    // Ensure the string at the key is the one that was set
    result.should.eql(expectedString)

  })

})



describe('#exists', () => {

  it('returns the existence of a redis key', function* () {

    // Add a test key with a member
    yield redis.addToSortedSet({
      key    : 'test',
      member : 'hi',
      score  : 0
    })

    // Get the existence of the existing redis key
    let result = yield redis.exists({ key: 'test' })

    // Ensure the redis key exists
    result.should.eql(true)

    // Get the existence of a redis key that doesn't exist
    result = yield redis.exists({ key: 'test2' })

    // Ensure the redis key doesn't exist
    result.should.eql(false)

  })

})



describe('#getBatchFromSortedSet', () => {

  it('returns a batch of members from the sorted set', function* () {

    // Create an expected result
    let expectedResult = ['another test', 'test']

    // Add values from the expected result to the sorted set
    yield redis.addToSortedSet({
      key    : 'test',
      member : expectedResult[1],
      score  : 0
    })
    yield redis.addToSortedSet({
      key    : 'test',
      member : expectedResult[0],
      score  : 1
    })

    // Get a batch from the sorted set
    let result = yield redis.getBatchFromSortedSet({ key: 'test' })

    // Ensure the returned result matches the expected result
    result.should.eql(expectedResult)

  })


  it('returns an empty array if the sorted set is empty or doesn’t exist', function* () {
    let result = yield redis.getBatchFromSortedSet({ key: 'test' })
    result.should.eql([])
  })


  it('returns a batch of members upper bounded by score', function* () {

    // Add two members to the sorted set
    yield redis.addToSortedSet({
      key    : 'test',
      member : 'test',
      score  : 1
    })
    yield redis.addToSortedSet({
      key    : 'test',
      member : 'another test',
      score  : 3
    })

    // Get a batch from the sorted set with batch score
    let result = yield redis.getBatchFromSortedSet({
      key       : 'test',
      lastScore : 2
    })

    // Ensure the returned result is correct
    result.should.eql(['test'])

  })


  it('returns a limited batch of members', function* () {

    // Add two members to the sorted set
    yield redis.addToSortedSet({
      key    : 'test',
      member : 'test',
      score  : 1
    })
    yield redis.addToSortedSet({
      key    : 'test',
      member : 'another test',
      score  : 2
    })

    // Get a batch from the sorted set with a limit
    let result = yield redis.getBatchFromSortedSet({
      key   : 'test',
      limit : 1
    })

    // Ensure the returned result is correct
    result.should.eql(['another test'])

  })


  it('returns a batch of members with scores', function* () {

    // Add two members to the sorted set
    yield redis.addToSortedSet({
      key    : 'test',
      member : 'test',
      score  : 1
    })
    yield redis.addToSortedSet({
      key    : 'test',
      member : 'another test',
      score  : 2
    })

    // Get a batch from the sorted set with a limit
    let result = yield redis.getBatchFromSortedSet({
      includeScores : true,
      key           : 'test'
    })

    // Ensure the returned result is correct
    result.should.eql(['another test', '2', 'test', '1'])

  })


  it('throws an error if no key is provided', function* () {

    let isCaught = false

    try {
      yield redis.getBatchFromSortedSet({})
    }
    catch (err) {
      isCaught = true
    }

    // Ensure an error was thrown
    isCaught.should.eql(true)

  })

})



describe('#register', () => {

  it('registers a unique namespace', function* () {

    // Register two different namespaces
    let redisOne = yield redisUtil.register()
    let redisTwo = yield redisUtil.register()

    // Create a sorted set using a key in the first namespace
    yield redisOne.addToSortedSet({ key: 'test', member: 'test', score: 0 })

    let keyExistsOne = yield redisOne.exists({ key: 'test' })
    let keyExistsTwo = yield redisTwo.exists({ key: 'test' })

    // Ensure the key exists in the first namespace and not the second
    keyExistsOne.should.eql(true)
    keyExistsTwo.should.eql(false)

  })

})



describe('#setString', () => {

  it('sets a string at the given key', function* () {

    // Create an expected string
    let expectedString = 'test'

    // Set the key to a string
    yield redis.setString({ key: 'one', value: expectedString })

    // Retrieve the string at the key
    let result = yield redis.getString({ key: 'one' })

    // Ensure the string at the key is the one that was set
    result.should.eql(expectedString)

  })

})
