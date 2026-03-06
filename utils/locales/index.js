import config from '@/config/index.js';
import {
	getLanguage,
	setLanguage
} from '@/utils/storage/modules/domain.js';

// 支持语言列表
export const langs = {
	'en_US': {
		name: 'English',
		loader: () => import('./en_US/app_i18n.js')
	},
	'zh_CN': {
		name: '简体中文',
		loader: () => import('./zh_CN/app_i18n.js')
	}
}



// 获取语言资源（同步加载）
let messagesCache = {};
export function getMessages() {
	const lang = getLanguage();
	if (!messagesCache[lang]) {
		const module = require(`./${lang}/app_i18n.js`);
		messagesCache[lang] = module.default;
	}
	return messagesCache[lang];
}