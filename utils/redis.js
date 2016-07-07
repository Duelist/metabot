let assert       = require('assert')
let Redis        = require('ioredis')

let REDIS        = requireRoot('constants/redis')
let testUtil     = requireRoot('utils/test')
let validateUtil = requireRoot('utils/validate')

let redis        = new Redis()



/**
 * Adds a member with a specified score to the sorted set.
 *
 * @param {Object} options
 * @param {String} options.key Redis key for sorted set.
 * @param {Number} options.score Score for the added member.
 * @param {String} options.token Token to authenticate command.
 * @param {String} options.member Member to be added to the sorted set.
 */
function* addToSortedSet(options) {

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
    token : {
      required : true,
      type     : 'string'
    }
  })

  let key = yield getNamespacedKey(options.token, options.key)

  yield redis.zadd(key, options.score, options.member)

}



/**
 * Checks the existence of a redis key.
 *
 * @param {Object} options
 * @param {String} options.key Redis key.
 * @param {String} options.token Token to authenticate command.
 *
 * @return {Number}
 */
function* exists(options) {

  validateUtil(options).has({
    key   : {
      required : true,
      type     : 'string'
    },
    token : {
      required : true,
      type     : 'string'
    }
  })

  let key = yield getNamespacedKey(options.token, options.key)

  return yield redis.exists(key)

}



/**
 * Gets a batch of members from the sorted set.
 *
 * @param {Object} options
 * @param {String} options.key Redis key.
 * @param {Number} [options.lastScore='+inf'] Upper bound on score.
 * @param {Number} [options.limit=10] Batch size.
 * @param {String} options.token Token to authenticate command.
 *
 * @return {Array}
 */
function* getBatchFromSortedSet(options) {

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
    token : {
      required : true,
      type     : 'string'
    }
  })

  let key = yield getNamespacedKey(options.token, options.key)

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
 * Gets the registered namespace for the provided token.
 *
 * @private
 *
 * @param {String} token Token assigned to command on registration.
 * @param {String} key Redis key.
 *
 * @return {String}
 */
function* getNamespacedKey(token, key) {

  // Get the token registration status
  let tokenExists = yield redis.sismember(REDIS.NAMESPACE_KEY, token)

  // Ensure the token is registered
  assert(tokenExists)

  return [token, key].join(REDIS.NAMESPACE_DELIMITER)
}



/**
 * Registers a namespace for future redis calls.
 * @return {String}
 */
function* register() {

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




module.exports = {
  addToSortedSet,
  exists,
  getBatchFromSortedSet,
  register,
  reset
}
