import {
	setAppUserInfo,
	clearAuthStorage
} from '@/utils/storage/modules/user.js'

const TOKEN_INVALID_CODES = new Set([401, 1001, '401', '1001'])

export const errorInterceptor = {
	handle(response) {
		const statusCode = response?.statusCode ?? response?.status
		const data = response?.data || {}
		const businessCode = data?.code ?? data?.statusCode

		if (statusCode === 401 || TOKEN_INVALID_CODES.has(businessCode)) {
			setAppUserInfo('')
			clearAuthStorage()
		}

		const setCookie = response?.headers?.['Set-Cookie'] || response?.headers?.['set-cookie']
		const newWebid = getWEBIDValue(setCookie)
		const webID = uni.getStorageSync('app_webid')
		if (webID && newWebid && newWebid !== webID) {
			uni.setStorageSync('app_webid', newWebid)
		}
		if (newWebid && (!webID || webID.length < 32)) {
			uni.setStorageSync('app_webid', newWebid)
		}
		return data
	},
	handleError(error) {
		console.log('网络异常，请稍后重试')
		return Promise.reject(error)
	}
}

function getWEBIDValue(value) {
	if (!value) return null
	const cookieText = Array.isArray(value) ? value.join(';') : value
	const parts = cookieText.split(';')
	for (let i = 0; i < parts.length; i += 1) {
		const part = parts[i].trim()
		if (part.startsWith('WEBID=')) {
			return part.substring('WEBID='.length)
		}
	}
	return null
}
