let METABOT = requireRoot('constants/metabot')



/**
 * Default configuration for the bot.
 * @type {Object}
 */
let config = {
  env : METABOT.ENVIRONMENT.DEV,
  bot : { token: process.env.METABOT_TOKEN }
}



module.exports = config
