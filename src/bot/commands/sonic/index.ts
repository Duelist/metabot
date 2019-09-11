import _ from 'lodash'
import { Message } from 'discord.js'

import {
  addSongToQueue,
  getQueue,
  pauseCurrentSong,
  removeSongFromQueue,
  resumeCurrentSong,
  skipCurrentSong,
} from '@bot/services/sonic'

export default async function message({
  args,
  message,
}: {
  args?: string[]
  message: Message
}) {
  // Do nothing if there is no way to find the guild to play a song to
  const guild = message.channel['guild']
  if (!guild) {
    return
  }

  if (!args || _.isEmpty(args)) {
    const response = [
      '```',
      'Commands',
      'queue - Displays the current queue.',
      'queue <youtube-video-id> - Queues the video found at youtube-video-id.',
      'pause - Pauses the currently playing song.',
      'remove <index> - Removes the song at the specified index from the queue.',
      'resume - Resumes the song if it is currently paused.',
      'skip - Skips the currently playing song.',
      '```',
    ]
    await message.channel.send(response.join('\n'))
    return
  }

  if (args[0] === 'pause') {
    await pauseCurrentSong({ client: this, guild })
  }

  if (args[0] === 'queue') {
    if (!args[1]) {
      const queue = await getQueue()
      let response
      if (_.isEmpty(queue)) {
        response = 'Nothing to see here.'
      } else {
        response = queue.map((songData, i) => {
          return i === 0
            ? `[${i}] [Now Playing] ${songData.title} (${songData.duration})`
            : `[${i}] ${songData.title} (${songData.duration})`
        })
        response = response.join('\n')
      }

      // Send the response to the channel it was sent from
      await message.channel.send('```' + response + '```')
      return
    }

    await addSongToQueue({
      client: this,
      guild,
      id: args[1],
    })
  }

  if (args[0] === 'remove') {
    const index = parseInt(args[1], 10)
    if (isNaN(index)) {
      return
    }

    await removeSongFromQueue({
      client: this,
      guild,
      index: parseInt(args[1], 10),
    })
  }

  if (args[0] === 'resume') {
    await resumeCurrentSong({ client: this, guild })
  }

  if (args[0] === 'skip') {
    await skipCurrentSong({ client: this, guild })
  }
}
