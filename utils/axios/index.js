import config from '@/config/index.js';
import {
	getUserToken,
	setUserToken
} from '@/utils/storage/modules/user.js'
import {
	getLanguage,
	getServerCookie
} from '@/utils/storage/modules/domain.js'

export const get = function(url, params) {
	return interceptorsJSON('GET', url, params)
}

export const post = function(url, params) {
	return interceptorsJSON('POST', url, params)
}


export const put = function(url, params) {
	return interceptorsJSON('PUT', url, params)
}

export const delete = function(url, params) {
	return interceptorsJSON('DELETE', url, params)
}

async function interceptorsJSON(method, url, params = {}) {
	try {
		var headerConfig = {
			'Cookie': '',
			'Content-Type': '',
			'Authorization': '',
		};
		var webID = uni.getStorageSync('app_webid');
		headerConfig['Cookie'] = `locale=${getLanguage()};WEBID=${webID};`;
		headerConfig['Content-Type'] = `application/json;charset=UTF-8`;

		const token = await getUserToken();
		if (token) {
			headerConfig['Authorization'] = `Bearer ${token}`
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: getServerCookie() + url,
				method: method,
				data: params,
				header: headerConfig,
				timeout: 30000,
				sslVerify: false,
				firstIpv4:true,
				success: (res) => {
					console.log(res)
					if (res.statusCode == 200) {
						if (res.data.statusCode == 301) {
							// clearLogin();
						}
						return resolve(res.data);
					} else if (res.statusCode == 301) {
						return resolve(res.data);
					} else {
						return reject(res);
					}
				},
				fail: (err) => {
					console.log(err)
					if (err.statusCode == 301 || err.statusCode == 401) {
						clearLogin();
					}
					return reject(err);
				},
				complete: (res) => {
					console.log(res)
					// let newWebid = getWEBIDValue(response.headers['Set-Cookie']);
					// let webID = uni.getStorageSync('app_webid');
					// if (webID && newWebid && newWebid != webID) {
					// 	uni.setStorageSync('app_webid', newWebid)
					// }
					// if (newWebid) {
					// 	if (!webID || webID.length < 32) {
					// 		uni.setStorageSync('app_webid', newWebid)
					// 	}

					// }
					// uni.hideLoading();
				}
			})
		})
	} catch (error) {
		console.log(error)
		//TODO handle the exception
	}
}

function getWEBIDValue(str) {
	if (str) {
		var parts = str.split(';');
		var webIdValue = null;
		for (var i = 0; i < parts.length; i++) {
			var part = parts[i].trim(); // 去除前后的空格  
			if (part.startsWith('WEBID=')) {
				webIdValue = part.substring('WEBID='.length);
				break;
			}
		}
		return webIdValue;
	}
}