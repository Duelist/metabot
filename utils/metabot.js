let co       = require('co')
let _        = require('lodash')

let commands = requireRoot('commands')
let METABOT  = requireRoot('constants/metabot')



function* handleMessageCreate(event) {

  if (event.message.content[0] === METABOT.PREFIX) {

    // Get the command name and arguments from the message
    let tokens      = _.split(event.message.content.toLowerCase(), ' ')
    let commandName = _.head(tokens).substring(1)
    let args        = _.tail(tokens)
    let command     = commands[commandName]

    if (command) {

      try {
        let result = yield command(args)
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
