require('./globals')

let config  = requireRoot('config')
let metabot = requireRoot('metabot')



// Log into Discord with bot token
metabot.connect({ token: config.bot.token })
