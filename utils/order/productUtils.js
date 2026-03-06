// 先引入i18n（根据你的实际路径调整）
import i18n from '@/utils/locales/i18n';
/**
 * 获取当前商品最低价格，价格取 buff 和 商城 ，哪个价格低取那个（价格非空的情况最小为0.02）
 */
export function getMarketMinPrice(buff_min_price, sell_min) {
	if (buff_min_price && sell_min) {
		let min_price = buff_min_price <= sell_min ? buff_min_price : sell_min
		return min_price > 0.02 ? min_price : 0.02;
	} else {
		if (buff_min_price) {
			return buff_min_price > 0.02 ? buff_min_price : 0.02
		}
		if (sell_min) {
			return sell_min > 0.02 ? sell_min : 0.02
		}
		return 0;
	}
}
/**
 * 定价规则(根据在售最低价设置的)
 * 取的是比当前在售最低价（buff或者商城）低一点（10元的低0.01，10——100的低0.1，100以上的低0.5）
 */
// export function getPricingRules(price) {
// 	let newPrice = 0;
// 	if (price <= 10 && price > 0.02) {
// 		newPrice = price - 0.01;
// 	}
// 	if (price > 10 && price <= 100) {
// 		newPrice = price - 0.1;
// 	}
// 	if (price > 100) {
// 		newPrice = price - 0.5;
// 	}

// 	return Number(newPrice.toFixed(2));
// }

/**
 * 求购定价规则（基于求购最高价）
 * 取的是比当前求购最高价高一点（10元的高0.01，10——100的高0.1，100以上的高0.5）
 */
export function getPricingRules(buyMaxPrice) {
	let newPrice = 0;
	if (buyMaxPrice <= 10 && buyMaxPrice > 0) {
		newPrice = buyMaxPrice + 0.01;
	}
	if (buyMaxPrice > 10 && buyMaxPrice <= 100) {
		newPrice = buyMaxPrice + 0.1;
	}
	if (buyMaxPrice > 100) {
		newPrice = buyMaxPrice + 0.5;
	}
	return Number(newPrice.toFixed(2));
}

export function getGameFile(appid) {
	if (!appid) {
		console.log("appid is null")
		return;
	}
	let path = '';
	if (appid == 440) {
		path = 'tf2'
	}
	if (appid == 570) {
		path = 'dota2'
	}
	if (appid == 730) {
		path = 'csgo'
	}
	return path;
}


/**
 * 支付确认弹窗（异步版，返回布尔值）
 * @param {string/number} total - 要拼接在标题后的金额
 * @param {string} content - 弹窗内容（补充参数，避免未定义）
 * @returns {Promise<boolean>} - 点击确认返回true，取消/关闭返回false
 */
export function confirmPay(total, content) {
  // 用Promise包裹，实现异步返回
  return new Promise((resolve) => {
    uni.showModal({
      // 修复this指向问题：直接用引入的i18n，而非this.i18n
      title: `${i18n.t("app.trade.buy.pay_text")} ${total}`,
      content: content || '', // 给content默认值，避免报错
      confirmText: i18n.t("app.common.confirm"),
      cancelText: i18n.t("app.common.cancel"),
      confirmColor: '#4674c9',
      cancelColor: '#45536d',
      success: (res) => {
        // 点击确认resolve(true)，取消resolve(false)
        resolve(res.confirm);
      },
      // 处理弹窗调用失败的情况，默认返回false
      fail: () => {
        resolve(false);
      }
    });
  });
}