/**
 * Returns a pong for your ping.
 * @param {Object} options Message options.
 *        {Object} [options.args] Received arguments.
 *        {Message} options.message Received message.
 */
async function ping(options) {
  // Send the response to the channel it was sent from
  await options.message.channel.createMessage('pong')
}

module.exports = {
  message: ping,
}
