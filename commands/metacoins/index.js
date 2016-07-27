let R         = require('ramda')

let METACOINS = requireRoot('commands/metacoins/constants')
let services  = requireRoot('services')

let metacoins



function* message(options) {

  if (R.isEmpty(options.args)) {
    let coins = yield metacoins.getMetacoinsForUser(
      options.message.author.id
    )
    yield options.message.channel.sendMessage(coins)
  }

  let isAdmin = R.map(
    role => role.name === METACOINS.ADMIN_ROLE_NAME,
    options.message.member.roles
  )

  // Admin commands
  if (isAdmin) {
    if (options.args[0] === 'award') {
      yield metacoins.award({ userId: options.message.author.id })
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
