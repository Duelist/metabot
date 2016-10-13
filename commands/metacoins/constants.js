let template = requireRoot('template')





//////////////
// COMMANDS //
//////////////



/**
 * Command for getting the metacoins leaderboard.
 * @type {String}
 */
const LEADERBOARD = 'leaderboard'

const COMMAND = {
  LEADERBOARD
}





//////////////
// MESSAGES //
//////////////



/**
 * Message for getting a user's metacoins.
 * @type {String}
 */
const METACOIN_COUNT_MESSAGE = template`${0}: You currently have ${1} metacoins.`

const MESSAGE = {
  METACOIN_COUNT : METACOIN_COUNT_MESSAGE
}





module.exports = {
  COMMAND,
  MESSAGE
}
