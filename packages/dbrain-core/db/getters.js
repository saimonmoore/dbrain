import { db, dbHelpers, stringHelpers, networkHelpers } from 'ctzn'

const { dbGet, fetchAuthor, fetchVotes, fetchReplyCount, fetchReplies, fetchSelfIndexFollowerIds, fetchCommunityIndexesFollowerIds } = dbHelpers
const { fetchUserId, fetchUserInfo } = networkHelpers
const { constructEntryUrl, parseEntryUrl } = stringHelpers
const { publicUserDbs } = db

export async function getMemory (db, key, authorId, auth = undefined) {
  const memoryEntry = await db.dbrain.memories.get(key)
  if (!memoryEntry) {
    throw new Error('Memory not found')
  }
  memoryEntry.url = constructEntryUrl(db.url, 'dbrain.politis.network/memory', memoryEntry.key)
  memoryEntry.author = await fetchAuthor(authorId)
  return memoryEntry
}

export async function listMemories (db, opts, authorId, auth = undefined) {
  if (db.dbType === 'ctzn.network/public-citizen-db') {
    const entries = await db.dbrain.memories.list(opts)
    const authorsCache = {}
    for (let entry of entries) {
      entry.url = constructEntryUrl(db.url, 'dbrain.politis.network/memory', entry.key)
      entry.author = await fetchAuthor(authorId, authorsCache)
    }
    return entries
  }
}

export async function getCollection (db, key, authorId, auth = undefined) {
  const collectionEntry = await db.dbrain.collections.get(key)
  if (!collectionEntry) {
    throw new Error('Collection not found')
  }
  collectionEntry.url = constructEntryUrl(db.url, 'dbrain.politis.network/collection', collectionEntry.key)
  collectionEntry.author = await fetchAuthor(authorId)
  return collectionEntry
}

export async function listCollections (db, opts, authorId, auth = undefined) {
  if (db.dbType === 'ctzn.network/public-citizen-db') {
    const entries = await db.dbrain.collections.list(opts)
    const authorsCache = {}
    for (let entry of entries) {
      entry.url = constructEntryUrl(db.url, 'dbrain.politis.network/collection', entry.key)
      entry.author = await fetchAuthor(authorId, authorsCache)
    }
    return entries
  }
}

export async function getTag (db, key, authorId, auth = undefined) {
  const tagEntry = await db.dbrain.tags.get(key)
  if (!tagEntry) {
    throw new Error('Tag not found')
  }
  tagEntry.url = constructEntryUrl(db.url, 'dbrain.politis.network/tag', tagEntry.key)
  tagEntry.author = await fetchAuthor(authorId)
  return tagEntry
}

export async function listTags (db, opts, authorId, auth = undefined) {
  if (db.dbType === 'ctzn.network/public-citizen-db') {
    const entries = await db.dbrain.tags.list(opts)
    const authorsCache = {}
    for (let entry of entries) {
      entry.url = constructEntryUrl(db.url, 'dbrain.politis.network/tag', entry.key)
      entry.author = await fetchAuthor(authorId, authorsCache)
    }
    return entries
  }
}
