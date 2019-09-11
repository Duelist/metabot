import { Client, Guild } from 'discord.js'
import _ from 'lodash'
import moment from 'moment'
const ytdl = require('ytdl-core-discord')

import { initialize } from '@utils/redis'

const redis = initialize()

/**
 * Adds a song to the queue.
 */
export async function addSongToQueue({
  client,
  guild,
  id,
}: {
  client: Client
  guild: Guild
  id: string
}) {
  const listLength = await redis.getLengthOfList('sonic')
  const info = await ytdl.getBasicInfo(id)
  const duration = moment
    .utc(parseInt(info.length_seconds, 10) * 1000)
    .format('HH:mm:ss')
  await Promise.all([
    redis.pushToList({ key: 'sonic', value: info.video_id }),
    redis.setString({ key: info.video_id + ':title', value: info.title }),
    redis.setString({ key: info.video_id + ':duration', value: duration }),
  ])

  if (listLength > 0) {
    return
  }

  // Play song if queue was empty
  await playSongsFromQueue({ client, guild })
}

/**
 * Gets the current voice connection for the guild.
 */
async function getVoiceConnection({
  client,
  guild,
}: {
  client: Client
  guild: Guild
}) {
  return _.head(
    client.voiceConnections
      .array()
      .filter(connection => connection.channel.guild.id === guild.id),
  )
}

/**
 * Returns the current song queue.
 */
export async function getQueue() {
  let queue = await redis.getRangeFromList({ key: 'sonic' })
  queue = await Promise.all(
    queue.map(async id => {
      const [title, duration] = await Promise.all([
        redis.getString({ key: id + ':title' }),
        redis.getString({ key: id + ':duration' }),
      ])

      return {
        id,
        title,
        duration,
      }
    }),
  )

  return queue
}

/**
 * Pauses the current song being played.
 */
export async function pauseCurrentSong({
  client,
  guild,
}: {
  client: Client
  guild: Guild
}) {
  const connection = await getVoiceConnection({ client, guild })
  await connection.dispatcher.pause()
}

/**
 * Plays songs from the queue.
 */
export async function playSongsFromQueue({
  client,
  guild,
}: {
  client: Client
  guild: Guild
}) {
  const songId = await redis.getFromList({ key: 'sonic', index: 0 })
  const title = await redis.getString({ key: songId + ':title' })

  await client.user.setActivity(title, { type: 'PLAYING' })

  const connection = await getVoiceConnection({ client, guild })

  const stream = await ytdl(songId)

  connection.playOpusStream(stream).on('end', async () => {
    await redis.popFromList('sonic')
    const listLength = await redis.getLengthOfList('sonic')
    if (listLength === 0) {
      await client.user.setActivity('')
      return
    }

    await playSongsFromQueue({ client, guild })
  })
}

/**
 * Resume the current song being played.
 */
export async function resumeCurrentSong({
  client,
  guild,
}: {
  client: Client
  guild: Guild
}) {
  const connection = await getVoiceConnection({ client, guild })
  await connection.dispatcher.resume()
}

/**
 * Removes the song at the index from the queue.
 */
export async function removeSongFromQueue({
  client,
  guild,
  index,
}: {
  client: Client
  guild: Guild
  index: number
}) {
  if (index === 0) {
    await skipCurrentSong({ client, guild })
    return
  }

  await redis.removeFromList({ index, key: 'sonic' })
}

/**
 * Ends the current song being played.
 */
export async function skipCurrentSong({
  client,
  guild,
}: {
  client: Client
  guild: Guild
}) {
  const connection = await getVoiceConnection({ client, guild })
  await connection.dispatcher.end()
}
