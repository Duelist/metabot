import Discord from 'discord.js'

import { handleMessageCreate, handleGuildCreate } from '@bot/utils/metabot'

const bot = new Discord.Client()

bot.on('ready', handleGuildCreate)
bot.on('message', handleMessageCreate)

export default bot
