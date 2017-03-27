const co = require('co')
const _  = require('lodash')

const commands = requireRoot('bot/commands')
const METABOT  = requireRoot('constants/metabot')



/**
 * Handles the Discord MESSAGE_CREATE event.
 * @param {Message} message Created message.
 */
function* handleMessageCreate(message) {

  if (message.content[0] === METABOT.PREFIX) {

    // Get the command name and arguments from the message
    const tokens      = _.split(message.content, ' ')
    const commandName = _.head(tokens).substring(1)
    const args        = _.tail(tokens)
    const command     = commands[commandName]

    if (!command) {
      return
    }

    try {
      yield command.message({ args, message })
    }
    catch (err) {
      yield message.channel.createMessage(
        METABOT.COMMAND_ERROR_MESSAGE + ': ' + err
      )
    }

  }

}



module.exports = {
  handleMessageCreate: co.wrap(handleMessageCreate)
}
