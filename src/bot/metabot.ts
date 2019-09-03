const Eris = require('eris')

const metabotConfig = require('@bot/configs/metabot')
const metabotUtil = require('@bot/utils/metabot')

const bot = new Eris(metabotConfig.token)

bot.on('messageCreate', metabotUtil.handleMessageCreate)

module.exports = bot
