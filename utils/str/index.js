/**
 * 字符串替换
 * stringFormat('你购买的物品 {0} 买家已发货,请前往Steam库存中查看。',market_name)
 */
export function stringFormat(str, ...args) {
	if (!str) {
		return str;
	}
	for (var i = 0; i < args.length; i++) {
		var reg = new RegExp("({)" + i + "(})", "g");
		str = str.replace(reg, args[i]);
	}
	return str;
}