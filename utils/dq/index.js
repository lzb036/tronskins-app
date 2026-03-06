import {getToken} from './guard.js';


/**
 * @param {Object} token
 */
export function getMD5Code(token) {
	let codeBean = {};
	if (token.length == 0) {
		return null;
	}
	codeBean.token = token;
	codeBean.time = null;
	let tokenBean = getToken(codeBean);
	return tokenBean.code;
}