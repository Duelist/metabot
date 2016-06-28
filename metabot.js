var Discordie   = require('discordie')

var metabotUtil = requireRoot('utils/metabot')



var Events = Discordie.Events
var client = new Discordie()


client.Dispatcher.on(Events.MESSAGE_CREATE, metabotUtil.handleMessageCreate)



module.exports = client
