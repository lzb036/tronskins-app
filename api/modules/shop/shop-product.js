// 商品管理

import {
	get,
	post,
	put,
} from '@/utils/http/index.js'

/**
 * 在售饰品
 */
export const ShopOnSaleListApi = (data) => {
	return post('api/app/order/mysell/list', data)
}
/**
 * 出售记录
 */
export const ShopSellRecordApi = (params) => {
	return post('api/app/mysold/list', params)
}
/**
 * 我的购买
 */
export const ShopBuyReceivingApi = (params) => {
	return post('api/app/myreceive/list', params)
}
/**
 * 购买记录
 */
export const ShopBuyRecordApi = (params) => {
	return post('api/app/mybuy/list', params)
}

/**
 * 取消订单
 */
export const CancelOrderApi = (params) => {
	return post(`api/app/shop/sell/${params.id}/cancel`)
}

/**
 * 待发货
 */
export const ShopPendingShipmentListApi = (params) => {
	return post('api/app/mysend/list', params)
}

/**
 * 收货
 */
export const OrderTradeofferReceiptApi = (params) => {
	return get('api/app/tradeoffer/' + params.id + '/accept')
}

/**
 * 上架饰品
 * @items
 * @appid
 */
export const OrderItemUpApi = (params) => {
	return post('api/app/order/sell/up', params)
}

/**
 * 下架饰品
 * @ids
 */
export const OrderItemRemovedApi = (params) => {
	return post('api/app/order/sell/down', params)
}
/**
 * 改价
 * @items
 */
export const OrderItemChangeApi = (params) => {
	return post('api/app/order/sell/price/change', params)
}

/** 
 * 购买
 * @appid
 * @id
 * @price
 */
export const OrderItemPurchaseApi = (params) => {
	return post('api/app/order/sell/action', params)
}
/** 
 * 取消求购
 * @id
 */
export const OrderItemCancelBuyApi = (params) => {
	return put('api/app/order/buy/' + params.id + '/down')
}
/** 
 * 供应
 * @id
 */
export const OrderItemSupplyApi = (params) => {
	return put('api/app/order/buy/action', params)
}
/** 
 * 发布求购
 */
export const OrderItemBuyingApi = (params) => {
	return post('api/app/order/buy/up', params)
}

/** 
 * 获取求购最低价
 */
export const getOrderBuyingMinPriceApi = (params) => {
	return post('api/app/order/buy/min_price/get', params)
}

/*** 我的求购 ***********************************************************************************************/
/**
 * 正在求购/求购记录
 */
export const MyBuyOrderListApi = (params) => {
	return post('api/app/order/mybuy/list', params)
}

/**
 * 求购改价
 */
export const MyBuyUpdatePriceApi = (params) => {
	return put('api/app/order/buy/price/change', params)
}

/** 
 * 批量购买
 */
export const OrderItemBatchBuyApi = (params) => {
	return post('api/app/order/sell/batch/buy', params)
}


// 收藏
export const ProductCollectListApi = (params) => {
	return post('api/app/collect/list', params)
}
// 关注
export const ProductFavoriteListApi = (params) => {
	return post('api/app/favorite/list', params)
}

/**
 * 取消收藏
 */
export const CancelCollectApi = (params) => {
	return get(`api/app/collect/${params.schemaId}`)
}

/** 
 * 求购状态设置
 */
export const submitBuyStatusApi = () => {
	return post('api/app/myshop/signWanted/change')
}

/**
 * 获取系统关键参数：
 * 手续费率、最高价、最低价等
 */
export const GetSysParamsApi = () => {
	return get('api/public/shop/params/get')
}

/**
 * 提现、充值、购买和供应功能是否关闭
 */
export const CheckShopEnableApi = (params) => {
	return get('api/shop/setting/enable/get.do', params)
}