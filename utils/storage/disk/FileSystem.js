export class FileManager {
  static CHUNK_SIZE = 1024 * 1024 // 1MB分块

  static async writeFile(path, data) {
    const chunkCount = Math.ceil(data.size / this.CHUNK_SIZE)
    const fileSystem = uni.getFileSystemManager()
    
    for (let i = 0; i < chunkCount; i++) {
      const chunk = data.slice(
        i * this.CHUNK_SIZE,
        (i + 1) * this.CHUNK_SIZE
      )
      await new Promise((resolve) => {
        fileSystem.writeFile({
          filePath: path,
          data: chunk,
          encoding: 'binary',
          success: resolve,
          fail: console.error
        })
      })
    }
  }

  static async readFile(path) {
    return new Promise((resolve) => {
      uni.getFileSystemManager().readFile({
        filePath: path,
        encoding: 'binary',
        success: res => resolve(res.data),
        fail: () => resolve(null)
      })
    })
  }
}