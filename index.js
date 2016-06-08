var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))

var Discord = require('discord.js')

var bot = new Discord.Client()

bot.on('message', (message) => {
  if (message.content === 'ping') {
    bot.reply(message, 'pong')
  }
})

bot.loginWithToken(process.env.METABOT_TOKEN)
