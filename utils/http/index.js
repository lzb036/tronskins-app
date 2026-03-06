import { Http } from './core/Http'
import config from '@/config/index.js';
import { uViewAdapter } from './adapters/uview'
import { authInterceptor } from './interceptors/auth'
import { cacheInterceptor } from './interceptors/cache'
import { errorInterceptor } from './interceptors/error'
import {
	getServerCookie
} from '@/utils/storage/modules/domain.js'

// 创建实例
const http = new Http(uViewAdapter, {
  baseURL: getServerCookie(),
  timeout: 600000
})

// 注册拦截器
http.useInterceptor('request', authInterceptor)
http.useInterceptor('request', cacheInterceptor)
http.useInterceptor('response', errorInterceptor)

// 快捷方法
export const get = http.get.bind(http)
export const post = http.post.bind(http)
export const put = http.put.bind(http)
export const deleteHttp = http.delete.bind(http)
export const upload = http.upload.bind(http)
export default http
