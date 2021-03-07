import { memories } from './memories.js'
import { collections } from './collections.js'
import { tags } from './tags.js'

export const apiExtension = {
  setup: function setup(wsServer, config) {
     memories.setup(wsServer, config)
     collections.setup(wsServer, config)
     tags.setup(wsServer, config)
  }
}
