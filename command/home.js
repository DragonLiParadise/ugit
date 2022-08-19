const { exec, execSync, exitFailure } = require('../utils')
const { EOL } = require('os')
const signale = require('signale')
const prompts = require('prompts')

module.exports = async function () {
  try {
    const { stdout } = await exec('git remote')
    const remoteUrlList = stdout
      .split(EOL)
      .filter(Boolean)
      .map(remote => {
        const url = execSync(`git remote get-url --all ${remote}`)
          .replace(/\n$/, '')
        if (!url.startsWith('git')) {
          return {
            name: remote,
            url
          }
        }
        const httpUrl = url.replace(':', '/').replace(/\.git/, '').replace('git@', 'http://')
        return {
          name: remote,
          url: httpUrl
        }
      })
    const { length } = remoteUrlList
    if (length === 0) {
      return signale.warn('The current warehouse is not configured with a remote warehouse.')
    } else if (length === 1) {
      execSync(`open ${remoteUrlList[0].url}`)
    } else {
      ;(async () => {
        const response = await prompts({
          type: 'select',
          name: 'value',
          message: 'Please select a link to open.',
          choices: remoteUrlList.map(remote => ({
            title: `${remote.name}  (${remote.url})`,
            value: remote.url
          })),
          hint: ''
        })
        const { value } = response
        if (value) {
          execSync(`open ${value}`)
        }
      })()
    }
  } catch (err) {
    signale.error(err)
    exitFailure()
  }
}
