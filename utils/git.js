const { exec } = require('./cmd')
const signale = require('signale')
const { exitFailure } = require('./cmd')
const { EOL } = require('os')

/**
 * check current dir is git repository
 * @returns {Boolean}
 */
async function checkGitRepo () {
  try {
    await exec('git rev-parse --is-inside-work-tree  > /dev/null 2>&1')
    return true
  } catch (e) {
    return false
  }
}

/**
 * Check if it is a git repository, and if not, exit the process
 */
async function preCheck () {
  const isGitRepo = await checkGitRepo()
  if (!isGitRepo) {
    signale.error('Current non-git warehouse!')
    exitFailure()
  }
}

/**
 * get current branch name
 * @returns {Promise<string>} branch name
 */
async function getCurBranchName () {
  const { stdout } = await exec('git symbolic-ref -q --short HEAD')
  return stdout.replace(new RegExp(`${EOL}$`), '')
}

/**
 * Access to public commit
 * @param {string} curBranch current branch
 * @param {string} targetBranch target branch
 * @returns {Promise<string>} public commitId
 */
async function getCommonCommit (curBranch, targetBranch) {
  const { stdout } = await exec(`git merge-base  ${targetBranch} ${curBranch}`)
  return stdout.replace(new RegExp(`${EOL}$`), '')
}
/**
 * Get the last submitted commit id
 * @returns {Promise<string>} Get the last submitted commit id
 */
async function getRecentCommitId () {
  const { stdout } = await exec('git rev-parse HEAD')
  return stdout.replace(new RegExp(`${EOL}$`), '')
}

/**
 * Get the last submitted commit
 * @returns {Promise<string>} 最近一次提交信息
 */
async function getRecentCommitMsg () {
  const { stdout } = await exec(
    'git --no-pager log --pretty=format:%s HEAD -1'
  )
  return stdout.replace(new RegExp(`${EOL}$`), '')
}

/**
 * 获取远程名称列表
 * @returns {Promise<String[]>} 远程名称列表
 */
async function getRemoteList () {
  const { stdout } = await exec('git remote show')
  return stdout.split(EOL).filter(Boolean)
}

/**
 * 获取远程名称列表并排序
 * @returns {Promise<String[]>} 远程名称列表
 */
async function getRemoteListSort () {
  const { stdout } = await exec(
    'git for-each-ref --sort=-committerdate "refs/remotes" --format=\'%(refname)\''
  )
  return stdout
    .split(EOL)
    .filter(Boolean)
    .map((ref) => {
      return ref.replace('refs/remotes/origin/', '')
    })
}

/**
 * 获取本地分支名称列表并排序
 * @returns {Promise<String[]>} 本地分支名称列表
 */
async function getLocalListSort () {
  const { stdout } = await exec(
    'git for-each-ref --sort=-committerdate "refs/heads" --format=\'%(refname)\''
  )
  return stdout
    .split(EOL)
    .filter(Boolean)
    .map((ref) => {
      return ref.replace('refs/heads/', '')
    })
}

/**
 * 是否包含远程分支
 * @param {String[]} branchList
 * @returns {Promise<Boolean>} 远程名称列表
 */
async function hasRemoteBranch (branchList) {
  try {
    await exec(`git branch -r | grep -E "${branchList.join('|')}"`)
    return true
  } catch (err) {
    return false
  }
}

/**
 * 获取 ref 信息
 * @returns {Promise<Object>} ref 信息
 */
async function getRefInfo () {
  const SPLIT = '__split__ '
  const { stdout } = await exec(
    `git for-each-ref --color=always "refs/remotes" "refs/heads" --format='%(refname)${SPLIT}%(committerdate)'`
  )
  return stdout
    .split(EOL)
    .filter(Boolean)
    .map((refLine) => {
      const [refName, committerDate] = refLine.split(SPLIT)
      return {
        refName,
        committerDate: new Date(committerDate).getTime() / 1000
      }
    })
}

