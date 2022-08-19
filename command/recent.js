const { execSyncStdio, exitFailure } = require('../utils')
const signale = require('signale')

function setColor (str, color) {
  return `%(color:${color})${str}%(color:reset)`
}

const formatObj = {
  head: setColor('%(HEAD)', 'yellow'),
  commitTime: setColor('%(committerdate:relative)', 'green'),
  commitDate: setColor('%(committerdate:short)', 'green'),
  branch: setColor('%(refname:short)', 'yellow'),
  remoteBranch: setColor('%(upstream:short)', 'yellow'),
  committer: setColor('%(committername)', 'green'),
  commitMsg: setColor('%(contents:subject)', 'white'),
  commitId: setColor('%(objectname:short)', 'white')
}

const defaultFormatConfig = Object.keys(formatObj)

module.exports = async function (pattern = 'refs/heads/', formatConfig = defaultFormatConfig) {
  const finalFormat = formatConfig.map(formatKey => formatObj[formatKey]).join('|')
  const finalPattern = Array.isArray(pattern) ? `"${pattern.join('" "')}"` : `"${pattern}"`
  const cmd = `git for-each-ref --color=always --sort=-committerdate ${finalPattern} --format='${finalFormat}' | column -ts '|'`
  try {
    execSyncStdio(cmd)
  } catch (err) {
    signale.error('query failed.', err)
    exitFailure()
  }
}
