const {
    getCurBranchName,
    getCommonCommit,
    getRecentCommitId,
    getRecentCommitMsg,
    execSyncStdio,
    hasRemoteBranch,
    exec,
    getRemoteList
} = require('../utils')
const ora = require('ora')
const chalk = require('chalk')
const signale = require('signale')
const {exitSuccess, exitFailure} = require('../utils')

module.exports = async function (targetBranch, options) {
    const updateLoading = ora('fetching...').start()
    await ('git fetch -p --quiet')
    updateLoading.succeed('The branch was fetched successfully.')
    const {message, commit} = options
    // 当前分支
    const curBranch = await getCurBranchName()
    const remoteList = await getRemoteList()
    const remoteBranchNameList = remoteList.map(remoteName => `${remoteName}/${targetBranch}`)

    const isRemoteExist = await hasRemoteBranch(remoteBranchNameList)

    if (isRemoteExist) {
        await exec(`git checkout ${targetBranch}`)
        await exec(`git pull origin ${targetBranch} --rebase`)
        await exec(`git checkout ${curBranch}`)
    }

    // 最近公共祖先 commit
    const commonAncestors = await getCommonCommit(curBranch, targetBranch)
    const recentCommitId = await getRecentCommitId()

    const commitMessage = message || await getRecentCommitMsg()
    console.info(chalk.bgGreenBright.black('current branch') + '：' + chalk.greenBright(curBranch))
    console.info(chalk.bgRedBright.black('target branch') + '：' + chalk.redBright(targetBranch))
    console.info(chalk.bgGreenBright.black('public commit') + '：' + chalk.greenBright(commonAncestors))
    console.log('\n')

    if (curBranch === targetBranch) {
        signale.error(`Currently at branch ${targetBranch}, the target branch cannot be the same as the current branch`)
        exitFailure()
    }

    if (recentCommitId === commonAncestors) {
        signale.warn('No commit can be merged with current branch.')
        exitSuccess()
    }

    await exec(`git reset --soft ${commonAncestors}`)
    await exec('git add .')
    await exec(`git commit -m "${commitMessage}"`)

    await exec(`git rebase ${targetBranch}`)
    if (!commit) {
        await exec('git reset --soft HEAD^')
        await exec('git add .')
        await exec(`git push origin ${curBranch}`)
        signale.success('All changes have been committed to the staging area.')
    } else {
        console.log(chalk.green('the merged commit') + '：')
        execSyncStdio('git  --no-pager log --oneline -n 1', {encoding: 'utf-8', stdio: [0, 1, 2]})
        await exec(`git push -f origin ${curBranch}`)
        signale.success('Organize the commit successfully！')
    }
}
