let co       = require('co')
let R        = require('ramda')

let commands = requireRoot('commands')
let METABOT  = requireRoot('constants/metabot')



/**
 * Handles the Discord GATEWAY_READY event.
 * @param {Event} event Gateway ready event.
 */
function* handleGatewayReady(event) {

  let getStartupPromises = R.compose(
    R.map(command => command.startup()),
    R.filter(command => typeof command.startup === 'function'),
    R.filter(command => command.startup),
    R.values
  )

  yield getStartupPromises(commands)

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



module.exports = {
  handleGatewayReady  : co.wrap(handleGatewayReady),
  handleMessageCreate : co.wrap(handleMessageCreate)
}
