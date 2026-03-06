export const uViewAdapter = {
  request(config) {
    return new Promise((resolve, reject) => {
      uni.request({
        ...config,
        success: (res) => resolve(this._transformResponse(res)),
        fail: reject
      })
    })
  },

  _transformResponse(res) {
    return {
      data: res.data,
      status: res.statusCode,
      headers: res.header,
      config: res.config
    }
  }
}