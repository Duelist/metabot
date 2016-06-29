require('./globals')

let config  = require('./config')
let metabot = require('./metabot')



// Log into Discord with bot token
metabot.connect({ token: config.bot.token })
