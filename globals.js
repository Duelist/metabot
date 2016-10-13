global.requireRoot = name => require(__dirname + '/' + name)

global.PRODUCTION = process.env.NODE_ENV === 'production'
