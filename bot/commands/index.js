let co   = require('co')
let fs   = require('fs')
let path = require('path')



/**
 * Directory of commands for the bot.
 * @return {Object}
 */
let commands = {}



// Get the base name of this file
let basename = path.basename(module.filename)

fs
  .readdirSync(__dirname)
  // Get all files that are not this file
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename))
  // Add commands from their directories to the commands object
  .forEach(file => {

    let filePath = __dirname + '/' + file

    if (fs.lstatSync(filePath).isDirectory()) {

      let command = require(filePath)
      commands[file] = {}

      if (command.message) {
        commands[file].message = co.wrap(command.message)
      }

    }

  })



module.exports = commands
