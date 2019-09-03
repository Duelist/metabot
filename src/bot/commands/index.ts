let kingCommand = require('@bot/commands/king')
let metacoinsCommand = require('@bot/commands/metacoins')
let pingCommand = require('@bot/commands/ping')

/**
 * Directory of commands for the bot.
 * @return {Object}
 */
let commands = {
  king: kingCommand,
  metacoins: metacoinsCommand,
  ping: pingCommand,
}

module.exports = commands
