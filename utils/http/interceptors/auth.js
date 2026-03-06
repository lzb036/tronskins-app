import {
	getUserToken
} from '@/utils/storage/modules/user.js'
import {
	getLanguage
} from '@/utils/storage/modules/domain.js'

const REFRESH_ENDPOINT = 'api/app/auth/refresh'

function isRefreshRequest(url) {
	if (typeof url !== 'string') return false
	return url.includes(REFRESH_ENDPOINT)
}

export const authInterceptor = {
	async handle(config) {
		try {
			config.header = config.header || {}
			const token = await getUserToken()
			if (!isRefreshRequest(config?.url)) {
				const webID = uni.getStorageSync('app_webid')
				config.header.Cookie = `locale=${getLanguage()};JSESSIONI=${webID}`
			}

			if (token) {
				config.header.Authorization = `${token}`
			}
			return config
		} catch (e) {
			console.log(e)
		}
		return config
	},
	handleError(error) {
		return Promise.reject(error)
	}
}
