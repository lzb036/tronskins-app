import {
	getServerCookie
} from '@/utils/storage/modules/domain.js'
import {
	getUserToken,
	setAccessToken,
	clearAuthStorage,
	setAppUserInfo,
	isAccessTokenExpired
} from '@/utils/storage/modules/user.js'

const TOKEN_INVALID_CODES = new Set([401, 1001, '401', '1001'])
const SENSITIVE_HEADER_KEYS = new Set([
	'authorization',
	'x-service-authorization',
	'cookie',
	'set-cookie'
])

function isRecord(value) {
	return value !== null && typeof value === 'object'
}

function toNumber(value) {
	if (typeof value === 'number' && Number.isFinite(value)) return value
	if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
		return Number(value)
	}
	return null
}

function extractTokenPayload(responseData) {
	if (!isRecord(responseData)) return null

	const data = isRecord(responseData.datas) ?
		responseData.datas :
		(isRecord(responseData.data) ? responseData.data : responseData)
	if (!isRecord(data)) return null

	const accessToken = typeof data.accessToken === 'string' ?
		data.accessToken :
		(typeof data.token === 'string' ? data.token : '')
	if (!accessToken) return null

	const accessTokenExpireTime = toNumber(data.accessTokenExpireTime)
	const refreshExpirePrimary = toNumber(data.refreshTokenExpireTime)
	const refreshExpireFallback = toNumber(data.refreshExpireTime)
	const refreshTokenExpireTime = refreshExpirePrimary !== null ?
		refreshExpirePrimary :
		(refreshExpireFallback !== null ? refreshExpireFallback : undefined)
	const header = typeof data.header === 'string' ? data.header : undefined

	const payload = {
		accessToken
	}
	if (accessTokenExpireTime !== null) {
		payload.accessTokenExpireTime = accessTokenExpireTime
	}
	if (typeof refreshTokenExpireTime !== 'undefined') {
		payload.refreshTokenExpireTime = refreshTokenExpireTime
	}
	if (header) {
		payload.header = header
	}
	return payload
}

function isRefreshBusinessSuccess(data) {
	if (!isRecord(data) || typeof data.code === 'undefined') return true
	return data.code === 0 || data.code === 200 || data.code === '0' || data.code === '200'
}

function createRequestLogId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function sanitizeHeaders(headers) {
	if (!isRecord(headers)) return headers
	const masked = {}
	Object.keys(headers).forEach((key) => {
		const lowerKey = key.toLowerCase()
		if (SENSITIVE_HEADER_KEYS.has(lowerKey)) {
			masked[key] = '[masked]'
		} else {
			masked[key] = headers[key]
		}
	})
	return masked
}

function snapshotError(error) {
	if (!error) return { message: 'unknown error' }
	if (typeof error === 'string') return { message: error }
	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
			stack: error.stack
		}
	}
	if (isRecord(error)) {
		return {
			message: error.message || 'request error',
			code: error.code,
			status: error.status,
			statusCode: error.statusCode,
			data: error.data
		}
	}
	return { message: String(error) }
}

function toReadablePath(url) {
	const text = String(url || '')
	if (!text) return '(unknown-url)'
	const schemeIndex = text.indexOf('://')
	if (schemeIndex >= 0) {
		const pathIndex = text.indexOf('/', schemeIndex + 3)
		return pathIndex >= 0 ? text.slice(pathIndex) : '/'
	}
	return text
}

function logPrefix(tag, method, url, requestId) {
	const reqMethod = String(method || 'GET').toUpperCase()
	const path = toReadablePath(url)
	return `${tag} ${path} | ${reqMethod} | #${requestId}`
}

function getBusinessCode(data) {
	if (!isRecord(data)) return '-'
	if (typeof data.code !== 'undefined') return data.code
	if (typeof data.statusCode !== 'undefined') return data.statusCode
	return '-'
}

function getBusinessMessage(data) {
	if (!isRecord(data)) return ''
	if (typeof data.message === 'string' && data.message) return data.message
	if (typeof data.msg === 'string' && data.msg) return data.msg
	if (typeof data.datas === 'string' && data.datas) return data.datas
	return ''
}

export class Http {
	constructor(adapter, config = {}) {
		this.adapter = adapter
		this.config = {
			baseURL: '',
			timeout: 600000,
			cacheTTL: 300000,
			...config
		}
		this.interceptors = {
			request: [],
			response: []
		}
		this.refreshPromise = null
		this.refreshEndpoints = config.refreshEndpoints || [
			'api/app/auth/refresh'
		]
	}

	useInterceptor(type, interceptor) {
		if (['request', 'response'].includes(type)) {
			this.interceptors[type].push(interceptor)
		}
		return this
	}

	async _runInterceptors(type, initialValue) {
		let chain = Promise.resolve(initialValue)
		for (const interceptor of this.interceptors[type]) {
			chain = chain.then(
				(value) => interceptor.handle(value),
				(error) => interceptor.handleError(error)
			)
		}
		return chain
	}

