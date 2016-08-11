let R         = require('ramda')

let METACOINS = requireRoot('commands/metacoins/constants')
let services  = requireRoot('services')

let metacoins



/**
 * Gets a user's metacoins or the metacoins leaderboard.
 *
 * @param {Object} options
 */
function* message(options) {

  if (R.isEmpty(options.args)) {
    let coins = yield metacoins.getMetacoinsForUser(
      options.message.author.id
    )
    yield options.message.channel.sendMessage(coins.toString())
  }

  let isAdmin = options.message.author.id === METACOINS.ADMIN_USER_ID

  // Admin commands
  if (isAdmin) {
    if (options.args[0] === METACOINS.COMMANDS.AWARD) {
      yield metacoins.award({ userId: options.message.author.id })
      yield options.message.channel.sendMessage(
        METACOINS.AWARDED_MESSAGE(options.message.author.username)
      )
    }
    if (options.args[0] === METACOINS.COMMANDS.LEADERBOARD) {
      let leaderboard = yield metacoins.getLeaderboard()
      yield options.message.channel.sendMessage(leaderboard)
    }
  }

}



/**
 * Initializes the metacoins service for use with this command.
 */
function* startup() {
  metacoins = yield services.metacoins.register()
}



module.exports = {
  message,
  startup
}
