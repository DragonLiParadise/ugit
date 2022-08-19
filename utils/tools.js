const crypto = require('crypto')
const fse = require('fs-extra')
const path = require('path')
const { getRootPath } = require('./git')

const algorithm = 'aes-256-ctr'
const secret = 'hello ugit'
const KEY = crypto
  .createHash('sha256')
  .update(String(secret))
  .digest('base64')
  .substr(0, 32)

const IV_LENGTH = 16

module.exports = {
  toBase64: (str) => {
    const b = Buffer.from(str)
    return b.toString('base64')
  },
  encrypt (text) {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(algorithm, KEY, iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
  },
  decrypt (text) {
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv(algorithm, KEY, iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  },
  async getConfig () {
    const rootPath = await getRootPath()
    const configFilePath = path.join(rootPath, 'git.config.js')
    const isConfigExists = await fse.pathExists(configFilePath)
    if (!isConfigExists) {
      throw new Error('未找到配置文件')
    }
    return require(configFilePath)
  }
}
