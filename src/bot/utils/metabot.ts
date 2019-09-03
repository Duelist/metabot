const _ = require('lodash')

const commands = require('@bot/commands')
const METABOT = require('@constants/metabot')

/**
 * Handles the Discord MESSAGE_CREATE event.
 * @param {Message} message Created message.
 */
async function handleMessageCreate(message) {
  if (message.content[0] === METABOT.PREFIX) {
    // Get the command name and arguments from the message
    const tokens = _.split(message.content, ' ')
    const commandName = _.head(tokens).substring(1)
    const args = _.tail(tokens)
    const command = commands[commandName]

    if (!command) {
      return
    }

    try {
      await command.message({ args, message })
    } catch (err) {
      await message.channel.createMessage(
        METABOT.COMMAND_ERROR_MESSAGE + ': ' + err,
      )
    }
  }
}

module.exports = {
  handleMessageCreate,
}
