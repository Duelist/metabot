let kingCommand      = requireRoot('bot/commands/king')
let metacoinsCommand = requireRoot('bot/commands/metacoins')
let pingCommand      = requireRoot('bot/commands/ping')



/**
 * Directory of commands for the bot.
 * @return {Object}
 */
let commands = {
  king      : kingCommand,
  metacoins : metacoinsCommand,
  ping      : pingCommand
}



module.exports = commands
