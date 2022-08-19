const { exec, getLocalTagList, getRemoteTagList } = require('../utils')
const ora = require('ora')
const chalk = require('chalk')

module.exports = async function (options) {
  const updateLoading = ora('updating git information...').start()
  await exec('git fetch -p --quiet')
  updateLoading.stop()
  const findLoading = ora('searching git information...').start()
  const { remote, local } = options
  let localTagList
  let remoteTagList
  if (local) {
    localTagList = await getLocalTagList()
  }
  if (remote) {
    remoteTagList = await getRemoteTagList()
  }
  if (!local && !remote) {
    localTagList = await getLocalTagList()
    remoteTagList = await getRemoteTagList()
  }
  findLoading.stop()
  if (localTagList) {
    console.info(chalk.bgGreenBright.black('Local tag list'))
    console.log(localTagList.join('\n') + '\n')
  }
  if (remoteTagList) {
    console.info(chalk.bgYellowBright.black('Remote tag list'))
    console.log(remoteTagList.join('\n') + '\n')
  }
}
