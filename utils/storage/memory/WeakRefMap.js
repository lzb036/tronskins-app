export class WeakRefMap {
  constructor() {
    this.map = new Map()
    this.registry = new FinalizationRegistry(key => {
      this.map.delete(key)
    })
  }

  set(key, value) {
    const wr = new WeakRef(value)
    this.map.set(key, wr)
    this.registry.register(value, key)
  }

  get(key) {
    const wr = this.map.get(key)
    return wr?.deref()
  }
}