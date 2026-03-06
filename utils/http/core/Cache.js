export class Cache {
  constructor() {
    this.memoryCache = new Map()
  }

  get(key) {
    const entry = this.memoryCache.get(key)
    if (!entry || Date.now() > entry.expire) {
      this.memoryCache.delete(key)
      return null
    }
    return entry.data
  }

  set(key, data, ttl) {
    this.memoryCache.set(key, {
      data,
      expire: Date.now() + ttl
    })
  }

  clear() {
    this.memoryCache.clear()
  }
}