let services = requireRoot('services')

let metacoin



function* message(options) {
  // TODO: Display leaderboard or personal coins
  if (options.args[0] === 'award') {
    // TODO: Create discord util for getting id from mention and vice-versa.
    yield metacoin.award({ userId: options.args[1] })
  }
  yield options.message.channel.sendMessage(yield metacoin.getLeaderboard())
}



/**
 * Initializes the metacoin service for use with this command.
 */
function* startup() {
  metacoin = yield services.metacoin.register()
}



module.exports = {
  message,
  startup
}
