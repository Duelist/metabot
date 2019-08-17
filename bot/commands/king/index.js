let KING = requireRoot('bot/commands/king/constants')
let redis = requireRoot('utils/redis').initialize()

/**
 * Makes the author of the command the king.
 * @param {Object} options Message parameters.
 */
async function king(options) {
  let response

  // Get the previous king
  let oldKing = await redis.getString({ key: KING.REDIS_KEY })

  let author = options.message.author

  if (!oldKing) {
    response = `${author.username} has claimed the throne.`
  } else if (author.username === oldKing) {
    response = `${author.username} has retained the throne.`
  } else {
    response = `${author.username} has usurped the throne from ${oldKing}.`
  }

  // Set the new king to the message author
  await redis.setString({ key: KING.REDIS_KEY, value: author.username })

  // Send the response to the channel it was sent from
  await options.message.channel.createMessage(response)
}

module.exports = {
  message: king,
}
