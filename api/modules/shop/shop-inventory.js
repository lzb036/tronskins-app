// 库存管理
import {
	get,
	post
} from '@/utils/http/index.js'

/**
 * 游戏库存
 */
export const inventoryListApi = (data) => {
	return post(`api/app/inventory/${data.appId}/list`, data)
}

/**
 * 刷新库存
 */
export const inventoryRefreshApi = (params) => {
	return post(`api/app/inventory/${params.appId}/fresh`)
}

/**
 * 库存隐私设置
 */
export const inventoryPrivacySettingApi = () =>{
	return get('api/app/steam/set_privacy')
}
