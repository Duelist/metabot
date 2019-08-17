let metacoinsService = require('@bot/services/metacoins')
let METACOINS = require('@constants/metacoins')
let redis = require('@utils/redis').initialize()

let metacoins

beforeEach(async () => {
  // Reset the cache
  await redis.reset()

  // Register the metacoins service
  metacoins = metacoinsService.register()
})

describe('#award', () => {
  test('awards metacoins to a user', async () => {
    let awarded = await metacoins.award({ userId: '1' })
    expect(awarded).toBe(true)
  })

  test('awards a custom amount of metacoins to a user', async () => {
    let awarded = await metacoins.award({ amount: 3, userId: '2' })
    let coins = await metacoins.getMetacoinsForUser('2')
    expect(awarded).toBe(true)
    expect(coins).toBe(3)
  })
})

describe('#getLeaderboard', () => {
  test('gets the metacoins leaderboard', async () => {
    await metacoins.award({ userId: '3' })
    let leaderboardMessage = await metacoins.getLeaderboard()
    expect(typeof leaderboardMessage).toBe('string')
  })

  test('gets a message when the metacoins leaderboard doesn’t exist', async () => {
    let leaderboardMessage = await metacoins.getLeaderboard()
    expect(leaderboardMessage).toBe(METACOINS.MESSAGE.LEADERBOARD_NOT_FOUND)
  })
})

describe('#getMetacoinsForUser', () => {
  test('gets the metacoins count for a user', async () => {
    await metacoins.award({ userId: '4' })
    let coins = await metacoins.getMetacoinsForUser('4')
    expect(coins).toBe(1)
  })

  test('does not error when the leaderboard doesn’t exist', async () => {
    let coins = await metacoins.getMetacoinsForUser('5')
    expect(coins).toBe(0)
  })
})
