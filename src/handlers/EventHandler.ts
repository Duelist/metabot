import Metabot from '@Metabot'
import fs from 'fs'
import path from 'path'

export default class EventHandler {
  client: Metabot

  constructor(client) {
    this.client = client
  }

  initialize() {
    const events = fs.readdirSync(
      path.resolve(this.client.location, 'events'),
    )
    events.forEach(eventName => {
      const event = new (require(`@events/${eventName}`).default)(this.client)
      const boundRunFunction = event.run.bind(event)
      event.once
        ? this.client.once(event.name, boundRunFunction)
        : this.client.on(event.name, boundRunFunction)
    })
  }
}
