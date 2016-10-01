require('./globals')

let configs = requireRoot('configs')
let metabot = requireRoot('metabot')



// Log into Discord with bot token
metabot.connect({ token: configs.bot.token })
