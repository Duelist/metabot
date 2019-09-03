const assert = require('assert')
const chance = require('chance').Chance()
const Table = require('cli-table')
const _ = require('lodash')

const METACOINS = require('@constants/metacoins')
const redis = require('@utils/redis').initialize()
const validateUtil = require('@utils/validate')

/**
 * Determines if a registered function should be allowed to award metacoins.
 * @param {String} token Token for the registered function.
 * @return {Boolean}
 */
function allowAward(token) {
  // Implement logic for disallowing awards here if needed.
  return true
}

/**
 * Awards metacoins to a user.
 *
 * @param {String} token Token for the registered function.
 * @param {Object} options
 *
 * @return {Boolean}
 */
async function award(token, options) {
  validateUtil(options).has({
    amount: {
      default: 1,
      type: 'number',
    },
    userId: {
      required: true,
      type: 'string',
    },
  })

  // Ensure the registered function can award coins right now.
  assert(allowAward(token))

  // Award the coins
  let awarded = await redis.incrementScoreInSortedSet({
    amount: options.amount,
    key: METACOINS.REDIS.LEADERBOARD_KEY,
    member: options.userId,
  })

  // Update the last time the registered function awarded coins.
  await redis.addToSortedSet({
    key: METACOINS.REDIS.LAST_AWARDED_KEY,
    member: token,
    score: new Date().getTime(),
  })

  return !!awarded
}

/**
 * Formats the metacoins leaderboard to an easy-to-read string.
 * @param {Array} leaderboard Leaderboard to format.
 * @return {String}
 */
function formatLeaderboard(leaderboard) {
  let table = new Table({
    head: ['User', 'Metacoins'],
    style: { border: [], head: [] },
  })

  _(leaderboard)
    .chunk(2)
    .each(row => table.push(row))

  return '```' + table.toString() + '```'
}

/**
 * Gets the leaderboard from cache.
 * @return {String}
 */
async function getLeaderboard() {
  let leaderboardExists = await redis.exists({
    key: METACOINS.REDIS.LEADERBOARD_KEY,
  })

  if (leaderboardExists) {
    let leaderboard = await redis.getBatchFromSortedSet({
      includeScores: true,
      key: METACOINS.REDIS.LEADERBOARD_KEY,
    })
    return formatLeaderboard(leaderboard)
  }

  return METACOINS.MESSAGE.LEADERBOARD_NOT_FOUND
}

/**
 * Gets a user's metacoins from cache.
 * @param {Number} userId User's id.
 * @return {Array}
 */
async function getMetacoinsForUser(userId) {
  let metacoins = await redis.getScoreFromSortedSet({
    key: METACOINS.REDIS.LEADERBOARD_KEY,
    member: userId,
  })

  if (!metacoins) {
    return 0
  }

  return parseInt(metacoins, 10)
}

/**
 * Registers a function with the service.
 * @return {Object}
 */
function register() {
  let token = chance.string()

  return {
    award: _.curry(award)(token),
    getLeaderboard,
    getMetacoinsForUser,
  }
}

module.exports = {
  register,
}
