let Discordie   = require('discordie')

let metabotUtil = requireRoot('bot/utils/metabot')

let Events      = Discordie.Events
let client      = new Discordie()



client.Dispatcher.on(Events.MESSAGE_CREATE, metabotUtil.handleMessageCreate)



module.exports = client
