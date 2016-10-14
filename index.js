require('./globals')

let metabotConfig = requireRoot('configs/metabot')
let metabot       = requireRoot('metabot')


// Log into Discord with bot token
metabot.connect({ token: metabotConfig.token })
