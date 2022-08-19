const { exitFailure, getRootPath } = require('../utils')
const signale = require('signale')

module.exports = async function ({
  list = false
}) {
  try {
    // 无 --list 参数则切换当前仓库根路径
    const rootPath = await getRootPath()
    if (!list) {
      const childProcess = require('child_process')
      childProcess.spawn(
        process.env.SHELL,
        {
          cwd: rootPath,
          stdio: 'inherit'
        }
      )
      signale.success(`switch to repository root path：${rootPath}`)
    } else {
      console.log(rootPath)
    }
  } catch (err) {
    signale.error('Execution failed.', err)
    exitFailure()
  }
}
