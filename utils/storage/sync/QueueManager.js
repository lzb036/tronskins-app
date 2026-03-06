export class SyncQueue {
  constructor() {
    this.queue = []
    this.isProcessing = false
    this.MAX_RETRY = 3
  }

  add(task) {
    this.queue.push(task)
    if (!this.isProcessing) this.process()
  }

  async process() {
    this.isProcessing = true
    while (this.queue.length > 0) {
      const task = this.queue.shift()
      try {
        await task.execute()
      } catch (error) {
        if (task.retryCount < this.MAX_RETRY) {
          task.retryCount++
          this.queue.unshift(task)
        } else {
          console.error('Sync failed:', task)
        }
      }
    }
    this.isProcessing = false
  }
}