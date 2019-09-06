import _ from 'lodash'

import { addSongToQueue, getQueue } from '@bot/services/sonic'

export default async function message({
  args,
  message,
}: {
  args?: string[]
  message: {
    author: { id: string; mention: string; username: string }
    channel: any
  }
}) {
  if (!args || _.isEmpty(args)) {
    return
  }

  if (args[0] === 'queue') {
    if (!args[1]) {
      const queue = await getQueue()
      const response = queue.map((songTitle, i) => {
        return (
          i === 0
            ? `[${i}] [Now Playing] ${songTitle}`
            : `[${i}] ${songTitle}`
        )
      })

      // Send the response to the channel it was sent from
      await message.channel.send('```' + response.join('\n') + '```')
      return
    }

    // Ensure args[1] is formatted properly

    await addSongToQueue(this, args[1])
  }
}