	_shouldAutoRefresh(url, runtimeConfig = {}) {
		if (runtimeConfig.skipAuthRefresh === true) return false
		if (runtimeConfig.autoToken === false) return false
		if (this._isRefreshUrl(url)) return false
		return true
	}

	_isRefreshUrl(url) {
		const target = String(url || '')
		return this.refreshEndpoints.some(endpoint => target.includes(endpoint))
	}

	_isTokenInvalidResponse(response) {
		const statusCode = response?.statusCode ?? response?.status
		if (statusCode === 401) return true

		const data = response?.data
		if (!isRecord(data)) return false
		const code = data.code ?? data.statusCode
		return TOKEN_INVALID_CODES.has(code)
	}

	_buildAuthHeader(token) {
		const header = {}
		if (!token) return header
		header.Authorization = token
		return header
	}

	async _clearAuthState() {
		setAppUserInfo('')
		await clearAuthStorage()
	}

	async _requestRefreshByEndpoint(endpoint) {
		// 【修改点1】：增加 reject 回调，用于处理网络异常
		return new Promise((resolve, reject) => {
			const baseURL = getServerCookie() || this.config.baseURL
			const refreshUrl = `${baseURL}${endpoint}`
			console.log('[AuthRefresh] start', {
				endpoint,
				url: refreshUrl
			})

			uni.request({
				url: refreshUrl,
				method: 'POST',
				data: {},
				header: {
					'Content-Type': 'application/json'
				},
				withCredentials: true,
				success: async (res) => {
					console.log('[AuthRefresh] response', {
						endpoint,
						statusCode: res.statusCode
					})

					// 【修改点2】：将 5xx 服务器宕机错误视为网络异常，而不是明确拒绝
					if (res.statusCode >= 500) {
						console.warn('[AuthRefresh] server error 5xx', {
							endpoint,
							statusCode: res.statusCode
						})
						reject(new Error('NETWORK_OR_SERVER_ERROR'))
						return
					}

					// 4xx 或明确的业务异常，说明 Token 真的失效了，触发掉线
					if (res.statusCode < 200 || res.statusCode >= 300) {
						console.warn('[AuthRefresh] http status not success', {
							endpoint,
							statusCode: res.statusCode,
							data: res.data
						})
						resolve(false)
						return
					}

					if (!isRefreshBusinessSuccess(res.data)) {
						console.warn('[AuthRefresh] business code not success', {
							endpoint,
							data: res.data
						})
						resolve(false)
						return
					}

					const tokenPayload = extractTokenPayload(res.data)
					if (!tokenPayload) {
						console.warn('[AuthRefresh] missing token payload in refresh response', {
							endpoint,
							data: res.data
						})
						resolve(false)
						return
					}

					await setAccessToken(tokenPayload)
					console.log('[AuthRefresh] success', {
						endpoint,
						accessTokenExpireTime: tokenPayload.accessTokenExpireTime ?? null,
						refreshTokenExpireTime: tokenPayload.refreshTokenExpireTime ?? null
					})
					resolve(true)
				},
				fail: (error) => {
					// 【修改点3】：网络断开、超时走 fail，不返回 false，而是抛出异常
					console.error('[AuthRefresh] request fail (Network Error)', {
						endpoint,
						error
					})
					reject(new Error('NETWORK_OR_SERVER_ERROR'))
				}
			})
		})
	}

	async _refreshAccessToken() {
		// 【修改点4】：遇到网络异常自动往上抛出，不拦截
		for (const endpoint of this.refreshEndpoints) {
			const refreshed = await this._requestRefreshByEndpoint(endpoint)
			if (refreshed) return true
		}
		return false
	}

	async _ensureAccessTokenAvailable(forceRefresh = false) {
		const token = await getUserToken()
		if (!token) return false
		if (!forceRefresh) {
			const expired = await isAccessTokenExpired()
			if (!expired) return true
		}

		if (!this.refreshPromise) {
			this.refreshPromise = this._refreshAccessToken().finally(() => {
				this.refreshPromise = null
			})
		}

		// 【修改点5】：捕获网络异常，仅在确定拿到 false(明确拒绝)时才清空状态
		try {
			const refreshed = await this.refreshPromise
			if (!refreshed) {
				await this._clearAuthState()
			}
			return refreshed
		} catch (error) {
			console.error('[AuthRefresh] 刷新过程中出现网络/服务异常，保留登录状态', error)
			throw error // 继续抛出，中断当前的请求，但保留用户登录状态
		}
	}

