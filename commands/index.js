var co   = require('co')

var ping = requireRoot('commands/ping')



/**
 * Directory of commands for the bot.
 * @return {Object}
 */
var commands = {
  ping: {
    description : 'Pongs your ping.',
    process     : co.wrap(ping)
  }
}



module.exports = commands
