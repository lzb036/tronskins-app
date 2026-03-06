import {
	Storage
} from '@/utils/storage/index.js'

/**
 * 令牌列表
 */
export const get2FAList = function() {
	return Storage.memory.get('es_2fa_list') ? Storage.memory.get('es_2fa_list') : [];
}
/**
 * [{appUse,userId,showEmail,loggerShowName,secret}]
 * @param {Object} list
 */
export const set2FAList = function(list) {
	Storage.memory.set('es_2fa_list', list)
}
export function bindSecret({
	appUse,
	userId,
	secret,
	showEmail = ''
}) {
	const list = get2FAList()
	const idx = list.findIndex(g => g.appUse === appUse && g.userId === userId)

	const item = {
		appUse,
		userId,
		secret,
		showEmail
	} // 保证字段一定存在

	idx >= 0 ? list.splice(idx, 1, item) : list.push(item)
	set2FAList(list)
}