var env = process.env.NODE_ENV || 'development'

try {
  var config = require('./config.' + env)
}
catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    config = require('./config.global')
  }
}

module.exports = config
