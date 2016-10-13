let redisUtil = requireRoot('utils/redis')
let KING      = requireRoot('commands/king/constants')

let redis



/**
 * Makes the author of the command the king.
 * @param {Object} options Message parameters.
 */
function* king(options) {

  let response

  // Get the previous king
  let oldKing = yield redis.getString({ key: KING.REDIS_KEY })

  let author = options.message.author

  if (!oldKing) {
    response = `${author.username} has claimed the throne.`
  }
  else if (author.username === oldKing) {
    response = `${author.username} has retained the throne.`
  }
  else {
    response = `${author.username} has usurped the throne from ${oldKing}.`
  }

  // Set the new king to the message author
  yield redis.setString({ key: KING.REDIS_KEY, value: author.username })

  // Send the response to the channel it was sent from
  yield options.message.channel.sendMessage(response)

}



/**
 * Initializes redis for use with this command.
 */
function* startup() {
  redis = yield redisUtil.register()
}



module.exports = {
  message : king,
  startup
}
