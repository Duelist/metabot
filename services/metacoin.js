let assert       = require('assert')
let R            = require('ramda')

let redisUtil    = requireRoot('utils/redis')
let testUtil     = requireRoot('utils/test')
let validateUtil = requireRoot('utils/validate')

let redis



function allowAward(token, awardedTime) {
  // TODO: Disallow awarding until time threshold has passed
  return true
}



function* award(token, options) {

  validateUtil(options).has({
    userId : {
      required : true,
      type     : 'string'
    }
  })

  let lastAwardedTime = yield redis.getScoreFromSortedSet({
    key    : 'lastAwarded',
    member : token
  })

  assert(allowAward(token, lastAwardedTime))

  let awarded = yield redis.incrementScoreInSortedSet({
    key    : 'leaderboard',
    member : options.userId
  })
  yield redis.addToSortedSet({
    key    : 'lastAwarded',
    member : token,
    score  : (new Date()).getTime()
  })

  return !!awarded

}



function* getLeaderboard() {
  let leaderboardExists = yield redis.exists({ key: 'leaderboard' })
  if (leaderboardExists) {
    return yield redis.getBatchFromSortedSet({ key: 'leaderboard' })
  }

  return 'Leaderboard does not exist.'
}



function* register() {

  let token = testUtil.randomString()

  return {
    award : R.curry(award)(token),
    getLeaderboard
  }

}



function* startup() {
  redis = yield redisUtil.register()
}



module.exports = {
  register,
  startup
}
