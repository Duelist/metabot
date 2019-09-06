import assert from 'assert'
import Chance from 'chance'
import Table from 'cli-table'
import _ from 'lodash'

import {
  LEADERBOARD_NOT_FOUND_MESSAGE,
  REDIS_LAST_AWARDED_KEY,
  REDIS_LEADERBOARD_KEY,
} from '@constants/metacoins'
import { initialize } from '@utils/redis'

const chance = Chance.Chance()
const redis = initialize()

/**
 * Determines if a registered function should be allowed to award metacoins.
 */
function allowAward(token: string): boolean {
  // Implement logic for disallowing awards here if needed.
  return true
}

/**
 * Awards metacoins to a user.
 */
async function award(
  token,
  { amount = 1, userId }: { amount: number; userId: string },
): Promise<boolean> {
  // Ensure the registered function can award coins right now.
  assert(allowAward(token))

  // Award the coins
  const awarded = await redis.incrementScoreInSortedSet({
    amount: amount,
    key: REDIS_LEADERBOARD_KEY,
    member: userId,
  })

  // Update the last time the registered function awarded coins.
  await redis.addToSortedSet({
    key: REDIS_LAST_AWARDED_KEY,
    member: token,
    score: new Date().getTime(),
  })

  return !!awarded
}

/**
 * Formats the metacoins leaderboard to an easy-to-read string.
 */
function formatLeaderboard(leaderboard: string[]): string {
  const table = new Table({
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
 */
async function getLeaderboard(): Promise<string> {
  const leaderboardExists = await redis.exists({
    key: REDIS_LEADERBOARD_KEY,
  })

  if (leaderboardExists) {
    const leaderboard = await redis.getBatchFromSortedSet({
      includeScores: true,
      key: REDIS_LEADERBOARD_KEY,
    })
    return formatLeaderboard(leaderboard)
  }

  return LEADERBOARD_NOT_FOUND_MESSAGE
}

/**
 * Gets a user's metacoins from cache.
 */
async function getMetacoinsForUser(userId: number): Promise<number> {
  const metacoins = await redis.getScoreFromSortedSet({
    key: REDIS_LEADERBOARD_KEY,
    member: userId,
  })

  if (!metacoins) {
    return 0
  }

  return parseInt(metacoins, 10)
}

/**
 * Registers a function with the service.
 */
export function register(): {
  award: Function,
  getLeaderboard: Function,
  getMetacoinsForUser: Function,
} {
  const token = chance.string()

  return {
    award: _.curry(award)(token),
    getLeaderboard,
    getMetacoinsForUser,
  }
}
