import Metabot from '@Metabot'
import { EventEmitter } from 'events'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'

import MetaCommand from '@interfaces/MetaCommand'
import config from '@configs/metabot-config.json'
import { COMMAND_ERROR_MESSAGE, PREFIX } from '@constants/metabot'

const prefix = config.prefix || PREFIX

export default class CommandHandler extends EventEmitter {
  client: Metabot
  commands: Map<string, MetaCommand>

  constructor(client) {
    super()

    this.client = client
    this.commands = new Map()
  }

  initialize() {
    const commands = fs.readdirSync(
      path.resolve(this.client.location, 'commands'),
    )
    commands.forEach(commandName => {
      const command = new (require(`@commands/${commandName}`).default)(this.client)
      this.commands.set(command.name, command)
    })

    this.client.on('message', this.run.bind(this))
  }

  async run(message) {
    if (!message.content.startsWith(prefix)) {
      return
    }

    // Get the command name and arguments from the message
    const tokens = _.split(message.content, ' ')
    const commandName = _.head(tokens).substring(prefix.length)
    const args = _.filter(_.tail(tokens), token => !!token)
    const command = this.commands.get(commandName)

    if (!command) {
      return
    }

    try {
      await command.run(args, message)
    } catch (err) {
      await message.channel.send(COMMAND_ERROR_MESSAGE + ': ' + err)
    }
  }
}
