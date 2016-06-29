require('../globals')

global.metabot = requireRoot('metabot')
global.metabot.connect({ token: process.env.METABOT_TOKEN })



describe('commands', () => {
  require('./commands')
})



describe('utils', () => {
  require('./utils')
})
