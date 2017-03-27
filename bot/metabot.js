const Eris = require('eris')

const metabotConfig = requireRoot('bot/configs/metabot')
const metabotUtil   = requireRoot('bot/utils/metabot')

const bot = new Eris(metabotConfig.token)

bot.on('messageCreate', metabotUtil.handleMessageCreate)

module.exports = bot
