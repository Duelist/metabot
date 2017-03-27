let _ = require('lodash')

let METACOINS     = requireRoot('bot/commands/metacoins/constants')
let metabotConfig = requireRoot('bot/configs/metabot')
let services      = requireRoot('bot/services')

let metacoins = services.metacoins.register()



/**
 * Gets a user's metacoins or the metacoins leaderboard.
 * @param {Object} options
 */
function* message(options) {

  let author  = options.message.author
  let channel = options.message.channel

  if (!options.args || _.isEmpty(options.args)) {
    let coins = yield metacoins.getMetacoinsForUser(author.id)
    yield channel.createMessage(
      METACOINS.MESSAGE.METACOIN_COUNT(author.mention, coins.toString())
    )
    return
  }

  let isAdmin = _.includes(metabotConfig.adminIds, author.id)

  // Admin commands
  if (isAdmin) {
    if (options.args[0] === METACOINS.COMMAND.LEADERBOARD) {
      let leaderboard = yield metacoins.getLeaderboard()
      yield channel.createMessage(leaderboard)
      return
    }
  }

}



module.exports = {
  message
}
