let assert       = require('assert')
let Redis        = require('ioredis')
let R            = require('ramda')

let REDIS        = requireRoot('constants/redis')
let testUtil     = requireRoot('utils/test')
let validateUtil = requireRoot('utils/validate')

let redis        = new Redis()



/**
 * Adds a member with a specified score to the sorted set.
 *
 * @param {String} namespace Namespace to locate the key.
 * @param {Object} options
 * @param {String} options.key Redis key for sorted set.
 * @param {Number} options.score Score for the added member.
 * @param {String} options.member Member to be added to the sorted set.
 */
function* addToSortedSet(namespace, options) {

  validateUtil(options).has({
    key    : {
      required : true,
      type     : 'string'
    },
    score  : {
      required : true,
      type     : 'number'
    },
    member : {
      required : true,
      type     : 'string'
    },
  })

  let key = yield getNamespacedKey(namespace, options.key)

  yield redis.zadd(key, options.score, options.member)

}



/**
 * Checks the existence of a redis key.
 *
 * @param {String} namespace Namespace to locate the key.
 * @param {Object} options
 * @param {String} options.key Redis key.
 *
 * @return {Boolean}
 */
function* exists(namespace, options) {

  validateUtil(options).has({
    key : {
      required : true,
      type     : 'string'
    },
  })

  let key = yield getNamespacedKey(namespace, options.key)

  let exists = yield redis.exists(key)

  return !!exists 

}



/**
 * Gets a batch of members from the sorted set.
 *
 * @param {String} namespace Namespace to locate the key.
 * @param {Object} options
 * @param {String} options.key Redis key.
 * @param {Number} [options.lastScore='+inf'] Upper bound on score.
 * @param {Number} [options.limit=10] Batch size.
 *
 * @return {Array}
 */
function* getBatchFromSortedSet(namespace, options) {

  validateUtil(options).has({
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
    },
  })

  let key = yield getNamespacedKey(namespace, options.key)

  let args = [key]

  // Set the upper bound excluding the last score
  if (options.lastScore) {
    args.push('(' + options.lastScore)
  }
  else {
    args.push('+inf')
  }

  // Set the lower bound on score
  args.push('-inf')

  // Set the batch size
  args.push('limit', 0, options.limit)

  return yield redis.zrevrangebyscore(args)

}



/**
 * Gets the score for a given member at the provided key.
 *
 * @param {String} namespace Namespace to locate the key.
 * @param {Object} options
 * @param {String} options.key Redis key.
 * @param {String} options.member Sorted set member to get the score for.
 *
 * @return {String}
 */
function* getScoreFromSortedSet(namespace, options) {

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

  let key = yield getNamespacedKey(namespace, options.key)

  return yield redis.zscore(key, options.member)

}



/**
 * Gets a string value at the provided key.
 *
 * @param {String} namespace Namespace to locate the key.
 * @param {Object} options
 * @param {String} options.key Redis key.
 *
 * @return {String}
 */
function* getString(namespace, options) {

  validateUtil(options).has({
    key : {
      required : true,
      type     : 'string'
    }
  })

  let key = yield getNamespacedKey(namespace, options.key)

  return yield redis.get(key)

}



/**
 * Gets the key with the appropriate namespace.
 *
 * @private
 *
 * @param {String} namespace Namespace to locate the key.
 * @param {String} key Redis key.
 *
 * @return {String}
 */
function* getNamespacedKey(namespace, key) {

  // Get the namespace registration status
  let namespaceExists = yield redis.sismember(REDIS.NAMESPACE_KEY, namespace)

  // Ensure the namespace is registered
  assert(namespaceExists)

  return [namespace, key].join(REDIS.NAMESPACE_DELIMITER)

}



/**
 * Increments the score for a given member in.
 *
 * @private
 *
 * @param {String} namespace Namespace to locate the key.
 * @param {Object} options
 * @param {String} [options.amount=1] Amount to increment by.
 * @param {String} options.key Redis key.
 * @param {String} options.member Sorted set member to get the score for.
 *
 * @return {String}
 */
function* incrementScoreInSortedSet(namespace, options) {

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

  let key = yield getNamespacedKey(namespace, options.key)

  return yield redis.zincrby(key, options.amount, options.member)

}



/**
 * Registers a namespace for future redis calls.
 * @return {String}
 */
function* register() {

  let namespace = yield registerNamespace()

  return {
    addToSortedSet            : R.curry(addToSortedSet)(namespace),
    exists                    : R.curry(exists)(namespace),
    getBatchFromSortedSet     : R.curry(getBatchFromSortedSet)(namespace),
    getScoreFromSortedSet     : R.curry(getScoreFromSortedSet)(namespace),
    incrementScoreInSortedSet : R.curry(incrementScoreInSortedSet)(namespace),
    getString                 : R.curry(getString)(namespace),
    setString                 : R.curry(setString)(namespace),
  }

}



/**
 * Registers a namespace in the registry.
 *
 * @private
 *
 * @return {String}
 */
function* registerNamespace() {

  // Generate a random token
  let token = testUtil.randomString()

  // Ensure the token does not exist in the namespace registry
  do {
    token = testUtil.randomString()
  } while (yield redis.sismember(REDIS.NAMESPACE_KEY, token))

  // Add the new token to the namespace registry
  yield redis.sadd(REDIS.NAMESPACE_KEY, token)

  return token

}



/**
 * Resets the redis cache.
 */
function* reset() {
  yield redis.flushall()
}



/**
 * Sets a string value at the provided key.
 *
 * @param {String} namespace Namespace to locate the key.
 * @param {Object} options
 * @param {String} options.key Redis key.
 * @param {String} options.value Value to set at the key.
 */
function* setString(namespace, options) {

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

  let key = yield getNamespacedKey(namespace, options.key)

  yield redis.set(key, options.value)

}



module.exports = {
  register,
  reset
}
