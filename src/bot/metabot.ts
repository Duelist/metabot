const Eris = require('eris')

import { token } from '@bot/configs/metabot'
import { handleMessageCreate } from '@bot/utils/metabot'

const bot = new Eris(token)

bot.on('messageCreate', handleMessageCreate)

export default bot
