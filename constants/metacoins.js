/////////////
// MESSAGE //
/////////////


/**
 * Message to send if the leaderboard doesn't exist.
 * @type {String}
 */
const LEADERBOARD_NOT_FOUND_MESSAGE = 'No users have metacoins.'

const MESSAGE = {
  LEADERBOARD_NOT_FOUND : LEADERBOARD_NOT_FOUND_MESSAGE
}





///////////
// REDIS //
///////////



/**
 * Redis key for last award times for registered functions.
 * @type {String}
 */
const LAST_AWARDED_REDIS_KEY = 'lastAwarded'

/**
 * Redis key for metacoin leaderboard.
 * @type {String}
 */
const LEADERBOARD_REDIS_KEY = 'leaderboard'

const REDIS = {
  LAST_AWARDED_KEY : LAST_AWARDED_REDIS_KEY,
  LEADERBOARD_KEY  : LEADERBOARD_REDIS_KEY
}



module.exports = {
  MESSAGE,
  REDIS
}
