/**
 * Returns a pong for your ping.
 * @param {Object} options Message options.
 */
function* ping(options) {
  // Send the response to the channel it was sent from
  yield options.message.channel.createMessage('pong')
}



module.exports = {
  message : ping
}
