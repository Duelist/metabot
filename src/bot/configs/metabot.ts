import { token as botToken } from '@bot/configs/metabot-config.json'

/**
 * Discord token for the bot.
 */
export const token = process.env.BOT_TOKEN || botToken
