#! /usr/bin/env node

const pkg = require('../package.json')
const checkout = require('../command/checkout')
const { preCheck } = require('../utils')

const { program } = require('commander')

const { version } = pkg

program
  .version(version)
  .name('c')
  .arguments('<branch>')
  .usage('<branch>')
  .description('Switch to a matching branch')
  .action(async (branch) => {
    await preCheck()
    checkout(branch)
  })

program.parse(process.argv)
