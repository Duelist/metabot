let template = requireRoot('template')





//////////////
// COMMANDS //
//////////////



/**
 * Command for awarding metacoins.
 * @type {String}
 */
const AWARD = 'award'

/**
 * Command for getting the metacoins leaderboard.
 * @type {String}
 */
const LEADERBOARD = 'leaderboard'

const COMMANDS = {
  AWARD,
  LEADERBOARD
}



/**
 * Message for an awarded metacoin.
 * @type {String}
 */
const AWARDED_MESSAGE = template`A metacoin has been awarded to ${0}.`



/**
 * User ID used to denote the admin.
 * @type {String}
 */
const ADMIN_USER_ID = '179139616274644992'



module.exports = {
  ADMIN_USER_ID,
  AWARDED_MESSAGE,
  COMMANDS
}
