import _ from 'lodash'
import { Client } from 'discord.js'
const ytdl = require('ytdl-core-discord')

import { initialize } from '@utils/redis'

const redis = initialize()

/**
 * Adds a song to the queue.
 */
export async function addSongToQueue(client: Client, id: string) {
  const listLength = await redis.getLengthOfList('sonic')
  const info = await ytdl.getBasicInfo(id)
  await redis.pushToList({ key: 'sonic', value: info.video_id })
  await redis.setString({ key: info.video_id, value: info.title })

  if (listLength > 0) {
    return
  }

  // Play song if queue was empty
  await playSongsFromQueue(client)
}

/**
 * Returns the current song queue.
 */
export async function getQueue() {
  const queue = await redis.getRangeFromList({ key: 'sonic' })
  const infoQueue: any[] = await Promise.all(
    queue.map(songId => ytdl.getBasicInfo(songId)),
  )

  return infoQueue.map(info => info.title)
}

/**
 * Plays songs from the queue.
 */
export async function playSongsFromQueue(client: Client) {
  const songId = await redis.getFromList({ key: 'sonic', index: 0 })
  const info = await ytdl.getBasicInfo(songId)

  await client.user.setActivity(info.title, { type: 'PLAYING' })

  // TODO: Change this to only play for current guild
  _.forEach(client.voiceConnections.array(), async voiceConnection => {
    const stream = await ytdl(songId)

    voiceConnection.playOpusStream(stream).on('end', async () => {
      await redis.popFromList('sonic')
      const listLength = await redis.getLengthOfList('sonic')
      if (listLength === 0) {
        return
      }

      await playSongsFromQueue(client)
    })
  })
}
