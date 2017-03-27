let Redis = require('ioredis')
let _     = require('lodash')

let redisConfig  = requireRoot('configs/redis')
let REDIS        = requireRoot('constants/redis')
let testUtil     = requireRoot('utils/test')
let validateUtil = requireRoot('utils/validate')



/**
 * Adds a member with a specified score to the sorted set.
 *
 * @param {String} redisClient Redis client used to run the query.
 * @param {Object} options
 * @param {String} options.key Redis key for sorted set.
 * @param {Number} options.score Score for the added member.
 * @param {String} options.member Member to be added to the sorted set.
 */
function* addToSortedSet(redisClient, options) {

  validateUtil(options).has({
    key: {
      required : true,
      type     : 'string'
    },
    score: {
      required : true,
      type     : 'number'
    },
    member: {
      required : true,
      type     : 'string'
    },
  })

  yield redisClient.zadd(options.key, options.score, options.member)

}



/**
 * Checks the existence of a Redis key.
 *
 * @param {String} redisClient Redis client used to run the query.
 * @param {Object} options
 * @param {String} options.key Redis key.
 *
 * @return {Boolean}
 */
function* exists(redisClient, options) {

  validateUtil(options).has({
    key : {
      required : true,
      type     : 'string'
    },
  })

  let exists = yield redisClient.exists(options.key)

  return !!exists 

}



/**
 * Gets a batch of members from the sorted set.
 *
 * @param {String} redisClient Redis client used to run the query.
 * @param {Object} options
 * @param {String} options.key Redis key.
 * @param {Number} [options.lastScore='+inf'] Upper bound on score.
 * @param {Number} [options.limit=10] Batch size.
 *
 * @return {Array}
 */
function* getBatchFromSortedSet(redisClient, options) {

  validateUtil(options).has({
    includeScores : {
      default : false,
      type    : 'boolean'
    },
    key : {
      required : true,
      type     : 'string'
    },
    lastScore : {
      type : 'number'
    },
    limit : {
      default : 10,
      type    : 'number'
    }
  })

  let args = [options.key]

  // Set the upper bound excluding the last score
  if (options.lastScore) {
    args.push('(' + options.lastScore)
  }
  else {
    args.push('+inf')
  }

  // Set the lower bound on score
  args.push('-inf')

  // Ensure the scores are returned
  if (options.includeScores) {
    args.push('WITHSCORES')
  }

  // Set the batch size
  args.push('limit', 0, options.limit)

  return yield redisClient.zrevrangebyscore(args)

}



/**
 * Gets the score for a given member at the provided key.
 *
 * @param {String} redisClient Redis client used to run the query.
 * @param {Object} options
 * @param {String} options.key Redis key.
 * @param {String} options.member Sorted set member to get the score for.
 *
 * @return {String}
 */
function* getScoreFromSortedSet(redisClient, options) {

  validateUtil(options).has({
    key : {
      required : true,
      type     : 'string'
    },
    member : {
      required : true,
      type     : 'string'
    }
  })

  return yield redisClient.zscore(options.key, options.member)

}



/**
 * Gets a string value at the provided key.
 *
 * @param {String} redisClient Redis client used to run the query.
 * @param {Object} options
 * @param {String} options.key Redis key.
 *
 * @return {String}
 */
function* getString(redisClient, options) {

  validateUtil(options).has({
    key : {
      required : true,
      type     : 'string'
    }
  })

  return yield redisClient.get(options.key)

}



/**
 * Increments the score for a given member in.
 *
 * @private
 *
 * @param {String} redisClient Redis client used to run the query.
 * @param {Object} options
 * @param {String} [options.amount=1] Amount to increment by.
 * @param {String} options.key Redis key.
 * @param {String} options.member Sorted set member to get the score for.
 *
 * @return {String}
 */
function* incrementScoreInSortedSet(redisClient, options) {

  validateUtil(options).has({
    amount : {
      default : 1,
      type    : 'number'
    },
    key : {
      required : true,
      type     : 'string'
    },
    member : {
      required : true,
      type     : 'string'
    }
  })

  return yield redisClient.zincrby(options.key, options.amount, options.member)

}



/**
 * Creates a Redis connection and returns utility functions.
 * @return {String}
 */
function initialize() {

  let config = Object.assign(
    { keyPrefix: testUtil.randomString() + REDIS.NAMESPACE_DELIMITER },
    redisConfig
  )

  let redisClient = new Redis(config)

  return {
    addToSortedSet            : _.partial(addToSortedSet, redisClient),
    exists                    : _.partial(exists, redisClient),
    getBatchFromSortedSet     : _.partial(getBatchFromSortedSet, redisClient),
    getScoreFromSortedSet     : _.partial(getScoreFromSortedSet, redisClient),
    incrementScoreInSortedSet : _.partial(incrementScoreInSortedSet, redisClient),
    getString                 : _.partial(getString, redisClient),
    reset                     : _.partial(reset, redisClient),
    setString                 : _.partial(setString, redisClient),
  }

}



/**
 * Resets the Redis cache.
 * @param {String} redisClient Redis client used to run the query.
 */
function* reset(redisClient) {
  yield redisClient.flushall()
}



/**
 * Sets a string value at the provided key.
 *
 * @param {String} redisClient Redis client used to run the query.
 * @param {Object} options
 * @param {String} options.key Redis key.
 * @param {String} options.value Value to set at the key.
 */
function* setString(redisClient, options) {

  validateUtil(options).has({
    key : {
      required : true,
      type     : 'string'
    },
    value : {
      required : true,
      type     : 'string'
    }
  })

  yield redisClient.set(options.key, options.value)

}



module.exports = {
  initialize
}
