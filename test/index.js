require('../globals')

global.metabot = require('../metabot')
global.metabot.connect({ token: process.env.METABOT_TOKEN })



describe('metabot', () => {
  require('./metabot')
})



describe('commands', () => {
  require('./commands')
})



describe('utils', () => {
  require('./utils')
})
