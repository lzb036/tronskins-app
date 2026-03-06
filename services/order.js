{
	//shop_sell_record
	asset_id,
	send_id,
	market_name,
	schema_id,
	item_id,
	seller,
	buyer,
	cancel_reason,
	/**
	 * 0：已取消                                                           
	 * 1：待付款                                                           
	 * 2：待发货                                                           
	 * 3：待收货                                                           
	 * 4：已完成
	 */
	status: '',
	// shop_item_trade_log
	id: ,
	is_punish,
	is_read,
	create_time,
	type,
	price: '' //已取消要知道多少钱
}

{
	title,
	标题
	content,
	内容
	type, // 类型：待发货...
	tradeMessage: { // 当前待发货条数
		csgoTotal: '',
		tf2Total: '',
		dota2Total: ''
	}
} {
	"content": "你在售的物品 {0} 因你没有及时发货，订单已取消。由于你未能成功发货，你在售的该类物品已被下架且3天内不可上架，系统会根据你今天的所有出售记录判断是否进一步封禁店铺。",
	"type": "1",
	"tradeMessage": "{ csgoTotal: 0, tf2Total:0, dota2Total: 0}"
}
/**
 *  
 * -1:已取消		---------------- 订单取消通知
 *  2:待发货 	---------------- 发货通知
 *  4:待接收		---------------- 收货通知
 *  6:完成		---------------- 交易完成通知
 */



