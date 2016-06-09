var Discordie = require('discordie')
var _         = require('lodash')

var commands  = requireRoot('commands')
const METABOT = requireRoot('constants/metabot')



var client = new Discordie()

client.Dispatcher.on('MESSAGE_CREATE', event => {

  if (event.message.content[0] === METABOT.PREFIX) {

    var tokens      = _.split(event.message.content.toLowerCase(), ' ')
    var commandName = _.head(tokens).substring(1)
    var args        = _.tail(tokens)
    var command     = commands[commandName]

    if (command) {
      var result = command.process(args)
      event.message.channel.sendMessage(result)
    }

  }

})



module.exports = client