/**
 * 检查本地分支是否存在
 * @param {string} branchName 本地分支名
 * @returns {Promise<Boolean>} 检查本地分支是否存在
 */
async function hasLocalBranch (branchName) {
  try {
    await exec(`git show-ref --verify --quiet refs/heads/${branchName}`)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 获取 git email
 * @returns {Promise<String>} 邮箱
 */
async function getEmail () {
  const { stdout } = await exec('git config user.email')
  return stdout.replace(new RegExp(`${EOL}$`), '')
}

async function getRepoName () {
  const { stdout } = await exec('git remote get-url origin')
  let pathWithNamespace
  if (stdout.startsWith('git')) {
    pathWithNamespace = stdout.replace(`.git${EOL}`, '').split(':')[1]
  } else {
    pathWithNamespace = stdout.replace(`.git${EOL}`, '').replace(/.*\.com\//, '')
  }
  return pathWithNamespace.split('/').pop()
}

/**
 * 获取冲突文件列表
 */
async function getConflictFiles () {
  const { stdout } = await exec('git diff --name-only --diff-filter=U')
  return stdout.split(EOL).filter(n => n)
}

/**
 * 获取本地标签列表
 * @returns 本地标签列表
 */
async function getLocalTagList () {
  const { stdout } = await exec('git tag')
  return stdout.split(EOL).filter(n => n)
}

/**
 * 获取远程标签列表
 * @returns 远程标签列表
 */
// git ls-remote --exit-code  --tags --refs origin | sed -E 's/^[[:xdigit:]]+[[:space:]]+refs\/tags\/(.+)/\1/g'
async function getRemoteTagList () {
  const regStr = "'s/^[[:xdigit:]]+[[:space:]]+refs\\/tags\\/(.+)/\\1/g'"
  const { stdout } = await exec(`git ls-remote --exit-code  --tags --refs origin | sed -E ${regStr}`)
  return stdout.split(EOL).filter(n => n)
}

async function checkLocalTag (tagName) {
  const tags = await getLocalTagList()
  return tags.includes(tagName)
}

async function checkRemoteTag (tagName) {
  const tags = await getRemoteTagList()
  return tags.includes(tagName)
}

async function deleteLocalTag (tagName) {
  await exec(`git tag -d ${tagName}`)
}

async function deleteRemoteTag (tagName) {
  await exec(`git push origin :refs/tags/${tagName}`)
}

async function getRootPath () {
  const { stdout } = await exec('git rev-parse --show-toplevel')
  return stdout.replace(new RegExp(`${EOL}$`), '')
}

async function getZentaoIDFromBranchName () {
  const tagMatcher = new RegExp('story[0-9]*|task[0-9]*|bug[0-9]*', 'i')
  const branchName = await getCurBranchName()
  const matched = branchName.match(tagMatcher)
  return matched && matched[0]
}

async function getBranchTypeFromBranchName () {
  const branchName = await getCurBranchName()
  const branchTypes = [
    'feat',
    'fix',
    'refactor',
    'chore',
    'docs',
    'test',
    'merge',
    'release'
  ]
  for (const item of branchTypes) {
    if (branchName.indexOf(item) !== -1) {
      return item
    }
  }
  return false
}

module.exports = {
  checkGitRepo,
  preCheck,
  getCurBranchName,
  getCommonCommit,
  getRecentCommitId,
  getRecentCommitMsg,
  getRemoteList,
  hasRemoteBranch,
  getRefInfo,
  hasLocalBranch,
  getEmail,
  getLocalListSort,
  getRemoteListSort,
  getConflictFiles,
  getRepoName,
  getRemoteTagList,
  getLocalTagList,
  checkLocalTag,
  checkRemoteTag,
  deleteLocalTag,
  deleteRemoteTag,
  getRootPath,
  getZentaoIDFromBranchName,
  getBranchTypeFromBranchName
}
