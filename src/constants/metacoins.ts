/////////////
// MESSAGE //
/////////////

/**
 * Message to send if the leaderboard doesn't exist.
 * @type {String}
 */
export const LEADERBOARD_NOT_FOUND_MESSAGE = 'No users have metacoins.'

///////////
// REDIS //
///////////

/**
 * Redis key for last award times for registered functions.
 * @type {String}
 */
export const REDIS_LAST_AWARDED_KEY = 'lastAwarded'

/**
 * Redis key for metacoin leaderboard.
 * @type {String}
 */
export const REDIS_LEADERBOARD_KEY = 'leaderboard'
