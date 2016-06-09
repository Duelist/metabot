var env = process.env.NODE_ENV || 'development'
try
{
  var cfg = require('./config.' + env)
}
catch (e)
{
  if (e.code !== 'MODULE_NOT_FOUND') {
    throw e
  } else {
    cfg = require('./config.standard')
  }
}

module.exports = cfg
