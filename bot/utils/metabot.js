let co       = require('co')
let R        = require('ramda')

let commands = requireRoot('bot/commands')
let services = requireRoot('bot/services')
let METABOT  = requireRoot('constants/metabot')



/**
 * Handles the Discord GATEWAY_READY event.
 * @param {Event} event Gateway ready event.
 */
function* handleGatewayReady(event) {

  // Initializes the bot's services
  yield initializeBotFunctions(services)

  // Initializes the bot's commands
  yield initializeBotFunctions(commands)
}



/**
 * Handles the Discord MESSAGE_CREATE event.
 * @param {Event} event Message creation event.
 */
function* handleMessageCreate(event) {

  if (event.message.content[0] === METABOT.PREFIX) {

    // Get the command name and arguments from the message
    let tokens      = R.split(' ', event.message.content)
    let commandName = R.head(tokens).substring(1)
    let args        = R.tail(tokens)
    let command     = commands[commandName]

    if (!command) {
      return
    }

    try {
      yield command.message({ args, message: event.message })
    }
    catch (err) {
      yield event.message.channel.sendMessage(
        METABOT.COMMAND_ERROR_MESSAGE + ': ' + err
      )
    }

  }

}



/**
 * Initialize command and service functions used to operate the bot.
 * @param {Object[]} functions Objects containing function descriptions.
 */
function* initializeBotFunctions(functions) {
  yield R.compose(
    R.map(fn => fn.startup()),
    R.filter(fn => fn.startup && typeof fn.startup === 'function'),
    R.values
  )(functions)
}



module.exports = {
  handleGatewayReady  : co.wrap(handleGatewayReady),
  handleMessageCreate : co.wrap(handleMessageCreate)
}