	async request(config) {
		const {
			url,
			method = 'GET',
			params = {},
			data = {},
			...runtimeConfig
		} = config
		const requestId = createRequestLogId()
		const requestStartedAt = Date.now()

		const needAutoRefresh = this._shouldAutoRefresh(url, runtimeConfig)
		if (needAutoRefresh) {
			const token = await getUserToken()
			if (token) {
				// 【修改点6】：使用 try/catch 捕获网络异常，友好提示用户
				try {
					const available = await this._ensureAccessTokenAvailable(false)
					if (!available) {
						return Promise.reject(new Error('登录已过期，请重新登录'))
					}
				} catch (error) {
					return Promise.reject(new Error('网络请求失败，请检查网络后重试'))
				}
			}
		}

		const requestConfig = {
			url: (getServerCookie() || this.config.baseURL) + url,
			method,
			params,
			data,
			header: {
				'Content-Type': 'application/json',
				...runtimeConfig.headers
			},
			withCredentials: runtimeConfig.withCredentials === true
		}

		try {
			const transformedRequest = await this._runInterceptors('request', requestConfig)
			const reqMethod = transformedRequest.method || method
			const reqUrl = transformedRequest.url || requestConfig.url

			const response = await this.adapter.request(transformedRequest)
			const rawStatusCode = response?.statusCode ?? response?.status
			const rawBizCode = getBusinessCode(response?.data)
			const rawBizMsg = getBusinessMessage(response?.data)
			const rawDuration = Date.now() - requestStartedAt
			
			if (
				needAutoRefresh &&
				!runtimeConfig.__retryAfterRefresh &&
				this._isTokenInvalidResponse(response)
			) {
				const token = await getUserToken()
				if (token) {
					// 【修改点7】：被动重试（收到401）时也要处理网络异常
					try {
						const refreshed = await this._ensureAccessTokenAvailable(true)
						if (refreshed) {
							return this.request({
								...config,
								__retryAfterRefresh: true
							})
						}
					} catch (error) {
						return Promise.reject(new Error('网络请求失败，请检查网络后重试'))
					}
				}
			}

			const transformedResponse = await this._runInterceptors('response', response)
			return transformedResponse
		} catch (error) {
			return this._runInterceptors('response', Promise.reject(error))
				.then(result => result)
				.catch(err => Promise.reject(err))
		}
	}

	get(url, params = {}, config = {}) {
		return this.request({
			url,
			method: 'GET',
			params,
			...config
		})
	}

	post(url, data = {}, config = {}) {
		return this.request({
			url,
			method: 'POST',
			data,
			...config
		})
	}

	put(url, data = {}, config = {}) {
		return this.request({
			url,
			method: 'PUT',
			data,
			...config
		})
	}

	delete(url, data = {}, config = {}) {
		return this.request({
			url,
			method: 'DELETE',
			data,
			...config
		})
	}

	async upload(apiUrl, filePath, params = {}) {
		const url = (getServerCookie() || this.config.baseURL) + apiUrl
		const token = await getUserToken()
		if (token) {
			// 【修改点8】：upload也加防网络抖动的保护
			try {
				const available = await this._ensureAccessTokenAvailable(false)
				if (!available) {
					return Promise.reject(new Error('登录已过期，请重新登录'))
				}
			} catch (error) {
				return Promise.reject(new Error('网络请求失败，请检查网络后重试'))
			}
		}
		const latestToken = await getUserToken()
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url,
				filePath,
				name: 'file',
				header: this._buildAuthHeader(latestToken),
				formData: params,
				success: (res) => {
					const data = JSON.parse(res.data)
					resolve(data)
				},
				fail: (err) => {
					reject(err)
				}
			})
		})
	}

	download(url, params = {}) {
		return new Promise(async (resolve, reject) => {
			const token = await getUserToken()
			if (token) {
				// 【修改点9】：download也加防网络抖动的保护
				try {
					const available = await this._ensureAccessTokenAvailable(false)
					if (!available) {
						reject(new Error('登录已过期，请重新登录'))
						return
					}
				} catch (error) {
					reject(new Error('网络请求失败，请检查网络后重试'))
					return
				}
			}

			const latestToken = await getUserToken()
			const queryString = Object.keys(params)
				.map(key => `${encodeURIComponent(String(key))}=${encodeURIComponent(String(params[key]))}`)
				.join('&')
			const fullUrl = `${getServerCookie() || this.config.baseURL}${url}${queryString ? `?${queryString}` : ''}`
			const header = this._buildAuthHeader(latestToken)

			uni.downloadFile({
				url: fullUrl,
				header,
				success: (res) => {
					if (res.statusCode === 200) {
						resolve(res.tempFilePath)
					} else {
						reject(res)
					}
				},
				fail: (err) => {
					reject(err)
				}
			})
		})
	}

	getWEBIDValue(str) {
		if (str) {
			let parts = str.split(';')
			let webIdValue = null
			for (let i = 0; i < parts.length; i += 1) {
				let part = parts[i].trim()
				if (part.startsWith('WEBID=')) {
					webIdValue = part.substring('WEBID='.length)
					break
				}
			}
			return webIdValue
		}
		return null
	}
}