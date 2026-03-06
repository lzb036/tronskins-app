// 扫码登录
import i18n from '@/utils/locales/i18n.js'
import {
	getAppUserInfo
} from '@/utils/storage/modules/user.js'
import {
	cancelScanConfirmApi,
	LoginScanConfirmApi
} from '@/api/modules/login/auth.js'

export const scanLogin = function() {
	let userInfo = getAppUserInfo();
	if (!userInfo) {
		uni.showToast({
			title: i18n.t('app.system.message.nologin'),
			icon: 'none'
		})
		return;
	}
	uni.scanCode({
		scanType: ["QR_CODE"],
		charSet: 'ISO8859_1',
		success: async (res) => {
			try {
				let result = res.result;
				if (result) {
					const regex = /code=([^&]*)/;
					const match = result.match(regex);
					const qrCode = match ? match[1] : '';
					if(qrCode){
						uni.showModal({
							title: i18n.t('app.user.login.confirm'),
							confirmText: i18n.t('app.user.login.title'),
							cancelText: i18n.t('app.common.cancel'),
							success: async (resp) => {
								if (resp.confirm) {
									const confirmRes = await LoginScanConfirmApi({
										qrCode: qrCode
									});
									if (confirmRes.code == 0 && confirmRes.datas.status == 2) {
										uni.$u.toast(i18n.t('app.user.login.message.success'));
									} else {
										uni.$u.toast(i18n.t('app.system.message.operation_failed'));
									}
								} 
								if (resp.cancel) {
									const cancelRes = await cancelScanConfirmApi({
										qrCode: qrCode
									})
									if(cancelRes.code == 0){
										uni.$u.toast(i18n.t('app.system.message.success'));
									} else {
										uni.$u.toast(i18n.t('app.system.message.operation_failed'));
									}
								}
							}
						});
					}
				}
			} catch (error) {
				uni.showToast({
					title: i18n.t('app.system.message.operation_failed'),
					icon: 'none'
				})
			}
		}
	});
}

/**
 * 用户是否登录
 */
export const isLogin = function() {
	let userInfo = getAppUserInfo();
	return userInfo ? true : false;
}