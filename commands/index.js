var ping = requireRoot('commands/ping')
var ow = requireRoot('commands/ow')



/**
 * Directory of commands for the bot.
 * @return {Object}
 */
var commands = {
  ping: {
    description : 'Pongs your ping.',
    process     : ping
  },
  ow: {
    name        : 'ow',
    description : 'Retrieve OW stats.',
    process     : ow,
  }
}



module.exports = commands
