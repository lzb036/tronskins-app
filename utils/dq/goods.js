import i18n from '@/utils/locales/i18n.js';
import {
	getLanguage
} from '@/utils/storage/modules/domain.js';


/**
 * 价格字段处理
 */
export function getItemListData(list, schemas) {
	list.forEach(item => {
		if (schemas[item.schema_id] && schemas[item.schema_id].buff_min_price) {
			schemas[item.schema_id].buff_min_price = schemas[item.schema_id].buff_min_price > 0.02 ? schemas[
				item.schema_id].buff_min_price : 0.02;
		}
		item.buff_min_price = schemas[item.schema_id].buff_min_price;
		item.price = item.price ? item.price : schemas[item.schema_id].buff_min_price;
	})
	return list;
}

/**
 * 获取待结算时间
 */
let currentLocale = getLanguage();
export function getRemainTime(endTime, id) {
	if (!currentLocale) {
		currentLocale = getLanguage();
	}
	const date = Date.now();
	const endDate = new Date(endTime * 1000); // 结算最后一天
	let totalTimeLeft = (endDate.getTime() - date) / 1000;
	if (totalTimeLeft <= 0) return;
	let days = Math.floor(totalTimeLeft / (24 * 60 * 60));
	let hours = Math.floor((totalTimeLeft / (60 * 60)));
	let minutes = Math.floor(((totalTimeLeft % (60 * 60)) / 60));
	const formattedMinutes = minutes.toString().padStart(2, '0');
	let remainingHours = Math.floor(hours - days * 24) + (minutes && minutes > 0 ? 1 : 0);
	if (remainingHours % 24 == 0) {
		days += 1;
		remainingHours -= 24;
	}
	const formattedRemainingHours = remainingHours.toString();
	// 有X天时，就是天 + 小时， 
	// 如果24小时内，显示几小时几分
	// 如果60分钟内，显示XX分钟
	let displayDaysText;
	let displayHoursText;
	let displayMinutesText;

	if (days > 0) {
		if (currentLocale && !['zh_CN', 'ja_JP', 'zh_HK'].includes(currentLocale)) {
			if (days > 1) {
				displayDaysText = days + i18n.t('app.common.days');
			} else {
				displayDaysText = days + i18n.t('app.common.day');
			}
			if (remainingHours && remainingHours > 1) {
				displayHoursText = formattedRemainingHours + i18n.t('app.common.hours');
			} else {
				displayHoursText = formattedRemainingHours + i18n.t('app.common.hour');
			}
			return displayDaysText + displayHoursText;
		} else {
			return `${days + i18n.t('app.common.day')}${formattedRemainingHours + i18n.t('app.common.hours')} `;
		}
	}
	if (days <= 0 && remainingHours > 0) {
		if (currentLocale && !['zh_CN', 'ja_JP', 'zh_HK'].includes(currentLocale)) {
			if (remainingHours > 1) {
				displayHoursText = formattedRemainingHours + i18n.t('app.common.hours');
			} else {
				displayHoursText = formattedRemainingHours + i18n.t('app.common.hour');
			}
			if (minutes && minutes > 1) {
				displayMinutesText = formattedMinutes + i18n.t('app.common.minutes');
			} else {
				displayMinutesText = formattedMinutes + i18n.t('app.common.minute');
			}
			return displayHoursText + displayMinutesText;
		} else {
			return `${formattedRemainingHours + i18n.t('app.common.hours')}${formattedMinutes + i18n.t('app.common.minutes')}`;
		}
	}
	if (days <= 0 && remainingHours <= 0 && minutes > 0) {
		if (minutes && minutes > 1) {
			return formattedMinutes + ' ' + i18n.t('app.common.minutes');
		} else {
			return formattedMinutes + ' ' + i18n.t('app.common.minute');
		}
	}
}