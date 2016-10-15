require('./globals')

let metabotConfig = requireRoot('bot/configs/metabot')
let metabot       = requireRoot('bot/metabot')


// Log into Discord with bot token
metabot.connect({ token: metabotConfig.token })
