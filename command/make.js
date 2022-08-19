const chalk = require('chalk')
const ora = require('ora')
const signale = require('signale')
const prompts = require('prompts')
const {
  getCurBranchName,
  hasRemoteBranch,
  exec,
  getRemoteList,
  exitFailure,
  hasLocalBranch
} = require('../utils')

module.exports = async function (targetBranch, options) {
  const { baseBranch = 'master' } = options
  const updateLoading = ora('fetching branches...').start()
  await exec('git fetch -p --quiet')
  updateLoading.succeed('fetch successfully.')

  // current branch
  const curBranch = await getCurBranchName()

  if (curBranch === targetBranch) {
    signale.error(`It's already in the target branch [${targetBranch}], and the target branch cannot be the same as the current branch.`)
    exitFailure()
  }

  const remoteList = await getRemoteList()
  const remoteBranchNameList = remoteList.map(
    (remoteName) => `${remoteName}/${targetBranch}`
  )
  const isRemoteExist = await hasRemoteBranch(remoteBranchNameList)
  const isLocalExist = await hasLocalBranch(targetBranch)

  const { newBranch } = options
  if (newBranch) {
    // 强制删除分支
    try {
      await exec(`git branch -D ${targetBranch}`)
    } catch (e) {}
    try {
      await exec(`git checkout ${baseBranch}`)
      await exec(`git pull origin ${baseBranch} --rebase`)
      await exec(`git checkout -b ${targetBranch}`)
      await exec(`git merge ${curBranch}`)
      await exec(`git push -u -f origin ${targetBranch}`)
      await exec(`git checkout ${curBranch}`)
      signale.success(`Reset and push branch [${targetBranch}] successfully.`)
    } catch (e) {
      signale.error('operation failed.')
      signale.error(e)
    }
  } else {
    isLocalExist && (await exec(`git branch -D ${targetBranch}`))
    await exec(
      `git checkout ${
        isRemoteExist ? '' : '-b'
      } ${targetBranch} >/dev/null 2>&1`
    )
    const devRemoteBranchNameList = remoteList.map(
      (remoteName) => `${remoteName}/${baseBranch}`
    )
    const isDevRemoteExist = await hasRemoteBranch(devRemoteBranchNameList)
    isDevRemoteExist && signale.log(`merge origin/${baseBranch}`)
    isDevRemoteExist && (await exec(`git merge origin/${baseBranch}`))

    console.info(
      chalk.bgGreenBright.black('current branch') +
        '：' +
        chalk.greenBright(curBranch)
    )
    console.info(
      chalk.bgRedBright.black('target branch') + '：' + chalk.redBright(targetBranch)
    )
    console.info(
      chalk.bgYellowBright.black('stable branch') +
        '：' +
        chalk.greenBright(baseBranch)
    )
    console.log('\n')

    await exec(`git merge ${curBranch}`)
    let isPublish = false
    if (isRemoteExist) {
      signale.log(`push to the remote branch of branch [${targetBranch}].`)
      await exec('git push --porcelain 1> /dev/null')
      isPublish = true
    } else {
      const response = await prompts({
        type: 'toggle',
        name: 'confirm',
        message: `The remote branch of branch [${targetBranch}] does not exist. Do you want continue pushing?`,
        initial: true,
        active: 'yes',
        inactive: 'no'
      })
      const { confirm } = response
      if (confirm) {
        await exec(
          `git push origin  ${targetBranch} --porcelain 1> /dev/null`
        )
      }
    }
    await exec(`git checkout ${curBranch} >/dev/null 2>&1`)
    signale.success(`commit ${isPublish ? 'push' : ''} success.`)
  }
}
