var Redis = require('ioredis')
var redis = new Redis()



/**
 * Adds a member with a specified score to the sorted set.
 *
 * @param {String} key Redis key for sorted set.
 * @param {Object} options
 * @param {Number} options.score Score for the added member.
 * @param {String} options.member Member to be added to the sorted set.
 */
function* addToSortedSet(key, options) {
  yield redis.zadd(key, options.score, options.member)
}



/**
 * Checks the existence of a redis key.
 * @param {String} key Redis key.
 * @return {Number}
 */
function* exists(key) {
  return yield redis.exists(key)
}



/**
 * Gets a batch of members from the sorted set.
 * @param {String} key Redis key.
 * @param {Object} options
 * @param {Number} [options.limit] Batch size.
 * @return {Array}
 */
function* getBatchFromSortedSet(key, options) {
  return yield redis.zrevrangebyscore(key, '+inf', '-inf')
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
  reset
}
