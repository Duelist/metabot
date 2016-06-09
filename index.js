require('./globals')

var config  = require('./config')
var metabot = require('./metabot')



// Log into Discord with bot token
metabot.connect({ token: config.bot.token })
