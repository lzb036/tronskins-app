import {
	get,
	post
} from '@/utils/http/index.js'

/**
 * 获取系统临时token
 */
export const getTemporaryTokenApi = (parmas) => {
	return get('api/app/user/get/token', parmas)
}

/**
 * 判断steam登录状态
 */
export const steamOnlineStateApi = () => {
	return get('api/app/steam/online/state')
}

/**
 * 同意Steam登录会话协议
 */
export const useSteamSessionAgreementApi = (params) => {
	return post('api/app/user/set/steam/token/use')
}

/**
 * 获取steam交易链接或API Key
 */
export const getTradeUrlOrApikey = (parmas) => {
	return get('api/app/steam/' + params.type + '/get', parmas)
}

/**
 * 保存交易链接
 */
export const setTradeUrlApi = (params) => {
	return post('api/app/user/set/url', params)
}
/**
 * 保存API Key
 */
export const setApiKey = (params) => {
	return post('api/app/user/set/key', params)
}

/**
 * 解绑steam前验证
 */
export const steamUnbindCheckApi = () => {
	return get('api/app/user/steam/unbind/check')
}

/**
 * Steam交易是否正常
 */
export const steamTradingStateApi = () => {
	return get('api/app/steam/trade_status/state')
}

/**
 * 上次steam 刷新令牌到服务器
 */
export const steamTokenFreshApi = (params) => {
	return post('api/app/steam/auth/token/fresh', params)
}

/**
 * 获取实时买家steam信息
 */
export const GetSteamUserInfoApi = (params) => {
	return post(`api/app/steam/refresh/${params.id}/steam/level`)
}

/**
 * 获取steam库存隐私状态
 */
export const getSteamSetPrivacyApi = () => {
	return get('api/app/steam/get_privacy')
}