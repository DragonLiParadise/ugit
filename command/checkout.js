const { exec, exitFailure, getLocalListSort, getRemoteListSort } = require('../utils')
const signale = require('signale')

function getMatchBranch (matchStr, branches) {
  return (
    branches.find((branchName) =>
      new RegExp(`^${matchStr}$`).test(branchName)
    ) || branches.find((branchName) =>
      new RegExp(`^${matchStr}`).test(branchName)
    ) || branches.find((branchName) => new RegExp(matchStr).test(branchName))
  )
}

module.exports = async function (branchShortName) {
  try {
    const localBranchList = await getLocalListSort()
    const remoteBranchList = await getRemoteListSort()
    const branchShortNameTrim = branchShortName.trim()
    let curBranch
    let isRemoteBranch = false
    if (branchShortNameTrim === '-') {
      curBranch = '-'
    } else {
      curBranch = getMatchBranch(branchShortNameTrim, localBranchList)
      if (!curBranch) {
        curBranch = getMatchBranch(branchShortNameTrim, remoteBranchList)
        isRemoteBranch = true
      }
    }

    if (curBranch) {
      if (isRemoteBranch) {
        signale.success(`The relevant branch was not found locally, but the remote branch was found: ${curBranch}`)
      } else {
        signale.success(`Find the local branch: ${curBranch}`)
      }
      await exec(`git checkout ${curBranch}`)
    } else {
      signale.warn('No related branches were found.')
    }
  } catch (err) {
    signale.error(err)
    exitFailure()
  }
}
