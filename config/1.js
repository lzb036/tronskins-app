// 存储所有定时器ID
const timers = new Map(); // 使用Map避免ID重复问题

// 保存原始方法
const originalSetTimeout = window.setTimeout;
const originalSetInterval = window.setInterval;

// 重写setTimeout
window.setTimeout = function(callback, delay, ...args) {
  const timerId = originalSetTimeout.call(this, callback, delay, ...args);
  timers.set(timerId, { type: 'timeout', id: timerId });
  return timerId;
};

// 重写setInterval
window.setInterval = function(callback, delay, ...args) {
  const timerId = originalSetInterval.call(this, callback, delay, ...args);
  timers.set(timerId, { type: 'interval', id: timerId });
  return timerId;
};

// 获取所有定时器
function getAllTimers() {
  return Array.from(timers.values());
}

// 示例：清除所有定时器
function clearAllTimers() {
  getAllTimers().forEach(({ id, type }) => {
    type === 'timeout' ? clearTimeout(id) : clearInterval(id);
    timers.delete(id);
  });
}