export const publicCommunityDbExtensions = {
  setup: function setup(communityKlass, helpers) {
    communityKlass.dbrain = communityKlass.dbrain || {}
    communityKlass.dbrain.collections = communityKlass.getTable('dbrain.politis.network/collection')

    // communityKlass.tagCloudIdx = communityKlass.getTable('dbrain.politis.network/tag-idx')
    // communityKlass.collectionIdx = communityKlass.getTable('dbrain.politis.network/collection-idx')
  }
}
