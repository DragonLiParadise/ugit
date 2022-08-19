const { exec, exitFailure, getCurBranchName, hasRemoteBranch, getRemoteList } = require('../utils')
const signale = require('signale')
const ora = require('ora')

module.exports = async function (targetBranch = 'master') {
  try {
    const updateLoading = ora('fetching...').start()
    await ('git fetch -p --quiet')
    updateLoading.succeed('The branch was fetched successfully.')
    const rebaseLoading = ora('rebasing...').start()
    const curBranch = await getCurBranchName()
    const remoteList = await getRemoteList()
    const remoteBranchNameList = remoteList.map(
      (remoteName) => `${remoteName}/${targetBranch}`
    )
    const isTargetRemoteExists = await hasRemoteBranch(remoteBranchNameList)
    if (curBranch === targetBranch) {
      signale.error(`Currently at branch [${targetBranch}]，the target branch can not be the same as current branch.`)
      exitFailure()
    }
    if (isTargetRemoteExists) {
      await exec(`git checkout ${targetBranch}`)
      await exec(`git pull origin ${targetBranch} --rebase`)
      await exec(`git checkout ${curBranch}`)
    }
    await exec(`git rebase ${targetBranch}`)
    rebaseLoading.stop()
    signale.success(`rebase ${targetBranch} branch success.`)
  } catch (e) {
    signale.error(`rebase ${targetBranch} branch failed.`)
    signale.error(e)
    exitFailure()
  }
}
