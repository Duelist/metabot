let assert       = require('assert')
let Table        = require('cli-table')
let R            = require('ramda')

let METACOINS    = requireRoot('constants/metacoins')
let redisUtil    = requireRoot('utils/redis')
let testUtil     = requireRoot('utils/test')
let validateUtil = requireRoot('utils/validate')

let redis



function allowAward(token) {
  // TODO: Implement logic for disallowing awards here if needed.
  return true
}



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



function* getMetacoinsForUser(userId) {
  return yield redis.getScoreFromSortedSet({
    key    : METACOINS.REDIS.LEADERBOARD_KEY,
    member : userId
  })
}



function* register() {

  let token = testUtil.randomString()

  return {
    award : R.curry(award)(token),
    getLeaderboard,
    getMetacoinsForUser
  }

}



function* startup() {
  redis = yield redisUtil.register()
}



module.exports = {
  register,
  startup
}
