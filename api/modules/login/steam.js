import {
	get,
	post
} from '@/utils/http/index.js'

/**
 * 加密steam 账号信息
 */
/**
 * 账号登录
 */
export const SteamDecryptPasswordApi = (params) => {
	return post('api/app/steam/decrypt_password', params)
}


/**
 * 模拟登录steam:第一步 获取账号秘钥
 */
export const SteamAccountKeyApi = (steam_account) => {
	return uni.request({
		url: 'https://api.steampowered.com/IAuthenticationService/GetPasswordRSAPublicKey/v1/?account_name=' +
			steam_account,
		method: "GET",
	})
}
/**
 * 模拟登录steam:第二步 向steam app 发送验证
 */
export const SendSteamVerificationApi = (data) => {
	return uni.request({
		url: 'https://api.steampowered.com/IAuthenticationService/BeginAuthSessionViaCredentials/v1/',
		method: "POST",
		header: {
			"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
			"Referer": 'https://steamcommunity.com',
		},
		data: data,
	})
}

/**
 * 模拟登录steam:第三步 有验证码的情况，验证验证码是否有效（使用验证码登录）
 */
export const SteamAuthorizeCodeApi = (data) => {
	return uni.request({
		url: 'https://api.steampowered.com/IAuthenticationService/UpdateAuthSessionWithSteamGuardCode/v1',
		method: 'POST',
		header: {
			"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
			"Referer": 'https://steamcommunity.com',
		},
		data: data,
	})
}

/**
 * 模拟登录steam:第四步 steam app 授权登录（验证通过，获取token）
 */
export const SteamAuthorizeLoginApi = (data) => {
	return uni.request({
		url: 'https://api.steampowered.com/IAuthenticationService/PollAuthSessionStatus/v1/',
		method: "POST",
		header: {
			"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
			"Referer": 'https://steamcommunity.com',
		},
		data: data,
	})
}