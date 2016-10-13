/**
 * Gets a module from the project base path.
 * @param {String} name Module name.
 * @return {Object}
 */
global.requireRoot = name => require(__dirname + '/' + name)


/**
 * Discord ids of bot admin users.
 * @type {String[]}
 */
global.ADMIN_IDS = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(' ') : []


/**
 * Determines if the app is running in the production environment.
 * @type {Boolean}
 */
global.PRODUCTION = process.env.NODE_ENV === 'production'
