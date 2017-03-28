let _ = require('lodash')

let METACOINS = requireRoot('bot/commands/metacoins/constants')
let services  = requireRoot('bot/services')

let metacoins = services.metacoins.register()



/**
 * Gets a user's metacoins or the metacoins leaderboard.
 * @param {Object} options
 */
async function message(options) {

  let author  = options.message.author
  let channel = options.message.channel

  if (!options.args || _.isEmpty(options.args)) {
    let coins = await metacoins.getMetacoinsForUser(author.id)
    await channel.createMessage(
      METACOINS.MESSAGE.METACOIN_COUNT(author.mention, coins.toString())
    )
    return
  }

}



module.exports = {
  message
}
