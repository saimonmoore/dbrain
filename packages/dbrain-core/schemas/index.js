import path from 'path'
import { promises as fsp } from 'fs'
import { fileURLToPath } from 'url'

const schemasPath = path.join(path.dirname(fileURLToPath(import.meta.url)))
const filenames = await fsp.readdir(schemasPath)
const schemaFilenames = filenames.filter((filename) => path.extname(filename) === '.json')
const schemas = {}

for (let filename of schemaFilenames) {
  try {
    const str = await fsp.readFile(path.join(schemasPath, filename), 'utf8')
    const obj = JSON.parse(str)
    if (!obj.id) throw new Error('No .id')
    schemas[path.basename(filename, '.json')] = obj
  } catch (e) {
    console.error('Failed to load schema', filename)
    console.error(e)
    process.exit(1)
  }
}

export default schemas;
