var ping = requireRoot('commands/ping')



/**
 * Directory of commands for the bot.
 * @return {Object}
 */
var commands = {
  ping: {
    name        : 'ping',
    description : 'Pongs your ping.',
    process     : ping
  }
}



module.exports = commands
