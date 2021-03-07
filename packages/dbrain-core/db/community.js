export const publicCommunityDbExtension = {
  setup: function setup(communityKlass) {
    communityKlass.dbrain = communityKlass.dbrain || {}
    communityKlass.dbrain.collections = communityKlass.getTable('dbrain.politis.network/collection')

    communityKlass.tagCloudIdx = communityKlass.getTable('dbrain.politis.network/tag-idx')
    communityKlass.collectionIdx = communityKlass.getTable('dbrain.politis.network/collection-idx')

    console.log('[dbrain.db.community] Done setup!')
  }
}
