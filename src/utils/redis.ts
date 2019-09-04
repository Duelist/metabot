import Chance from 'chance'
import Redis from 'ioredis'
import _ from 'lodash'

import { host } from '@configs/redis'
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
 * Creates a Redis connection and returns utility functions.
 */
function initialize(): {
  addToSortedSet: Function,
  exists: Function,
  getBatchFromSortedSet: Function,
  getScoreFromSortedSet: Function,
  incrementScoreInSortedSet: Function,
  getString: Function,
  reset: Function,
  setString: Function,
} {
  const prefix = chance.word() + NAMESPACE_DELIMITER
  const config = Object.assign({ keyPrefix: prefix }, { host })
  const redisClient = new Redis(config)

  return {
    addToSortedSet: _.partial(addToSortedSet, redisClient),
    exists: _.partial(exists, redisClient),
    getBatchFromSortedSet: _.partial(getBatchFromSortedSet, redisClient),
    getScoreFromSortedSet: _.partial(getScoreFromSortedSet, redisClient),
    incrementScoreInSortedSet: _.partial(
      incrementScoreInSortedSet,
      redisClient,
    ),
    getString: _.partial(getString, redisClient),
    reset: _.partial(reset, redisClient),
    setString: _.partial(setString, redisClient),
  }
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
