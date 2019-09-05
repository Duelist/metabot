import Discord from 'discord.js'

import { handleMessageCreate } from '@bot/utils/metabot'

const bot = new Discord.Client()

bot.on('message', handleMessageCreate)

export default bot
