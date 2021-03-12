#!/usr/bin/env node

import subcommand from 'subcommand'
import * as path from 'path'
import { fileURLToPath } from 'url'
import * as fs from 'fs'

const PACKAGE_JSON_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), 'package.json')

import { start } from 'ctzn'

const match = subcommand({
  commands: [
    {
      name: 'start-test',
      command: args => {
        if (!args.configDir) throw new Error('--configDir required')
        if (!args.domain) throw new Error('--domain required')
        start({
          debugMode: true,
          simulateHyperspace: true,
          port: args.port,
          configDir: args.configDir,
          domain: args.domain,
          extensions: args.extensions || ''
        })
      }
    },
  ],
  root: {
    command: (args) => {
      const packageJson = fs.readFileSync(PACKAGE_JSON_PATH, 'utf8')
      const pkg = JSON.parse(packageJson)
      console.log('dbrain-core', pkg.version)
    }
  }
})
const cmd = match(process.argv.slice(2))
