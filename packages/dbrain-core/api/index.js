import { setup as setupMemories } from './memories.js'
import { setup as setupCollections } from './collections.js'
import { setup as setupTags } from './tags.js'

export const apiExtensions = {
  setup: function setup(wsServer, config) {
     setupMemories(wsServer, config)
     setupCollections(wsServer, config)
     setupTags(wsServer, config)
  }
}
