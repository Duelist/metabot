let assert       = require('assert')
let Table        = require('cli-table')
let R            = require('ramda')

let METACOINS    = requireRoot('constants/metacoins')
let redisUtil    = requireRoot('utils/redis')
let testUtil     = requireRoot('utils/test')
let validateUtil = requireRoot('utils/validate')

let redis



/**
 * Determines if a registered function should be allowed to award metacoins.
 * TODO: Implement logic for disallowing awards here if needed.
 *
 * @param {String} token Token for the registered function.
 *
 * @return {Boolean}
 */
function allowAward(token) {
  return true
}



/**
 * Awards metacoins to a user.
 *
 * @param {String} token Token for the registered function.
 * @param {Object} options
 */
function* award(token, options) {

  validateUtil(options).has({
    amount : {
      default : 1,
      type    : 'number'
    },
    userId : {
      required : true,
      type     : 'string'
    }
  })

  // Ensure the registered function can award coins right now.
  assert(allowAward(token))

  // Award the coins
  let awarded = yield redis.incrementScoreInSortedSet({
    amount : options.amount,
    key    : METACOINS.REDIS.LEADERBOARD_KEY,
    member : options.userId
  })

  // Update the last time the registered function awarded coins.
  yield redis.addToSortedSet({
    key    : METACOINS.REDIS.LAST_AWARDED_KEY,
    member : token,
    score  : (new Date()).getTime()
  })

  return !!awarded

}



/**
 * Formats the metacoin leaderboard to an easy-to-read string.
 *
 * @param {Array} leaderboard Leaderboard to format.
 *
 * @return {String}
 */
function formatLeaderboard(leaderboard) {

  if (typeof leaderboard === 'string') {
    return leaderboard
  }

  let table = new Table({
    head  : ['User', 'Metacoins'],
    style : { border: [], head: [] }
  })

  R.compose(
    R.forEach(row => table.push(row)),
    R.splitEvery(2)
  )(leaderboard)

  return '```' + table.toString() + '```'

}



/**
 * Gets the leaderboard from cache.
 *
 * @return {String}
 */
function* getLeaderboard() {

  let leaderboardExists = yield redis.exists({
    key: METACOINS.REDIS.LEADERBOARD_KEY
  })

  if (leaderboardExists) {
    let leaderboard = yield redis.getBatchFromSortedSet({
      includeScores : true,
      key           : METACOINS.REDIS.LEADERBOARD_KEY
    })
    return formatLeaderboard(leaderboard)
  }

  return METACOINS.MESSAGE.LEADERBOARD_NOT_FOUND

}



/**
 * Gets a user's metacoins from cache.
 *
 * @param {Number} userId User's id.
 * @return {Array}
 */
function* getMetacoinsForUser(userId) {
  return yield redis.getScoreFromSortedSet({
    key    : METACOINS.REDIS.LEADERBOARD_KEY,
    member : userId
  })
}



/**
 * Registers a function with the service.
 *
 * @return {Object}
 */
function* register() {

  let token = testUtil.randomString()

  return {
    award : R.curry(award)(token),
    getLeaderboard,
    getMetacoinsForUser
  }

}



/**
 * Initializes the service.
 */
function* startup() {
  redis = yield redisUtil.register()
}



module.exports = {
  register,
  startup
}
