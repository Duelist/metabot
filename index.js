require('./globals')

var metabot = require('./metabot')

// Log into Discord with bot token
metabot.connect({ token: process.env.METABOT_TOKEN })
