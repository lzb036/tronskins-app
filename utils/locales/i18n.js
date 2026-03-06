import {
	getMessages,
	setLang
} from '@/utils/locales';

// 全局引用（避免响应式问题）
const messages = getMessages()
export default {
	// 获取翻译文本（同步）
	t(key, params) {
		const value = messages[key] || key;
		if (typeof value === 'string' && params) {
			// 处理 {0} 形式的参数替换
			return value.replace(/\{(\d+)\}/g, (match, index) => {
				const paramIndex = parseInt(index);
				return params[paramIndex] !== undefined ? params[paramIndex] : match;
			});
		}
		return value;
	},


	// 强制刷新语言包
	_refreshMessages() {
		const newMessages = getMessages();
		Object.keys(newMessages).forEach(k => {
			messages[k] = newMessages[k];
		});
	}
}