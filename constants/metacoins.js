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
const REDIS_LAST_AWARDED_KEY = 'lastAwarded'

/**
 * Redis key for metacoin leaderboard.
 * @type {String}
 */
const REDIS_LEADERBOARD_KEY = 'leaderboard'

/**
 * Redis keys.
 * @type {Object}
 */
const REDIS = {
  LAST_AWARDED_KEY : REDIS_LAST_AWARDED_KEY,
  LEADERBOARD_KEY  : REDIS_LEADERBOARD_KEY
}



module.exports = {
  MESSAGE,
  REDIS
}
