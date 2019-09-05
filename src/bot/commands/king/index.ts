import { REDIS_KEY } from '@bot/commands/king/constants'
import { initialize } from '@utils/redis'

const redis = initialize()

/**
 * Makes the author of the command the king.
 */
export default async function king({
  args,
  message,
}: {
  args?: string[]
  message: { author: { username: string }; channel: any }
}) {
  let response

  // Get the previous king
  const oldKing = await redis.getString({ key: REDIS_KEY })

  const author = message.author

  if (!oldKing) {
    response = `${author.username} has claimed the throne.`
  } else if (author.username === oldKing) {
    response = `${author.username} has retained the throne.`
  } else {
    response = `${author.username} has usurped the throne from ${oldKing}.`
  }

  // Set the new king to the message author
  await redis.setString({ key: REDIS_KEY, value: author.username })

  // Send the response to the channel it was sent from
  await message.channel.send(response)
}
