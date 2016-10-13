require('./globals')

let metabot = requireRoot('metabot')


// Log into Discord with bot token
metabot.connect({ token: process.env.BOT_TOKEN })
