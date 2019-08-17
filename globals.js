/**
 * Gets a module from the project base path.
 * @param {String} name Module name.
 * @return {Object}
 */
global.requireRoot = name => require(__dirname + '/' + name)

/**
 * Determines if the app is running in the production environment.
 * @type {Boolean}
 */
global.PRODUCTION = process.env.NODE_ENV === 'production'
