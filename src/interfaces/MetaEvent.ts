import { Message } from 'discord.js'

import Metabot from '@Metabot'

export default interface MetaEvent {
  client: Metabot
  name: string
  once: boolean

  run(args: string[], message: Message): void
}
