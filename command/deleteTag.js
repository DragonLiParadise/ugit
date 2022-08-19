const { exitFailure, checkLocalTag, deleteLocalTag, checkRemoteTag, deleteRemoteTag } = require('../utils')
const ora = require('ora')
const signale = require('signale')

async function deletingRemoteTag (tagName) {
  const checkLoading = ora('Looking for labels...').start()
  const hasTag = await checkRemoteTag(tagName)
  if (!hasTag) {
    checkLoading.fail(`No remote label [${tagName}] found.`)
    exitFailure()
  } else {
    try {
      checkLoading.succeed(`Find the remote label [${tagName}] `)
      const deleteLoading = ora(`Deleting remote tags [${tagName}]...`).start()
      await deleteRemoteTag(tagName)
      deleteLoading.succeed(`The remote label [${tagName}] was deleted successfully.`)
    } catch (e) {
      signale.error(e)
    }
  }
}

async function deletingLocalTag (tagName) {
  const checkLoading = ora('Looking for labels...').start()
  const hasTag = await checkLocalTag(tagName)
  if (!hasTag) {
    checkLoading.fail(`No remote label [${tagName}] found. `)
    exitFailure()
  } else {
    try {
      checkLoading.succeed(`Find the local label [${tagName}]  `)
      const deleteLoading = ora(`Deleting local tags [${tagName}]...`).start()
      await deleteLocalTag(tagName)
      deleteLoading.succeed(`The local label [${tagName}] was deleted successfully.`)
    } catch (e) {
      signale.error(e)
    }
  }
}

module.exports = async function (tagName, remote) {
  if (remote) {
    await deletingRemoteTag(tagName)
  } else {
    await deletingLocalTag(tagName)
  }
}
