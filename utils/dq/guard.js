import {
	MD5
} from './md5.js';
let code_length = 5;

export function getToken(codeBean) {

	let nowTime = new Date();
	// 取得秒数
	let seconds = nowTime.getSeconds();
	// 取得当前分钟数的毫秒数串（转为字符串）
	let millens = (parseInt(nowTime.getTime() / 1000) - seconds).toString();
	// 如果相等，说明是同一时间段内的请求，不重复生成
	if (millens == codeBean.millens) {
		return codeBean;
	}
	let token = codeBean.token;
	// 获得加密值
	let md5value = MD5(token + millens);
	let length = millens.length;
	let lastNum = millens.charAt(length - 1);
	let code = "";
	for (let i = 0; i < code_length; i++) {
		let pointIndex = parseInt(millens.charAt(length - 2 - i) + lastNum) % md5value.length;
		code += md5value.charAt(pointIndex);
		md5value = md5value.substring(0, pointIndex) + md5value.substring(pointIndex + 1);
	}

	return {
		"code": code.toUpperCase(),
		"codetime": millens,
		"token": codeBean.token
	};
}