var METABOT = requireRoot('constants/metabot')



var env = process.env.NODE_ENV || METABOT.ENVIRONMENT.DEV

try {
  var config = require('./config.' + env)
}
catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    config = require('./config.global')
  }
}



module.exports = config
