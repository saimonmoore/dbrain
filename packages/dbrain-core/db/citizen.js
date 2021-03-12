export const publicCitizenDbExtensions = {
  setup: function setup(citizenKlass) {
    citizenKlass.dbrain = citizenKlass.dbrain || {}
    citizenKlass.dbrain.memories = citizenKlass.getTable('dbrain.politis.network/memory')
    citizenKlass.dbrain.collections = citizenKlass.getTable('dbrain.politis.network/collection')
    citizenKlass.dbrain.tags = citizenKlass.getTable('dbrain.politis.network/tag')
  }
}

export const privateCitizenDbExtensions = {
  setup: function setup(citizenKlass) {
    citizenKlass.dbrain = citizenKlass.dbrain || {}
  }
}
