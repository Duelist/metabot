var Discordie = require('discordie')



var client = new Discordie()

client.Dispatcher.on('MESSAGE_CREATE', e => {
  if (e.message.content === 'ping') {
    e.message.channel.sendMessage('pong')
  }
})



module.exports = client
