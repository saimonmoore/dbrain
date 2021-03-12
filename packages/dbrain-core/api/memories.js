import createMlts from 'monotonic-lexicographic-timestamp'
import { db, errors, schemaHelpers, networkHelpers, stringHelpers } from 'ctzn'
import { getMemory, listMemories } from '../db/getters.js'

const { publicUserDbs, privateUserDbs, onDatabaseChange } = db
const { createValidator } = schemaHelpers
const { fetchUserId } = networkHelpers
const { constructEntryUrl, parseEntryUrl } = stringHelpers
const mlts = createMlts()

const listParam = createValidator({
  type: 'object',
  additionalProperties: false,
  properties: {
    lt: {type: 'string'},
    lte: {type: 'string'},
    gt: {type: 'string'},
    gte: {type: 'string'},
    reverse: {type: 'boolean'},
    limit: {type: 'number'}
  }
})

export const setup = function setup(wsServer, config) {
  wsServer.register('memories.listUserFeed', async ([userId, opts], client) => {
    if (opts) {
      listParam.assert(opts)
    }
    opts = opts || {}
    opts.limit = opts.limit && typeof opts.limit === 'number' ? opts.limit : 100
    opts.limit = Math.max(Math.min(opts.limit, 100), 1)

    userId = await fetchUserId(userId)
    const publicUserDb = publicUserDbs.get(userId)
    if (!publicUserDb) throw new errors.NotFoundError('User database not found')

    return listMemories(publicUserDb, opts, userId, client.auth)
  })

  wsServer.register('memories.get', async ([userId, key], client) => {
    if (!key && userId) {
      let parsed = parseEntryUrl(userId)
      if (parsed.schemaId !== 'dbrain.politis.network/memory') {
        throw new errors.ValidationError('Not a post URL')
      }
      userId = await fetchUserId(parsed.origin)
      key = parsed.key
    }

    const publicUserDb = publicUserDbs.get(userId)
    if (!publicUserDb) throw new errors.NotFoundError('User database not found')

    return getMemory(publicUserDb, key, userId, client.auth)
  })

  wsServer.register('memories.create', async ([memory], client) => {
    if (!client?.auth) throw new errors.SessionError()
    const publicUserDb = publicUserDbs.get(client.auth.userId)
    if (!publicUserDb) throw new errors.NotFoundError('User database not found')

    const key = mlts()
    memory.createdAt = memory.updatedAt = (new Date()).toISOString()
    await publicUserDb.dbrain.memories.put(key, memory)

    const url = constructEntryUrl(publicUserDb.url, 'dbrain.politis.network/memory', key)
    return {key, url}
  })

  wsServer.register('memories.edit', async ([key, memory], client) => {
    if (!client?.auth) throw new errors.SessionError()
    const publicUserDb = publicUserDbs.get(client.auth.userId)
    if (!publicUserDb) throw new errors.NotFoundError('User database not found')

    const memoryEntry = await publicUserDb.dbrain.memories.get(key)
    if (!memoryEntry) {
      throw new errors.NotFoundError('Memory not found')
    }

    memoryEntry.value.link = ('link' in memory) ? memory.link : memoryEntry.value.link
    memoryEntry.value.text = ('text' in memory) ? memory.text : memoryEntry.value.text
    memoryEntry.value.title = ('title' in memory) ? memory.title : memoryEntry.value.title
    memoryEntry.value.type = ('type' in memory) ? memory.type : memoryEntry.value.type
    memoryEntry.value.excerpt = ('excerpt' in memory) ? memory.excerpt : memoryEntry.value.excerpt
    // How to associate with a collection?
    await publicUserDb.dbrain.memories.put(key, memoryEntry.value)
    await onDatabaseChange(publicUserDb, [privateUserDbs.get(client.auth.userId)])

    const url = constructEntryUrl(publicUserDb.url, 'dbrain.politis.network/memory', memoryEntry.key)
    return {key, url}
  })

  wsServer.register('memories.del', async ([key], client) => {
    if (!client?.auth) throw new errors.SessionError()
    const publicUserDb = publicUserDbs.get(client.auth.userId)
    if (!publicUserDb) throw new errors.NotFoundError('User database not found')

    await publicUserDb.dbrain.memories.del(key)
    await onDatabaseChange(publicUserDb, [privateUserDbs.get(client.auth.userId)])
  })
}
