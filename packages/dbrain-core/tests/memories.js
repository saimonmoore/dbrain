import test from 'ava'
import { createServer, TestFramework } from './_util.js'

let close
let api
let sim = new TestFramework()

test.before(async () => {
  let inst = await createServer()
  close = inst.close
  api = inst.api

  await sim.createCitizen(inst, 'alice')
  await sim.createCitizen(inst, 'bob')
  await sim.createCitizen(inst, 'carla')
  await sim.users.alice.login()
  await sim.createCommunity(inst, 'folks')
  await sim.createCommunity(inst, 'ppl')

  const {alice, bob, carla, folks, ppl} = sim.users
  await alice.login()
  await api.communities.join(folks.userId)
  await api.communities.join(ppl.userId)
  await bob.login()
  await api.communities.join(folks.userId)
  await api.communities.join(ppl.userId)
  await carla.login()
  await api.communities.join(folks.userId)
  await api.communities.join(ppl.userId)
})

test.after.always(async t => {
	await close()
})

test('single user creating memories to self (todo: memories should only be created as part of a collection)', async t => {
  const bob = sim.users.bob
  await bob.createMemory({link: 'http://joplin.com', text: 'note taking app', title: 'no title', type: 'link'})
  await bob.createMemory({link: 'http://copyq.com', text: 'clipboard manager app', title: 'no title', type: 'link'})
  await bob.createMemory({link: 'http://discord.com', text: 'chat app', title: 'no title', type: 'link'})

  let memoryEntries = await api.memories.listUserFeed(bob.userId)
  sim.testFeed(t, memoryEntries, [
    [bob, 'note taking app'],
    [bob, 'clipboard manager app'],
    [bob, 'chat app']
  ])

  memoryEntries = await api.memories.listUserFeed(bob.userId, {reverse: true})
  sim.testFeed(t, memoryEntries, [
    [bob, 'chat app'],
    [bob, 'clipboard manager app'],
    [bob, 'note taking app']
  ])

  memoryEntries = await api.memories.listUserFeed(bob.userId, {limit: 2})
  sim.testFeed(t, memoryEntries, [
    [bob, 'note taking app'],
    [bob, 'clipboard manager app']
  ])

  await api.memories.edit(bob.memories[0].key, {text: '1234'})
  let editedMemory = await api.memories.get(bob.userId, bob.memories[0].key)
  sim.testMemory(t, editedMemory, [bob, '1234'])

  await api.memories.del(bob.memories[0].key)
  await t.throwsAsync(() => api.memories.get(bob.userId, bob.memories[0].key))
  memoryEntries = await api.memories.listUserFeed(bob.userId, {limit: 2})
  sim.testFeed(t, memoryEntries, [
    [bob, 'clipboard manager app'],
    [bob, 'chat app']
  ])
})

// test('multiple users posting to community', async t => {
//   const {alice, bob, carla, folks, ppl} = sim.users
//   await alice.createPost({text: '1', community: {userId: folks.userId, dbUrl: folks.profile.dbUrl}})
//   await bob.createPost({text: '2', community: {userId: folks.userId, dbUrl: folks.profile.dbUrl}})
//   await carla.createPost({text: '3', community: {userId: folks.userId, dbUrl: folks.profile.dbUrl}})
//   await alice.createPost({text: '4', community: {userId: ppl.userId, dbUrl: ppl.profile.dbUrl}})
//   await bob.createPost({text: '5', community: {userId: ppl.userId, dbUrl: ppl.profile.dbUrl}})
//   await carla.createPost({text: '6', community: {userId: ppl.userId, dbUrl: ppl.profile.dbUrl}})

//   let postEntries = await api.posts.listUserFeed(folks.userId)
//   sim.testFeed(t, postEntries, [
//     [alice, '1'],
//     [bob, '2'],
//     [carla, '3']
//   ])

//   postEntries = await api.posts.listUserFeed(folks.userId, {reverse: true})
//   sim.testFeed(t, postEntries, [
//     [carla, '3'],
//     [bob, '2'],
//     [alice, '1']
//   ])

//   postEntries = await api.posts.listUserFeed(folks.userId, {limit: 2})
//   sim.testFeed(t, postEntries, [
//     [alice, '1'],
//     [bob, '2']
//   ])

//   postEntries = await api.posts.listUserFeed(ppl.userId)
//   sim.testFeed(t, postEntries, [
//     [alice, '4'],
//     [bob, '5'],
//     [carla, '6']
//   ])

//   postEntries = await api.posts.listUserFeed(ppl.userId, {reverse: true})
//   sim.testFeed(t, postEntries, [
//     [carla, '6'],
//     [bob, '5'],
//     [alice, '4']
//   ])

//   postEntries = await api.posts.listUserFeed(ppl.userId, {limit: 2})
//   sim.testFeed(t, postEntries, [
//     [alice, '4'],
//     [bob, '5']
//   ])

//   await bob.login()
//   postEntries = await api.posts.listHomeFeed()
//   sim.testFeed(t, postEntries, [
//     [carla, '6'],
//     [bob, '5'],
//     [alice, '4'],
//     [carla, '3'],
//     [bob, '2'],
//     [alice, '1'],
//     [bob, '3'],
//     [bob, '2']
//   ])
//   postEntries = await api.posts.listHomeFeed({limit: 2})
//   sim.testFeed(t, postEntries, [
//     [carla, '6'],
//     [bob, '5']
//   ])
//   postEntries = await api.posts.listHomeFeed({lt: bob.posts[2].key})
//   sim.testFeed(t, postEntries, [
//     [bob, '2']
//   ])

//   await alice.login()
//   await api.posts.edit(alice.posts[0].key, {text: '1234'})
//   postEntries = await api.posts.listUserFeed(folks.userId)
//   sim.testFeed(t, postEntries, [
//     [alice, '1234'],
//     [bob, '2'],
//     [carla, '3']
//   ])

//   await alice.login()
//   await api.posts.del(alice.posts[0].key)
//   await t.throwsAsync(() => api.posts.get(alice.userId, alice.posts[0].key))

//   postEntries = await api.posts.listUserFeed(folks.userId)
//   sim.testFeed(t, postEntries, [
//     [bob, '2'],
//     [carla, '3']
//   ])
// })

// test('extended text', async t => {
//   const bob = sim.users.bob
//   let post = await bob.createPost({text: 'the limited text', extendedText: 'the unlimited text'})
//   let postRecord = await api.posts.get(post.url)
//   t.is(postRecord.value.text, 'the limited text')
//   t.is(postRecord.value.extendedText, 'the unlimited text')
// })
