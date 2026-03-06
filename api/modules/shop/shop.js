import {
	get,
	post
} from '@/utils/http/index.js'



/**
 * 获取店铺信息
 */
export const GetUserShopInfoApi = (params) => {
	return post('api/public/shop/get', params)
}

/**
 * 修改店铺名称
 */
export const ChangeShopNameApi = (params) => {
	return post('api/app/myshop/name/set', params)
}

/**
 * 修改店铺状态
 */
export const ChangeShopStatusApi = () => {
	return post('api/app/myshop/online/change')
}

/**
 * 店铺自动离线
 */
export const ChangeAutoOfflineApi = (params) => {
	return post('api/app/myshop/open_auto_close/set', params)
}

/**
 * 设置店铺与自动离线时间
 */
export const SetShopAutoCloseApi = (params) => {
	return post('api/app/myshop/auto_close_time/set', params)
}


/**
 * 获取店铺上架库存(未登录)
 */
export const ShopSellListApi = (params) => {
	return post(`api/app/shop/sell/${params.appId}/list`, params)
}
/**
 * 获取店铺上架库存（登录）
 */
export const ShopSellList2Api = (params) => {
	return post(`api/app/shop/sell/${params.appId}/list`, params)
}
/**
 * 最近成交记录
 */
export const ShopTransactionApi = (params) => {
	return post('api/public/shop/sell/list', params)
}