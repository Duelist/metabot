var co       = require('co')
var _        = require('lodash')

var commands = requireRoot('commands')
var METABOT  = requireRoot('constants/metabot')



function* handleMessageCreate(event) {

  if (event.message.content[0] === METABOT.PREFIX) {

    // Get the command name and arguments from the message
    var tokens      = _.split(event.message.content.toLowerCase(), ' ')
    var commandName = _.head(tokens).substring(1)
    var args        = _.tail(tokens)
    var command     = commands[commandName]

    if (command) {

      try {
        var result = yield command(args)
        event.message.channel.sendMessage(result)
      }
      catch (err) {
        event.message.channel.sendMessage(
          METABOT.COMMAND_ERROR_MESSAGE + ': ' + err
        )
      }

    }

  }

}



module.exports = {
  handleMessageCreate: co.wrap(handleMessageCreate)
}
