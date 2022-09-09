const { exec, getRemoteList, hasLocalBranch, getEmail, hasRemoteBranch} = require('../utils')
const signale = require('signale')
const ora = require('ora')
const { exitFailure } = require('../utils')

module.exports = async function (baseBranchName = '') {
  const updateLoading = ora('fetching...').start()
  await ('git fetch -p --quiet')
  updateLoading.succeed('The branch was fetched successfully.')

  const creatorEmail = await getEmail()
  const containEmails = [
    "@globalpay.com",
    "@activenetwork.com"
  ];

  containEmails.forEach(function (email) {
    if (!creatorEmail.search(email)) {
      signale.warn('git config user.email,Please use the company mail.')
      exitFailure()
    }
  })

  console.log('1l:', email);

  const prompts = require('prompts')
  const questions = [
    {
      type: 'text',
      name: 'id',
      message: 'Please enter the jira ticket id.（example:https://heartlandpos.atlassian.net/browse/HR-10010 take 10010）'
    }
  ]

  const response = await prompts(questions)
  const { id } = response
  const finalBranchName = `HR-${id}`
  const isLocalExist = await hasLocalBranch(finalBranchName)

  const remoteList = await getRemoteList()
  const remoteBranchNameList = remoteList.map(remoteName => `${remoteName}/${finalBranchName}`)
  const isRemoteExist = await hasRemoteBranch(remoteBranchNameList)

  if (isLocalExist || isRemoteExist) {
    signale.warn(`[${finalBranchName}] Branch already exists, please change the branch name.`)
  } else if (id === undefined) {
    signale.warn('Branch information is incomplete, please re-operate.')
  } else {
    await exec(`git checkout -b ${finalBranchName} ${baseBranchName} --quiet`)
    signale.success(`Branch [${finalBranchName}] created successfully.`)
    signale.success(`You can see:https://heartlandpos.atlassian.net/browse/${finalBranchName}`)
  }
}
