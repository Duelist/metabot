let METABOT = requireRoot('constants/metabot')



let config
let env = process.env.NODE_ENV || METABOT.ENVIRONMENT.DEV

try {
  config = require('./config.' + env)
}
catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    config = require('./config.global')
  }
}



module.exports = config
