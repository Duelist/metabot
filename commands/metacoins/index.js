let R         = require('ramda')

let METACOINS = requireRoot('commands/metacoins/constants')
let config    = requireRoot('config')
let services  = requireRoot('services')

let metacoins



/**
 * Gets a user's metacoins or the metacoins leaderboard.
 * @param {Object} options
 */
function* message(options) {

  let author  = options.message.author
  let channel = options.message.channel

  if (!options.args || R.isEmpty(options.args)) {
    let coins = yield metacoins.getMetacoinsForUser(author.id)
    yield channel.sendMessage(
      METACOINS.MESSAGE.METACOIN_COUNT(author.mention, coins.toString())
    )
    return
  }

  let isAdmin = R.contains(author.id, config.bot.adminIds)

  // Admin commands
  if (isAdmin) {
    if (options.args[0] === METACOINS.COMMAND.LEADERBOARD) {
      let leaderboard = yield metacoins.getLeaderboard()
      yield channel.sendMessage(leaderboard)
      return
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
