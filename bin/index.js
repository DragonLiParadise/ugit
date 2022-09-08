#! /usr/bin/env node

const pkg = require('../package.json')
const pullRequest = require('../command/pullRequest')
const mergeRequest = require('../command/mergeRequest')
const recent = require('../command/recent')
const cleanUp = require('../command/cleanup')
const newBranch = require('../command/newBranch')
const root = require('../command/root')
const home = require('../command/home')
const checkout = require('../command/checkout')
const rebase = require('../command/rebase')
const touch = require('../command/touch')
const lsTag = require('../command/lsTag')
const deleteTag = require('../command/deleteTag')
const { preCheck, getConflictFiles } = require('../utils')
const signale = require('signale')

const { program } = require('commander')

const { version } = pkg

process.on('unhandledRejection', async (event) => {
  const { stdout, code, message } = event
  const { EOL } = require('os')
  signale.error(message.replace(EOL, ''))
  if (/CONFLICT/.test(stdout)) {
    const conflictFiles = await getConflictFiles()
    signale.error('Code conflict, please resolve the conflict before submitting.')
    signale.info('The conflict files are as follows:')
    console.table(conflictFiles.join('\n'))
  }
  process.exit(code)
})

program
  .version(version)
  .name('ugit')
  .alias('ug')
  .usage('command [options]')
  .on('--help', () => {
    console.log('')
    console.log('Examples of use:')
    console.log('  $ ug mk t')
    console.log('  $ ug pr master -m \'feat: done\'')
    console.log('  $ ug mr master -m \'feat: done\'')
    console.log('  $ ug recent')
    console.log('  $ ug cleanup')
    console.log('  $ ug nb add-login')
    console.log('  $ ug home')
    console.log('  $ ug root')
    console.log('  $ ug checkout master')
    console.log('  $ ug rebase')
    console.log('  $ ug touch demo')
  })

program
  .command('pull-request <branch>')
  .alias('pr')
  .usage('<branch> [options]')
  .description('pull request the commit of the current branch.')
  .option(
    '-m, --message [message]',
    'Merge all submission commit message (default is the last submission message).'
  )
  .option('-n, --no-commit')
  .action(async (branch, options) => {
    await preCheck()
    pullRequest(branch, options)
  })

program
  .command('root')
  .description('Switch to the current warehouse root directory.')
  .option('-l, --list', 'Show the current warehouse root directory.')
  .action(async (options) => {
    await preCheck()
    root({
      list: options.list
    })
  })

program
  .command('merge-request <branch>')
  .alias('mr')
  .usage('<branch> [options]')
  .description('Merge commit and submit to stable branch.')
  .option(
    '-m, --message [message]',
    'Merge all submission commit message (default is the last submission message).'
  )
  .action(async (branch, options) => {
    await preCheck()
    const { message } = options
    mergeRequest(branch, message)
  })

program
  .command('rebase [branch]')
  .description('Update and rebase the target branch, default to master')
  .action(async (branch) => {
    await preCheck()
    rebase(branch)
  })

program
  .command('touch <fileName>')
  .description('Create a file and add it to the staging area.')
  .action(async (fileName) => {
    await preCheck()
    touch(fileName)
  })

program
  .command('recent')
  .usage('ugit recent')
  .description('Recent branch information.')
  .action(async () => {
    await preCheck()
    recent()
  })

program
  .command('cleanup [month]')
  .alias('cu')
  .option('-y, --yes', 'Confirm clean-up?')
  .description(
    'Clean up branches before n months, including local and remote branches, 3 months by default，' +
      'The [develop, master, production, gray, /Release/.*/, /t\\d{0,2}$/, /dev-.*/, /test-.*/] branch is not included.'
  )
  .action(async (month, options) => {
    await preCheck()
    const { yes } = options
    cleanUp(month, yes)
  })

program
  .command('new-branch [baseBranchName]')
  .alias('nb')
  .description('Create a new branch based on the current branch by default. Branch format: ticket ID')
  .action(async (branchName, baseBranchName) => {
    await preCheck()
    newBranch(branchName, baseBranchName)
  })

program
  .command('home')
  .description('Open the remote repository')
  .action(async () => {
    await preCheck()
    home()
  })

program
  .command('checkout <branch>')
  .alias('c')
  .usage('<branch>')
  .description('Switch to a matching branch')
  .action(async (branch) => {
    await preCheck()
    checkout(branch)
  })

program
  .command('delete-tag  <tagName>')
  .alias('dt')
  .option('-r, --remote', 'Whether it is a remote label？')
  .description('Delete tags. Delete local tags by default.')
  .action(async (tagName, options) => {
    await preCheck()
    const { remote } = options
    deleteTag(tagName, remote)
  })

program
  .command('ls-tag')
  .alias('lt')
  .option('-r, --remote', 'Whether it is a remote label？')
  .option('-l, --local', 'Whether it is a local label？')
  .description('View tags. Default is all tags.')
  .action(async (options) => {
    await preCheck()
    lsTag(options)
  })

program.parse(process.argv)
