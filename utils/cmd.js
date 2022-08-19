const { promisify } = require('util')
const _exec = promisify(require('child_process').exec)
const { execSync: _execSync } = require('child_process')

/**
 * 同步执行命令
 * @param {string} cmd 命令
 * @returns {string} 执行结果
 */
function execSync (cmd) {
  return _execSync(cmd, { encoding: 'utf-8' })
}

/**
 * 异步执行命令
 * @param {string} cmd 命令
 * @returns {Promise} 执行结果
 */
async function exec (cmd) {
  return _exec(cmd, { encoding: 'utf-8' })
}

/**
 * 异步执行命令并输出到当前控制台
 * @param {string} cmd 命令
 * @returns {Promise} 执行结果
 */
function execSyncStdio (cmd) {
  return _execSync(cmd, { encoding: 'utf-8', stdio: [0, 1, 2] })
}

/**
 * 进程成功退出
 */
function exitSuccess () {
  process.exit(0)
}

/**
 * 进程失败退出
 * @param {number} code 错误码 默认为 1
 */
function exitFailure (code = 1) {
  process.exit(code)
}

module.exports = {
  execSync,
  exec,
  execSyncStdio,
  exitSuccess,
  exitFailure
}
