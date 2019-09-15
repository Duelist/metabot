import 'module-alias/register'
import { Client } from 'discord.js'
import path from 'path'
const { Shoukaku } = require('shoukaku')

import config from '@configs/metabot-config.json'
import CommandHandler from '@handlers/CommandHandler'
import EventHandler from '@handlers/EventHandler'

export default class Metabot extends Client {
  handlers: Map<string, CommandHandler | EventHandler>
  location: string
  shoukaku: any

  constructor(options?: Object) {
    super(options)

    this.location = path.resolve(__dirname)
    this.handlers = new Map()

    // Initialize Shoukaku
    this.shoukaku = new Shoukaku(this, {
      resumable: false,
      resumableTimeout: 30,
      reconnectTries: 2,
      restTimeout: 10000,
    })

    this.shoukaku.on('ready', name =>
      console.log(`Lavalink: ${name} is now connected`),
    )
    this.shoukaku.on('error', (name, error) =>
      console.log(`Lavalink: ${name} emitted an error.`, error),
    )
    this.shoukaku.on('close', (name, code, reason) =>
      console.log(
        `Lavalink: ${name} closed with code ${code}. Reason: ${reason ||
          'No reason'}`,
      ),
    )
    this.shoukaku.on('disconnected', (name, reason) =>
      console.log(
        `Lavalink: ${name} disconnected. Reason: ${reason || 'No reason'}`,
      ),
    )
  }

  initialize() {
    this.handlers.set('commands', new CommandHandler(this))
    this.handlers.set('events', new EventHandler(this))

    this.handlers.forEach(handler => handler.initialize())
  }
}

const bot = new Metabot()
bot.initialize()

bot.login(config.token)
