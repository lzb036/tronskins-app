import {
	get,
	post
} from '@/utils/http/index.js'

/**
 * 账号登录 ： verifyType：0 不验证，1 邮箱验证，2 2fa验证
 */
export const LoginUserApi = (data) => {
	return post('api/app/auth', data, {
		autoToken: false,
		skipAuthRefresh: true,
		withCredentials: true
	})
}

/**·
 * sso登录
 */
export const LoginSsoSteamApi = (params) => {
	return post('api/public/sso/login_sso', params, {
		autoToken: false,
		skipAuthRefresh: true,
		withCredentials: true
	})
}

/**
 * Refresh access token (refresh token from HttpOnly cookie)
 */
export const RefreshAccessTokenApi = () => {
	return post('api/app/auth/refresh', {}, {
		autoToken: false,
		skipAuthRefresh: true,
		withCredentials: true
	})
}

/**
 *  APP扫码确认前
 */
export const beforeScanConfirmApi = (params) => {
	return post('api/app/phone/scan', params)
}

/**
 * APP扫码确认登录
 */
export const LoginScanConfirmApi = (params) => {
	return post('api/app/qr-login/submit', params)
}


/**
 * APP取消二维码登录
 */
export const cancelScanConfirmApi = (params) => {
	return post('api/app/qr-login/cancel', params)
}

/**
 * 发送邮箱验证码
 */
export const SendQQEmailCodeApi = (params) => {
	return post('api/public/verify-code/email/send/by-auth', params)
}

/**
 * 账号退出
 */
export const LogoutUserApi = () => {
	return post('api/app/user/logout', {}, {
		skipAuthRefresh: true
	})
}

/**
 * 是否绑定2fa
 */
export const Guard2faCheckApi = () => {
	return get('api/app/user/validate')
}

/**
 * 获取2FA账号和密钥信息
 */
export const getGuardInfoApi = (params) => {
	return post(`api/app/auth-token/${params.emailCode}/bindapp`)
}


/**
 * 绑定2FA
 */
export const BindGuardApi = (params) => {
	return post(`api/app/auth-token/${params.code}/bind`);
}


/**
 * 获取令牌邮箱验证码
 */
export const SendEmailCodeApi = (params) => {
	return post('api/public/verify-code/email/send/by-auth', params)
}

/**
 * 获取重置密码邮箱验证码
 */
export const getcheckEmailApi = ({ email, type }) =>
  get(`api/public/user/email/verify?email=${email}&type=${type}`);


/**
 * 用户重置密码
 */
export const userResetPasswordApi = (params) => {
	return get('api/public/user/password/reset', params)
}

/**
 * 用户令牌遗失,获取邮箱验证码
 */
export const EmailCodeSubmitApi = (params) => {
	return post('api/public/verify-code/email/send/by-submit', params)
}

/**
 * 同步令牌获取验证码
 */
export const EmailCodeCaptchaApi = () => {
	return get('api/app/user/email/token/captcha')
}


/**
 * 用户令牌遗失,提交
 */
export const tokenLostSubmitApi = (params) => {
	return post('api/public/2fa/lost', params)
}

/**
 * 登录前获取公钥
 */
export const getLoginPubKeyApi = (params)=>{
	return post('api/public/app/user/pubKey', params);
}
