import { Message } from 'discord.js'

import MetaCommand from '@interfaces/MetaCommand'
import Metabot from '@Metabot'

export default class Ping implements MetaCommand {

  client: Metabot

  constructor(client: Metabot) {
    this.client = client
  }

  get name() {
    return 'ping'
  }

  get description() {
    return 'Test command'
  }

  async run(args: string[], message: Message) {
    await message.channel.send('pong')
  }

}
