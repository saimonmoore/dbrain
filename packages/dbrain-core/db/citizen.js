export const publicCitizenDbExtension = {
  setup: function setup(citizenKlass) {
    citizenKlass.dbrainMemories = citizenKlass.getTable('dbrain.politis.network/memory')
    citizenKlass.dbrainCollections = citizenKlass.getTable('dbrain.politis.network/collection')
    citizenKlass.dbrainTags = citizenKlass.getTable('dbrain.politis.network/tag')
    console.log('[dbrain.db.citizen.public] Done setup!')
  }
}

export const privateCitizenDbExtension = {
  setup: function setup(citizenKlass) {
    console.log('[dbrain.db.citizen.private] Done setup!')
  }
}
