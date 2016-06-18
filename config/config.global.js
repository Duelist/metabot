var METABOT = requireRoot('constants/metabot')



var config = {
  env : METABOT.ENVIRONMENT.DEV,
  bot : { token: process.env.METABOT_TOKEN }
}



module.exports = config
