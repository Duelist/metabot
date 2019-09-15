import { Message, Guild } from 'discord.js'
import _ from 'lodash'
import moment from 'moment'
import parseDuration from 'parse-duration'

import MetaCommand from '@interfaces/MetaCommand'
import Metabot from '@Metabot'
import { initialize } from '@utils/redis'

export default class King implements MetaCommand {
  client: Metabot
  players
  redisClient

  constructor(client: Metabot) {
    this.client = client
    this.redisClient = initialize('sonic')
    this.players = new Map()
  }

  get name() {
    return 'sonic'
  }

  get description() {
    return 'Sonic Music Player'
  }

  get usage() {
    return [
      '```',
      'Commands',
      'queue - Displays the current queue.',
      'queue <youtube-video-id> - Queues the video found at youtube-video-id.',
      'queue soundcloud <search terms> - Queues the first video found on Soundcloud using the provided search terms.',
      'queue youtube <search terms> - Queues the first video found on Youtube using the provided search terms.',
      'pause - Pauses the currently playing song.',
      'remove <index> - Removes the song at the specified index from the queue.',
      'resume - Resumes the song if it is currently paused.',
      'skip - Skips the currently playing song.',
      '```',
    ].join('\n')
  }

  /**
   * Adds a song to the queue.
   */
  async addSongToQueue({
    message,
    id,
    type,
  }: {
    message: Message
    id: string
    type?: 'soundcloud' | 'youtube'
  }) {
    const listLength = await this.redisClient.getLengthOfList('queue')

    const node = this.client.shoukaku.getNode()

    let data = type
      ? await node.rest.resolve(id, type)
      : await node.rest.resolve(id)

    if (!data) {
      return
    }

    // Use the first track if the returned data is a playlist, if it exists
    if (Array.isArray(data.tracks)) {
      if (_.isEmpty(data.tracks)) {
        await message.reply(`No tracks were found.`)
        return
      }
      data = data.tracks[0]
    }

    const duration = moment
      .utc(parseInt(data.info.length, 10))
      .format('HH:mm:ss')

    await Promise.all([
      this.redisClient.pushToList({
        key: 'queue',
        value: data.info.identifier,
      }),
      this.redisClient.setString({
        key: [data.info.identifier, 'track'].join(':'),
        value: data.track,
      }),
      this.redisClient.setString({
        key: [data.info.identifier, 'title'].join(':'),
        value: data.info.title,
      }),
      this.redisClient.setString({
        key: [data.info.identifier, 'duration'].join(':'),
        value: duration,
      }),
    ])

    if (listLength > 0) {
      return
    }

    // Play song if queue was empty
    await this.playSongsFromQueue({ message })
  }

  /**
   * Returns the current song queue.
   */
  async getQueue() {
    let queue = await this.redisClient.getRangeFromList({ key: 'queue' })
    queue = await Promise.all(
      queue.map(async id => {
        const [title, duration] = await Promise.all([
          this.redisClient.getString({ key: [id, 'title'].join(':') }),
          this.redisClient.getString({ key: [id, 'duration'].join(':') }),
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
   * Gets or creates a Shoukaku player.
   */
  async getOrCreatePlayer({ message }) {
    const node = this.client.shoukaku.getNode()

    let player = this.players.get(message.guild.id)
    if (!player) {
      player = await node.joinVoiceChannel({
        guildID: message.guild.id,
        voiceChannelID: message.member.voice.channel.id,
      })
      player.on('end', async () => {
        await this.redisClient.popFromList('queue')
        const listLength = await this.redisClient.getLengthOfList('queue')
        if (listLength === 0) {
          await this.client.user.setActivity('')
          return
        }

        await this.playSongsFromQueue({ message })
      })

      this.players.set(message.guild.id, player)
    }

    return player
  }

  /**
   * Pauses the current song being played.
   */
  async pauseCurrentSong({ message }: { message: Message }) {
    const player = this.players.get(message.guild.id)
    if (player) {
      await player.setPaused()
    }
  }

  /**
   * Plays songs from the queue.
   */
  async playSongsFromQueue({ message }: { message: Message }) {
    const id = await this.redisClient.getFromList({ key: 'queue', index: 0 })
    const [player, title, track] = await Promise.all([
      this.getOrCreatePlayer({ message }),
      this.redisClient.getString({ key: [id, 'title'].join(':') }),
      this.redisClient.getString({ key: [id, 'track'].join(':') }),
    ])

    await Promise.all([
      this.client.user.setActivity(title, { type: 'PLAYING' }),
      player.playTrack(track),
    ])
  }

  /**
   * Removes the song at the index from the queue.
   */
  async removeSongFromQueue({
    message,
    index,
  }: {
    message: Message
    index: number
  }) {
    if (index === 0) {
      await this.skipCurrentSong({ message })
      return
    }

    await this.redisClient.removeFromList({ index, key: 'queue' })
  }

  /**
   * Resume the current song being played.
   */
  async resumeCurrentSong({ message }: { message: Message }) {
    const player = this.players.get(message.guild.id)
    if (player) {
      await player.setPaused(false)
    }
  }

  /**
   * Seeks to the provided timestamp in the current song.
   */
  async seekWithinCurrentSong({
    message,
    timestamp,
  }: {
    message: Message
    timestamp: string
  }) {
    const player = this.players.get(message.guild.id)
    if (player) {
      await player.seekTo(parseDuration(timestamp))
    }
  }

  /**
   * Ends the current song being played.
   */
  async skipCurrentSong({ message }: { message: Message }) {
    const player = this.players.get(message.guild.id)
    if (!player) {
      return
    }

    await player.stopTrack()
  }

  async run(args: string[], message: Message) {
    // Do nothing if there is no way to find the guild to play a song to
    const guild = _.get(message, 'channel.guild')
    if (!guild) {
      return
    }

    if (!args || _.isEmpty(args)) {
      await message.channel.send(this.usage)
      return
    }

    if (!_.get(message, 'member.voice.channel.id')) {
      await message.reply('You must be in a voice channel to use this command.')
      return
    }

    if (args[0] === 'pause') {
      await this.pauseCurrentSong({ message })
    }

    if (args[0] === 'queue') {
      if (!args[1]) {
        const queue = await this.getQueue()
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

      if (args[1] === 'soundcloud' || args[1] === 'youtube') {
        await this.addSongToQueue({
          message,
          id: args.slice(2).join(' '),
          type: args[1],
        })
        return
      }

      await this.addSongToQueue({
        message,
        id: args[1],
      })

      return
    }

    if (args[0] === 'remove') {
      const index = parseInt(args[1], 10)
      if (isNaN(index)) {
        return
      }

      await this.removeSongFromQueue({
        message,
        index: parseInt(args[1], 10),
      })
      return
    }

    if (args[0] === 'resume') {
      await this.resumeCurrentSong({ message })
      return
    }

    if (args[0] === 'seek') {
      const timestamp = args.slice(1).join('')
      await this.seekWithinCurrentSong({ message, timestamp })
      return
    }

    if (args[0] === 'skip') {
      await this.skipCurrentSong({ message })
      return
    }
  }
}
