const ora = require('ora')
const signale = require('signale')
const prompts = require('prompts')
const recent = require('./recent')
const { exec, exitFailure, getRemoteList, getRefInfo, getCurBranchName, exitSuccess } = require('../utils')
const async = require('async')

module.exports = async function (month = '3', yes) {
  const _month = Number(month)

  if (isNaN(_month)) {
    signale.error('Month parameter exception, please enter a number')
    exitFailure()
  }

  const curDate = new Date()
  const beforeThreeMonthDate = new Date(curDate.setMonth(curDate.getMonth() - _month))
  const beforeThreeMonthMonth = beforeThreeMonthDate.getMonth() + 1
  const beforeThreeMonthYear = beforeThreeMonthDate.getFullYear()
  const queryLoading = ora(`We are looking for branches submitted before ${beforeThreeMonthMonth}/${beforeThreeMonthYear}. Please wait a moment.`).start()
  await exec('git fetch -p --quiet')
  const protectedBranchList = [
    { type: 'string', value: 'develop' },
    { type: 'string', value: 'master' },
    { type: 'string', value: 'production' },
    { type: 'string', value: 'gray' },
    { type: 'string', value: 'HEAD' },
    { type: 'regExp', value: 'Release/.*' }
  ]
  const remoteList = await getRemoteList()
  const refPrefixList = [...remoteList.map(remote => `refs/remotes/${remote}/`), 'refs/heads/']
  const protectedRefList = protectedBranchList.reduce((acc, { type, value }) => {
    return [...acc, ...refPrefixList.map(refPrefix => {
      const refString = `${refPrefix}${value}`
      if (type === 'string') {
        return refString
      }
      if (type === 'regExp') {
        return new RegExp(refString)
      }
      return ''
    })]
  }, [])

  const refList = await getRefInfo()
  const dateLimit = new Date(`${beforeThreeMonthYear}-${beforeThreeMonthMonth}-01 00:00:00`).getTime() / 1000
  const cleanRefList = refList
    .filter(ref => {
      const { refName, committerDate } = ref
      const isProtectRef = protectedRefList.find(protectRefName => {
        if (typeof protectRefName === 'string') {
          return protectRefName === refName
        } else {
          return protectRefName.test(refName)
        }
      })
      return !isProtectRef && committerDate < dateLimit
    })
    .map(ref => ref.refName)
  if (cleanRefList.length === 0) {
    queryLoading.succeed(`Branches that were submitted before ${beforeThreeMonthMonth}/${beforeThreeMonthYear} were not found.`)
    exitSuccess()
  }

  const refNameList = refList.map(ref => ref.refName)
  const localRefList = refNameList.filter(ref => ref.startsWith('refs/heads'))
  const remoteRefList = refNameList.filter(ref => ref.startsWith('refs/remotes'))
  const localCleanRefList = cleanRefList.filter(ref => ref.startsWith('refs/heads'))
  const remoteCleanRefList = cleanRefList.filter(ref => ref.startsWith('refs/remotes'))

  queryLoading.succeed(`${beforeThreeMonthYear} 年 ${beforeThreeMonthMonth} 月份之前提交的分支，排除 develop, master, production, gray, /Release/.*/, /t\\d{0,2}$/, /dev-.*/, /test-.*/ 分支`)

  console.log('\n')
  signale.info(`1 - Local branch (${localCleanRefList.length}) ：`)
  console.log('\n')
  await recent(localCleanRefList, [
    'head',
    'commitTime',
    'commitDate',
    'branch',
    'committer',
    'commitMsg'
  ])
  console.log('\n')
  signale.info(`2 - remote branch (${remoteCleanRefList.length}) ：`)
  console.log('\n')
  await recent(remoteCleanRefList, [
    'head',
    'commitTime',
    'commitDate',
    'branch',
    'committer',
    'commitMsg'
  ])

  console.log('\n')
  signale.info(`Number of locally cleanable branches:${localCleanRefList.length} / ${localRefList.length}`)
  signale.info(`Number of remotely cleanable branches:${remoteCleanRefList.length} / ${remoteRefList.length}`)

  const curBranchName = await getCurBranchName()
  const shouldCleanCurBranch = localCleanRefList.includes(`refs/heads/${curBranchName}`)
  async function handleClean () {
    if (shouldCleanCurBranch) {
      await exec('git checkout master >/dev/null 2>&1')
      signale.warn('Switch to the master branch \n')
    }

    const localBranchList = cleanRefList.filter(ref => ref.startsWith('refs/heads/')).map(ref => ref.replace('refs/heads/', ''))
    const remoteBranchList = cleanRefList.filter(ref => ref.startsWith('refs/remotes/')).map(ref => ref.replace('refs/remotes/', ''))
    localBranchList.forEach(async branch => {
      const spinner = ora(`Deleting from the local branch [${branch}]...\n`).start()
      try {
        await exec(`git branch -D ${branch} >/dev/null`)
        spinner.succeed(`the local branch [${branch}] was deleted successfully.`)
      } catch (err) {
        spinner.fail(`Local branch [${branch}] deletion failed.`)
        signale.error(err)
        exitFailure()
      }
    })
    async.mapLimit(remoteBranchList, 20, async remoteBranch => {
      const remotePrefix = remoteList.find(remote => remoteBranch.startsWith(remote))
      const branch = remoteBranch.replace(`${remotePrefix}/`, '')
      const spinner = ora(`Deleting from the remote branch [${remoteBranch}]...\n`).start()
      try {
        await exec(`git push --porcelain ${remotePrefix} --delete heads/${branch} >/dev/null`)
        spinner.succeed(`the remote branch [${remoteBranch}] was deleted successfully.`)
      } catch (err) {
        spinner.fail(`remote branch [${remoteBranch}] deletion failed.`)
        signale.error(err)
      }
    })
  }
  if (yes) {
    await handleClean()
  } else {
    (async () => {
      const response = await prompts({
        type: 'toggle',
        name: 'confirm',
        message: `Do you want to clean up? ${shouldCleanCurBranch ? `⚠️  ${curBranchName} The branch needs to be cleaned and is about to switch to the master branch.\n ` : ''}`,
        initial: false,
        active: 'yes',
        inactive: 'no'
      })
      const { confirm } = response
      if (confirm) {
        await handleClean()
      }
    })()
  }
}
