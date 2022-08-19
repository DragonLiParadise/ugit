const { exec, exitFailure } = require('../utils')
const signale = require('signale')

module.exports = async function (filename) {
  try {
    await exec(`touch ${filename}`)
    await exec(`git add ${filename}`)
  } catch (err) {
    signale.error(err)
    exitFailure()
  }
}
