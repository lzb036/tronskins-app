// 交易
import {
	get,
	post
} from '@/utils/http/index.js'


/**
 * 远程发货
 */
export const TradeOfferRemoteQuoteApi = (params) => {
	return post('api/app/tradeoffer/create', params)
}