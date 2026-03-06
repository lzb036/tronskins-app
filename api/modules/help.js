import { get, post } from '@/utils/http/index.js'

/**
 * 获取帮助中心分类列表
 */
export const getHelpCategoryListApi = () => {
	return get('api/public/help/center/category/list')
}

/**
 * 获取分类列表内容
 */
export const GetHelpListApi = (params) => {
	return post('api/public/help/center/list', params)
}

/**
 * 获取帮助内容
 */
export const GetHelpItemApi = (params) => {
	return get('api/public/help/center/title/list', params)
}