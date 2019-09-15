import _ from 'lodash'

import lavalinkServers from '@configs/lavalink-servers.json'
import MetaEvent from '@interfaces/MetaEvent'
import Metabot from '@Metabot'

export default class Ready implements MetaEvent {

  client: Metabot

  constructor(client) {
    this.client = client
  }

  get name() {
    return 'ready'
  }

  get once() {
    return true
  }

  async run() {
    this.client.shoukaku.start(lavalinkServers, { id: this.client.user.id })
  }

}
