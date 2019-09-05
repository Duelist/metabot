import _ from 'lodash'

import { MESSAGE } from '@bot/commands/metacoins/constants'
import { register as metacoinsServiceRegister } from '@bot/services/metacoins'

const metacoins = metacoinsServiceRegister()

/**
 * Gets a user's metacoins or the metacoins leaderboard.
 */
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
  const author = message.author
  const channel = message.channel

  if (!args || _.isEmpty(args)) {
    const coins = await metacoins.getMetacoinsForUser(author.id)
    await channel.createMessage(
      MESSAGE.METACOIN_COUNT(author.mention, coins.toString()),
    )
    return
  }

  if (args[0] === 'leaderboard') {
    const leaderboard = await metacoins.getLeaderboard()
    await channel.createMessage(leaderboard.toString())
    return
  }
}
