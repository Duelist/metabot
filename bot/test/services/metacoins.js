let metacoinsService = requireRoot('bot/services/metacoins')
let METACOINS        = requireRoot('constants/metacoins')
let redis            = requireRoot('utils/redis').initialize()

let metacoins



beforeEach(function* () {

  // Reset the cache
  yield redis.reset()

  // Register the metacoins service
  metacoins = metacoinsService.register()

})



describe('#award', () => {

  it('awards metacoins to a user', function* () {
    let awarded = yield metacoins.award({ userId: '1' })
    awarded.should.eql(true)
  })


  it('awards a custom amount of metacoins to a user', function* () {
    let awarded = yield metacoins.award({ amount: 3, userId: '2' })
    let coins   = yield metacoins.getMetacoinsForUser('2')
    awarded.should.eql(true)
    coins.should.eql(3)
  })

})



describe('#getLeaderboard', () => {

  it('gets the metacoins leaderboard', function* () {
    yield metacoins.award({ userId: '3' })
    let leaderboardMessage = yield metacoins.getLeaderboard()
    leaderboardMessage.should.be.of.type('string')
  })


  it('gets a message when the metacoins leaderboard doesn’t exist', function* () {
    let leaderboardMessage = yield metacoins.getLeaderboard()
    leaderboardMessage.should.eql(METACOINS.MESSAGE.LEADERBOARD_NOT_FOUND)
  })

})



describe('#getMetacoinsForUser', () => {

  it('gets the metacoins count for a user', function* () {
    yield metacoins.award({ userId: '4' })
    let coins = yield metacoins.getMetacoinsForUser('4')
    coins.should.eql(1)
  })


  it('does not error when the leaderboard doesn’t exist', function* () {
    let coins = yield metacoins.getMetacoinsForUser('5')
    coins.should.eql(0)
  })

})
