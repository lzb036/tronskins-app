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

function normalizeText(value) {
	return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

/**
 * 根据当前登录标识匹配唯一的本地 2FA 记录。
 * 仅在结果唯一且 secret 非空时返回，避免误用其他账号的令牌。
 */
export function findStored2FAByAccount({
	appUse = '',
	userId = '',
	showEmail = '',
	loginAccount = '',
} = {}) {
	const guardList = get2FAList().filter(item => normalizeText(item?.secret))
	if (!guardList.length) {
		return null
	}

	const normalizedUserId = `${userId ?? ''}`.trim()
	const normalizedAppUse = normalizeText(appUse)
	if (normalizedUserId && normalizedAppUse) {
		const exactMatch = guardList.find(item =>
			`${item?.userId ?? ''}`.trim() === normalizedUserId &&
			normalizeText(item?.appUse) === normalizedAppUse
		)
		if (exactMatch) {
			return exactMatch
		}
	}

	const normalizedEmails = [showEmail, loginAccount]
		.map(normalizeText)
		.filter(Boolean)

	for (const email of normalizedEmails) {
		const emailMatches = guardList.filter(item =>
			normalizeText(item?.showEmail) === email
		)
		if (!emailMatches.length) {
			continue
		}

		if (normalizedAppUse) {
			const appUseMatches = emailMatches.filter(item =>
				normalizeText(item?.appUse) === normalizedAppUse
			)
			if (appUseMatches.length === 1) {
				return appUseMatches[0]
			}
		}

		if (emailMatches.length === 1) {
			return emailMatches[0]
		}
	}

	return null
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
