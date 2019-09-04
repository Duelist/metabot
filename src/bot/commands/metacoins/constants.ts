import template from '@template'

//////////////
// COMMANDS //
//////////////

/**
 * Command for getting the metacoins leaderboard.
 * @type {String}
 */
const LEADERBOARD = 'leaderboard'

export const COMMAND = {
  LEADERBOARD,
}

//////////////
// MESSAGES //
//////////////

/**
 * Message for getting a user's metacoins.
 * @type {String}
 */
const METACOIN_COUNT_MESSAGE = template`${0}: You currently have ${1} metacoins.`

export const MESSAGE = {
  METACOIN_COUNT: METACOIN_COUNT_MESSAGE,
}
