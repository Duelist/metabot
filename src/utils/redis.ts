import Chance from 'chance'
import Redis from 'ioredis'
import _ from 'lodash'

import redisConfig from '@configs/redis-server.json'
import { NAMESPACE_DELIMITER } from '@constants/redis'

const chance = Chance.Chance()

/**
 * Adds a member with a specified score to the sorted set.
 */
async function addToSortedSet(
  redisClient,
  {
    key,
    member,
    score,
  }: {
    key: string
    score: number
    member: string
  },
) {
  await redisClient.zadd(key, score, member)
}

/**
 * Checks the existence of a Redis key.
 */
async function exists(
  redisClient,
  {
    key,
  }: {
    key: string
  },
): Promise<boolean> {
  const exists = await redisClient.exists(key)
  return !!exists
}

/**
 * Gets a batch of members from the sorted set.
 */
async function getBatchFromSortedSet(
  redisClient,
  {
    includeScores = false,
    key,
    lastScore,
    limit = 10,
  }: {
    includeScores: boolean
    key: string
    lastScore: number
    limit: number
  },
): Promise<any[]> {
  const args = [key]

  // Set the upper bound excluding the last score
  if (lastScore) {
    args.push('(' + lastScore)
  } else {
    args.push('+inf')
  }

  // Set the lower bound on score
  args.push('-inf')

  // Ensure the scores are returned
  if (includeScores) {
    args.push('WITHSCORES')
  }

  // Set the batch size
  args.push('limit', '0', limit.toString())

  return await redisClient.zrevrangebyscore(args)
}

/**
 * Gets an element from a list by its index.
 */
async function getFromList(
  redisClient,
  { key, index }: { key: string; index: number },
) {
  return await redisClient.lindex(key, index)
}

/**
 * Gets an element from a list by its index.
 */
async function getLengthOfList(redisClient, key: string) {
  return await redisClient.llen(key)
}

/**
 * Gets a range of elements from a list.
 */
async function getRangeFromList(
  redisClient,
  { key, start = 0, stop = -1 }: { key: string; start: number; stop: number },
) {
  return await redisClient.lrange(key, start, stop)
}

/**
 * Gets the score for a given member at the provided key.
 */
async function getScoreFromSortedSet(
  redisClient,
  { key, member }: { key: string; member: string },
): Promise<string> {
  return await redisClient.zscore(key, member)
}

/**
 * Gets a string value at the provided key.
 */
async function getString(
  redisClient,
  { key }: { key: string },
): Promise<string> {
  return await redisClient.get(key)
}

/**
 * Increments the score for a given member in.
 */
async function incrementScoreInSortedSet(
  redisClient,
  { amount = 1, key, member }: { amount: number; key: string; member: string },
): Promise<string> {
  return await redisClient.zincrby(key, amount, member)
}

/**
 * Returns whether a list is empty or not.
 */
async function isListEmpty(redisClient, key): Promise<boolean> {
  const length = await getLengthOfList(redisClient, key)
  return length === 0
}

/**
 * Creates a Redis connection and returns utility functions.
 */
function initialize(key: string) {
  const prefix = chance.word()
  const config = {
    host: redisConfig.host,
    keyPrefix: [prefix, key].join(NAMESPACE_DELIMITER),
  }
  const redisClient = new Redis(config)

  return {
    addToSortedSet: _.partial(addToSortedSet, redisClient),
    exists: _.partial(exists, redisClient),
    getBatchFromSortedSet: _.partial(getBatchFromSortedSet, redisClient),
    getFromList: _.partial(getFromList, redisClient),
    getLengthOfList: _.partial(getLengthOfList, redisClient),
    getRangeFromList: _.partial(getRangeFromList, redisClient),
    getScoreFromSortedSet: _.partial(getScoreFromSortedSet, redisClient),
    getString: _.partial(getString, redisClient),
    incrementScoreInSortedSet: _.partial(
      incrementScoreInSortedSet,
      redisClient,
    ),
    popFromList: _.partial(popFromList, redisClient),
    pushToList: _.partial(pushToList, redisClient),
    removeFromList: _.partial(removeFromList, redisClient),
    reset: _.partial(reset, redisClient),
    setString: _.partial(setString, redisClient),
  }
}

/**
 * Removes and gets the first element in a list.
 */
async function popFromList(redisClient, key: string): Promise<string> {
  return await redisClient.lpop(key)
}

/**
 * Appends a value to the list.
 */
async function pushToList(
  redisClient,
  {
    key,
    value,
  }: {
    key: string
    value: string
  },
) {
  await redisClient.rpush(key, value)
}

/**
 * Removes the element at the index from the list.
 */
async function removeFromList(
  redisClient,
  {
    index,
    key,
  }: {
    index: number
    key: string
  },
) {
  await redisClient.lset(key, index, 'DELETED')
  await redisClient.lrem(key, 0, 'DELETED')
}

/**
 * Resets the Redis cache.
 */
async function reset(redisClient) {
  await redisClient.flushall()
}

/**
 * Sets a string value at the provided key.
 */
async function setString(
  redisClient,
  { key, value }: { key: string; value: string },
) {
  await redisClient.set(key, value)
}

export { initialize }
