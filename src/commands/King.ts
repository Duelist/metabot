import { Message } from 'discord.js'

import MetaCommand from '@interfaces/MetaCommand'
import Metabot from '@Metabot'
import { initialize } from '@utils/redis'

export default class King implements MetaCommand {

  client: Metabot
  redisClient

  constructor(client: Metabot) {
    this.client = client
    this.redisClient = initialize('king')
  }

  get name() {
    return 'king'
  }

  get description() {
    return 'Test command'
  }

  async run(args: string[], message: Message) {
    let response

    // Get the previous king
    const oldKing = await this.redisClient.getString('current')

    const author = message.author

    if (!oldKing) {
      response = `${author.username} has claimed the throne.`
    } else if (author.username === oldKing) {
      response = `${author.username} has retained the throne.`
    } else {
      response = `${author.username} has usurped the throne from ${oldKing}.`
    }

    // Set the new king to the message author
    await this.redisClient.setString({ key: 'current', value: author.username })

    // Send the response to the channel it was sent from
    await message.channel.send(response)
  }

}
