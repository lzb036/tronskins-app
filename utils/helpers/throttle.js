// throttle.js
export const appThrottle = (fn, delay = 300) => {
  let lastCall = 0
  let animationFrameId = null

  return function(...args) {
    const now = Date.now()
    
    if (now - lastCall < delay) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      
      animationFrameId = requestAnimationFrame(() => {
        lastCall = now
        fn.apply(this, args)
      })
    } else {
      lastCall = now
      fn.apply(this, args)
    }
  }
}