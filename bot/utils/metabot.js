let co = require('co')
let _  = require('lodash')

let commands = requireRoot('bot/commands')
let METABOT  = requireRoot('constants/metabot')



/**
 * Handles the Discord MESSAGE_CREATE event.
 * @param {Event} event Message creation event.
 */
function* handleMessageCreate(event) {

  if (event.message.content[0] === METABOT.PREFIX) {

    // Get the command name and arguments from the message
    let tokens      = _.split(event.message.content, ' ')
    let commandName = _.head(tokens).substring(1)
    let args        = _.tail(tokens)
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
  handleMessageCreate : co.wrap(handleMessageCreate)
}
