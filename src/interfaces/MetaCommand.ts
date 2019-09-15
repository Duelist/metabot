import { Message } from 'discord.js'

import Metabot from '@Metabot'

export default interface MetaCommand {
  client: Metabot
  name: string
  description: string

  run(args: string[], message: Message): void
}
