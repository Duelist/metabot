import _ from 'lodash'

import kingCommand from '@bot/commands/king'
import metacoinsCommand from '@bot/commands/metacoins'
import pingCommand from '@bot/commands/ping'
import { COMMAND_ERROR_MESSAGE, PREFIX } from '@constants/metabot'

// TODO: Read commands from commands folder using command name as folder name
const commands = {
  king: kingCommand,
  metacoins: metacoinsCommand,
  ping: pingCommand,
}

/**
 * Handles the Discord MESSAGE_CREATE event.
 */
async function handleMessageCreate(message: any) {
  if (message.content[0] === PREFIX) {
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
        COMMAND_ERROR_MESSAGE + ': ' + err,
      )
    }
  }
}

export {
  handleMessageCreate,
}
