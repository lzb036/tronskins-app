export class LRUCache {
  constructor(maxSize = 100) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.hitCount = 0    // 命中统计
    this.missCount = 0   // 未命中统计
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, value)
      this.hitCount++
      return value
    }
    this.missCount++
    return null
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
    this.cache.set(key, value)
  }

  // 自动调整缓存大小（根据设备内存）
  autoAdjust() {
    const { memorySize } = uni.getSystemInfoSync()
    this.maxSize = memorySize >= 4 ? 200 : 100 // 4GB设备扩大缓存
  }
}