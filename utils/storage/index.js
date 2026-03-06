import { SecureStorage } from './disk/SecureStorage'
import { FileManager } from './disk/FileSystem'


export const Storage = {
  // 内存级存取
  memory: {
    get: key => uni.getStorageSync(key),
    set: (key, value) => uni.setStorageSync(key, value)
  },

  // 安全存储
  secure: {
    setItem: SecureStorage.setItem,
    getItem: SecureStorage.getItem
  },

  // 文件系统
  file: {
    write: FileManager.writeFile,
    read: FileManager.readFile
  }
}

// 基于时间戳的清理
export const autoClean = function() {
  const now = Date.now()
  const storageKeys = uni.getStorageInfoSync().keys

  storageKeys.forEach(key => {
    if (key.startsWith('cache_')) {
      const { expire } = uni.getStorageSync(key)
      if (expire < now) uni.removeStorageSync(key)
    }
  })
}