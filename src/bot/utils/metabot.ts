import _ from 'lodash'
import { Message } from 'discord.js'

import kingCommand from '@bot/commands/king'
import metacoinsCommand from '@bot/commands/metacoins'
import pingCommand from '@bot/commands/ping'
import sonicCommand from '@bot/commands/sonic'
import { VOICE_CHANNEL_NAME } from '@bot/commands/sonic/constants'
import { COMMAND_ERROR_MESSAGE, PREFIX } from '@constants/metabot'

// TODO: Read commands from commands folder using command name as folder name
const commands = {
  king: kingCommand,
  metacoins: metacoinsCommand,
  ping: pingCommand,
  sonic: sonicCommand,
}

/**
 * Handles the Discord MESSAGE_CREATE event.
 */
export async function handleMessageCreate(message: Message) {
  if (message.content[0] === PREFIX) {
    // Get the command name and arguments from the message
    const tokens = _.split(message.content, ' ')
    const commandName = _.head(tokens).substring(PREFIX.length)
    const args = _.filter(_.tail(tokens), token => !!token)
    const command = commands[commandName]

    if (!command) {
      return
    }

    try {
      await command.call(this, { args, message })
    } catch (err) {
      await message.channel.send(COMMAND_ERROR_MESSAGE + ': ' + err)
    }
  }
}

/**
 * Handles the Discord GUILD_CREATE event.
 */
export async function handleGuildCreate() {
  _.forEach(this.guilds.array(), async guild => {
    let voiceChannel = guild.channels.find(
      channel =>
        channel.name === VOICE_CHANNEL_NAME && channel.type === 'voice',
    )

    if (!voiceChannel) {
      voiceChannel = await guild.createChannel(VOICE_CHANNEL_NAME, {
        type: 'voice',
      })
    }

    // Attempt to join voice channel
    await voiceChannel.join()
  })
}
