import {
	get,
	post,
	deleteHttp
} from '@/utils/http/index.js'

import {
	getGameType,
} from '@/utils/storage/modules/domain.js'


/**
 * 最新上架
 */
export const marketNewsApi = (data) => {
	return post(`api/public/mall/sell/${data.appId}/news`, data)
}

/**
 * 热门饰品
 */
export const marketHotItemsApi = (data) => {
	return post('api/public/mall/hots', data)
}

/**
 * 饰品市场列表
 */
export const marketGameListApi = (data) => {
	return post(`api/public/mall/${data.appId}/schemas`, data)
}
/**
 * 模糊查询饰品名称
 * appId
 * keywords
 */
export const MarketQueryItemNameApi = (params) => {
	return post(`api/public/schema/item/language/list`, params)
}

/**
 * 饰品 类型 品质 外观...
 */
export const marketAttributeListApi = (params) => {
	return get(`api/public/schema/attribute/${params.appId}/list`,params)
}

/**
 * dota2筛选接口
 */
export const dota2marketAttributeListApi = (params) => {
	return get(`api/public/schema/attribute/${params.appId}/list`,params)
}
/**
 * 获取淬火等级列表或者冰火档位接口
 */
export const tierOrFireIceListApi = (params) => {
	return get(`api/public/order/sell/tier/list`,params)
}
/**
 * 饰品模版详情(未登录)
 * @schema_id
 * @appid
 */
export const marketItemTemplateApi = (params) => {
	return get(`api/public/goods/${params.appid}/${params.goodsId}/show`)
}
/**
 * 饰品模版详情(登录)
 * @schema_id
 * @appid
 */
export const marketItemTemplate2Api = (params) => {
	return get(`api/app/goods/${params.appid}/${params.goodsId}/show`)
}
/**
 * 饰品详情(未登录)
 * @id
 * @appid
 */
export const marketItemApi = (params) => {
	return post('api/public/order/sell/details/list', params)
}
/**
 * 饰品详情(登录)
 * @id
 * @appid
 */
export const marketItem2Api = (params) => {
	return post('api/app/order/sell/details/list', params)
}	
/**
 * 饰品模版收藏
 * @schema_id
 * @appid
 */
export const GameItemAddStarApi = (params) => {
	return post('api/app/collect/add', params)
}
/**
 * 饰品模版取消收藏
 * @schema_id
 * @appid
 */
export const GameItemRemoveStarApi = (schemaId) => {
  return deleteHttp(`api/app/collect/${schemaId}`)
}
/**
 * 饰品关注
 * @appId
 * @itemId
 */
export const AddFavoriteApi = (params) => {
	return post('api/app/favorite/add', params)
}
/**
 * 饰品取消关注
 * @appId
 * @itemId
 */
export const RemoveFavoriteApi = (id) => {
	return deleteHttp(`api/app/favorite/${id}`)
}

/**
 * 获取求购数量/剩余可求购数量
 */
export const mybuyRemainNumApi = (params) => {
	return get(`api/app/mall/tobuy/buynum/${params.schemaId}/limit`)
}


/**
 * 饰品在售列表
 */
export const GameItemOnSaleListApi = (params) => {
	return post('api/public/order/sell/details/list', params)
}
export const GameItemOnSaleList2Api = (params) => {
	return post('api/app/order/sell/details/list', params)
}
/**
 * 饰品求购列表(未登录)
 */
export const GameItemBuyRequestListApi = (params) => {
	return post('api/public/order/buy/details/list', params)
}
/**
 * 饰品求购列表(登录)
 */
export const GameItemBuyRequestList2Api = (params) => {
	return post('api/app/order/buy/details/list', params)
}
/**
 * 饰品成交记录
 */
export const GameItemTransactionListApi = (params) => {
	return post(`api/public/sell/record/list`, params)
}
/**
 * 饰品价格趋势
 */
export const GameItemPriceTrendChartApi = (params) => {
	return post('api/public/goods/price/history/list', params)
}

/**
 * 市场交易通知
 */
export const AppTradeTotalApi = () => {
	return post('api/app/mark/info', {
		appId: getGameType()
	})
}

/**
 * 最新通知消息
 */
export const AppNoticeApi = () => {
	return get('api/public/notice/get')
}
