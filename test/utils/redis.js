let redisUtil = requireRoot('utils/redis')

let redis

beforeEach(async () => {
  // Register redis commands with a namespace
  redis = redisUtil.initialize()

  // Reset the cache
  await redis.reset()
})

describe('#addToSortedSet', () => {
  beforeEach(async () => {
    // Create a test key with a member
    await redis.addToSortedSet({
      key: 'test',
      member: 'hi',
      score: 0,
    })
  })

  test('creates a sorted set with a key if it doesn’t exist yet', async () => {
    let result = await redis.getBatchFromSortedSet({ key: 'test' })

    // Ensure the sorted set was created with the member
    expect(result).toEqual(['hi'])
  })

  test('adds to a sorted set with a key if it exists', async () => {
    // Add to the sorted set with another member
    await redis.addToSortedSet({
      key: 'test',
      member: 'hey',
      score: 1,
    })

    let result = await redis.getBatchFromSortedSet({ key: 'test' })

    // Ensure the member was added to the sorted set
    expect(result).toEqual(['hey', 'hi'])
  })
})

describe('#getString', () => {
  test('gets a string at the given key', async () => {
    // Create an expected string
    let expectedString = 'test'

    // Set the key to a string
    await redis.setString({ key: 'test', value: expectedString })

    // Retrieve the string at the key
    let result = await redis.getString({ key: 'test' })

    // Ensure the string at the key is the one that was set
    expect(result).toBe(expectedString)
  })
})

describe('#exists', () => {
  test('returns the existence of a redis key', async () => {
    // Add a test key with a member
    await redis.addToSortedSet({
      key: 'test',
      member: 'hi',
      score: 0,
    })

    // Get the existence of the existing redis key
    let result = await redis.exists({ key: 'test' })

    // Ensure the redis key exists
    expect(result).toBe(true)

    // Get the existence of a redis key that doesn't exist
    result = await redis.exists({ key: 'test2' })

    // Ensure the redis key doesn't exist
    expect(result).toBe(false)
  })
})

describe('#getBatchFromSortedSet', () => {
  test('returns a batch of members from the sorted set', async () => {
    // Create an expected result
    let expectedResult = ['another test', 'test']

    // Add values from the expected result to the sorted set
    await redis.addToSortedSet({
      key: 'test',
      member: expectedResult[1],
      score: 0,
    })
    await redis.addToSortedSet({
      key: 'test',
      member: expectedResult[0],
      score: 1,
    })

    // Get a batch from the sorted set
    let result = await redis.getBatchFromSortedSet({ key: 'test' })

    // Ensure the returned result matches the expected result
    expect(result).toEqual(expectedResult)
  })

  test('returns an empty array if the sorted set is empty or doesn’t exist', async () => {
    let result = await redis.getBatchFromSortedSet({ key: 'test' })
    expect(result).toEqual([])
  })

  test('returns a batch of members upper bounded by score', async () => {
    // Add two members to the sorted set
    await redis.addToSortedSet({
      key: 'test',
      member: 'test',
      score: 1,
    })
    await redis.addToSortedSet({
      key: 'test',
      member: 'another test',
      score: 3,
    })

    // Get a batch from the sorted set with batch score
    let result = await redis.getBatchFromSortedSet({
      key: 'test',
      lastScore: 2,
    })

    // Ensure the returned result is correct
    expect(result).toEqual(['test'])
  })

  test('returns a limited batch of members', async () => {
    // Add two members to the sorted set
    await redis.addToSortedSet({
      key: 'test',
      member: 'test',
      score: 1,
    })
    await redis.addToSortedSet({
      key: 'test',
      member: 'another test',
      score: 2,
    })

    // Get a batch from the sorted set with a limit
    let result = await redis.getBatchFromSortedSet({
      key: 'test',
      limit: 1,
    })

    // Ensure the returned result is correct
    expect(result).toEqual(['another test'])
  })

  test('returns a batch of members with scores', async () => {
    // Add two members to the sorted set
    await redis.addToSortedSet({
      key: 'test',
      member: 'test',
      score: 1,
    })
    await redis.addToSortedSet({
      key: 'test',
      member: 'another test',
      score: 2,
    })

    // Get a batch from the sorted set with a limit
    let result = await redis.getBatchFromSortedSet({
      includeScores: true,
      key: 'test',
    })

    // Ensure the returned result is correct
    expect(result).toEqual(['another test', '2', 'test', '1'])
  })

  test('throws an error if no key is provided', async () => {
    let isCaught = false

    try {
      await redis.getBatchFromSortedSet({})
    } catch (err) {
      isCaught = true
    }

    // Ensure an error was thrown
    expect(isCaught).toBe(true)
  })
})

describe('#initialize', () => {
  test('initializes a Redis client with a unique namespace', async () => {
    // Register two different namespaces
    let redisOne = redisUtil.initialize()
    let redisTwo = redisUtil.initialize()

    // Create a sorted set using a key in the first namespace
    await redisOne.addToSortedSet({ key: 'test', member: 'test', score: 0 })

    let keyExistsOne = await redisOne.exists({ key: 'test' })
    let keyExistsTwo = await redisTwo.exists({ key: 'test' })

    // Ensure the key exists in the first namespace and not the second
    expect(keyExistsOne).toBe(true)
    expect(keyExistsTwo).toBe(false)
  })
})

describe('#setString', () => {
  test('sets a string at the given key', async () => {
    // Create an expected string
    let expectedString = 'test'

    // Set the key to a string
    await redis.setString({ key: 'one', value: expectedString })

    // Retrieve the string at the key
    let result = await redis.getString({ key: 'one' })

    // Ensure the string at the key is the one that was set
    expect(result).toBe(expectedString)
  })
})
