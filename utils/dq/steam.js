import {
	getAppUserInfo
} from '@/utils/storage/modules/user.js';

/**
 * 
 */
export async function getSteamInfo() {
	let userInfo = getAppUserInfo();
	if (!userInfo) return;
	let user_steamId = userInfo.config.steamId;
	let obj = {
		status: false,
		sessionId: null,
		steamId: null,
		steamIdCookie: null,
		message: ""
	}
	try {
		const res = await uni.request({
			url: 'https://steamcommunity.com/profiles/' + user_steamId + '/inventoryhistory',
			header: {
				'Content-Type': 'application/json',
				'withCredentials': 'true'
			}
		});
		if (!res || !res.data) return;
		let data = JSON.stringify(res.data);
		let startIndex = data.indexOf("g_steamID");
		if (startIndex && startIndex !== -1) {
			let endIndex = Math.min(startIndex+"g_steamID".length + 25, data.length);
			let steam_str = data.substring(startIndex+"g_steamID".length, endIndex);
			let steam_id = steam_str.replace(/[^a-zA-Z0-9]/g, '');
			if(steam_id == 'falserntgstrLangu' || steam_id == 'falsentgstrLanguag'){
				obj.status = false;
				obj.message = "当前steam账号未登录";
			}else{
				if (!data) return;
				let session_start = data.indexOf("g_sessionID");
				let session_end = Math.min(session_start + "g_sessionID".length + 32, data.length);
				let session_str = data.substring(session_start + "g_sessionID".length, session_end);
				let session_regex = /"([^"]+)"/;
				let session_match = session_str.match(session_regex);
				if(user_steamId == steam_id){
					if (session_match && session_match[1]) {
						obj.status = true;
						obj.sessionId = session_match[1].slice(0, -1);
						obj.steamId = steam_id;
					}
				}else{
					obj.status = false;
					obj.steamId = steam_id;
					obj.steamIdCookie = user_steamId;
					obj.sessionId = session_match[1].slice(0, -1);
					obj.message = "app.steam.message.account_inconsistent";
					if (user_steamId == null) {
						return obj;
					}
					obj.isloginSteam = true;
				}
			}
		}
		return obj;
	} catch (errors) {
		console.log(errors)
	}
}