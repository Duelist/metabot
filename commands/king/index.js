let redisUtil = requireRoot('utils/redis')
let KING      = requireRoot('commands/king/constants')

let redis



/**
 * Sets up required utilities when the bot is initialized.
 */
function* startup() {
  redis = yield redisUtil.register()
}



/**
 * Makes the author of the command the king.
 *
 * @param {Event} event Discord event.
 *
 * @return {String}
 */
function* king(event) {

  let sentMessage

  // Get the previous king
  let oldKing = yield redis.getString({ key: KING.REDIS_KEY })

  let author = event.message.author

  if (!oldKing) {
    sentMessage = `${author.username} has claimed the throne.`
  }
  else if (author.username === oldKing) {
    sentMessage = `${author.username} has retained the throne.`
  }
  else {
    sentMessage = `${author.username} has usurped the throne from ${oldKing}.`
  }

  // Set the new king to the message author
  yield redis.setString({ key: KING.REDIS_KEY, value: author.username })

  return sentMessage

}



module.exports = {
  message : king,
  startup
}
