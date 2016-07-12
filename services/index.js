let co   = require('co')
let fs   = require('fs')
let path = require('path')



/**
 * Directory of services for the bot.
 * @return {Object}
 */
let services = {}



// Get the base name of this file
let basename = path.basename(module.filename)

fs
  .readdirSync(__dirname)
  // Get all files that are not this file
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename))
  // Add services to the services object
  .forEach(file => {

    let filePath = __dirname + '/' + file

    if (fs.lstatSync(filePath).isFile()) {

      let service        = require(filePath)
      let filename       = path.basename(file, '.js')
      services[filename] = service

      if (service.startup) {
        services[filename].startup = co.wrap(service.startup)
      }

    }

  })



module.exports = services
