import { Storage } from '@/utils/storage/index.js'

const USER_INFO_KEY = 'es_user_info'
const USER_TOKEN_KEY = 'es_user_token'
const AUTH_HEADER_KEY = 'es_auth_header'
const ACCESS_TOKEN_EXPIRE_TIME_KEY = 'es_access_token_expire_time'
const REFRESH_TOKEN_EXPIRE_TIME_KEY = 'es_refresh_token_expire_time'
const DEFAULT_AUTH_HEADER = 'X-Service-Authorization'
const TOKEN_EXPIRE_ADVANCE_MS = 30 * 1000

let cachedToken = null

function isString(value) {
	return typeof value === 'string'
}

function toNumber(value) {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value
	}
	if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
		return Number(value)
	}
	return null
}

function parseJwtExpireTime(token) {
	try {
		if (!isString(token) || !token) return null
		const payloadPart = token.split('.')[1]
		if (!payloadPart || typeof atob !== 'function') return null
		const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
		const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
		const payload = JSON.parse(atob(padded))
		const exp = toNumber(payload.exp)
		return exp !== null ? exp * 1000 : null
	} catch {
		return null
	}
}

function removeSecureKey(key) {
	try {
		uni.removeStorageSync(`secure_${key}`)
	} catch {
		// ignore
	}
}

export const getAppUserInfo = function() {
	return Storage.memory.get(USER_INFO_KEY)
}

export const setAppUserInfo = function(userInfo) {
	Storage.memory.set(USER_INFO_KEY, userInfo)
}

export const getUserToken = async function() {
	try {
		const value = await Storage.secure.getItem(USER_TOKEN_KEY)
		cachedToken = isString(value) ? value : ''
		return cachedToken
	} catch {
		cachedToken = ''
		return cachedToken
	}
}

export const setUserToken = async function(token) {
	const nextToken = isString(token) ? token : ''
	cachedToken = nextToken

	if (nextToken) {
		try {
			await Storage.secure.setItem(USER_TOKEN_KEY, nextToken)
		} catch {
			// ignore
		}
		return nextToken
	}

	removeSecureKey(USER_TOKEN_KEY)
	setAccessTokenExpireTime(null)
	setRefreshTokenExpireTime(null)
	setAuthHeaderName(DEFAULT_AUTH_HEADER)
	return nextToken
}

export const getAuthHeaderName = function() {
	const header = Storage.memory.get(AUTH_HEADER_KEY)
	return isString(header) && header ? header : DEFAULT_AUTH_HEADER
}

export const setAuthHeaderName = function(headerName) {
	const nextHeader = isString(headerName) && headerName ? headerName : DEFAULT_AUTH_HEADER
	Storage.memory.set(AUTH_HEADER_KEY, nextHeader)
	return nextHeader
}

export const getAccessTokenExpireTime = function() {
	return toNumber(Storage.memory.get(ACCESS_TOKEN_EXPIRE_TIME_KEY))
}

export const setAccessTokenExpireTime = function(expireTime) {
	const parsed = toNumber(expireTime)
	if (parsed === null) {
		try {
			uni.removeStorageSync(ACCESS_TOKEN_EXPIRE_TIME_KEY)
		} catch {
			// ignore
		}
		return null
	}
	Storage.memory.set(ACCESS_TOKEN_EXPIRE_TIME_KEY, parsed)
	return parsed
}

export const getRefreshTokenExpireTime = function() {
	return toNumber(Storage.memory.get(REFRESH_TOKEN_EXPIRE_TIME_KEY))
}

export const setRefreshTokenExpireTime = function(expireTime) {
	const parsed = toNumber(expireTime)
	if (parsed === null) {
		try {
			uni.removeStorageSync(REFRESH_TOKEN_EXPIRE_TIME_KEY)
		} catch {
			// ignore
		}
		return null
	}
	Storage.memory.set(REFRESH_TOKEN_EXPIRE_TIME_KEY, parsed)
	return parsed
}

export const setAccessToken = async function(payload = {}) {
	const accessToken = isString(payload.accessToken)
		? payload.accessToken
		: (isString(payload.token) ? payload.token : '')

	await setUserToken(accessToken)
	if (!accessToken) {
		return
	}

	const accessTokenExpireTime = toNumber(payload.accessTokenExpireTime)
	const jwtExpireTime = accessTokenExpireTime === null ? parseJwtExpireTime(accessToken) : null
	setAccessTokenExpireTime(accessTokenExpireTime ?? jwtExpireTime)

	const hasRefreshExpireField =
		(Object.prototype.hasOwnProperty.call(payload, 'refreshTokenExpireTime') &&
			typeof payload.refreshTokenExpireTime !== 'undefined') ||
		(Object.prototype.hasOwnProperty.call(payload, 'refreshExpireTime') &&
			typeof payload.refreshExpireTime !== 'undefined')
	if (hasRefreshExpireField) {
		const refreshExpireRaw = payload.refreshTokenExpireTime ?? payload.refreshExpireTime
		setRefreshTokenExpireTime(toNumber(refreshExpireRaw))
	}

	if (isString(payload.header) && payload.header.trim()) {
		setAuthHeaderName(payload.header.trim())
	}
}

export const clearAuthStorage = async function() {
	await setUserToken('')
	setAccessTokenExpireTime(null)
	setRefreshTokenExpireTime(null)
	setAuthHeaderName(DEFAULT_AUTH_HEADER)
}

export const isAccessTokenExpired = async function() {
	const token = await getUserToken()
	if (!token) return true
	const expireTime = getAccessTokenExpireTime()
	if (!expireTime) return false
	return Date.now() + TOKEN_EXPIRE_ADVANCE_MS >= expireTime
}
