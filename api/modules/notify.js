import {
	get,
	post
} from '@/utils/http/index.js'

/**
 * 获取交易通知列表
 */
export const GetTradeListApi = (params) => {
	return post('api/app/mytrade/log/list', params)
}
export const GetTradeList2Api = (params) => {
	return get('api/app/mytrade/log/list2', params)
}
/**
 * 获取公告通知
 */
export const GetNoticeListApi = (params) => {
	return post('api/app/notice/message/list', params)
}
/**
 * 获取公告详情
 */
export const GetNoticeDetailApi = (params) => {
	return get(`api/notice/detail.do?id=${params.id}&page=${params.page}&pageSize=${params.pageSize}`, params)
}

/**
 * 已阅消息
 */
export const ReadMessageApi = (params) => {
	return post(`api/app/mytrade/log/${params.id}/read`)
}
/**
 * 删除消息
 */
export const DeleteMessageApi = (params) => {
	return post(`api/app/mytrade/log/${params.id}/delete`)
}
/**
 * 一键已阅交易通知
 */
export const ReadAllMyTradeLogApi = () => {
	return post('api/app/mytrade/log/read_all')
}

/**
 * 清空交易通知
 */
export const ClearMyTradeLogApi = () => {
	return post('api/app/mytrade/log/clear')
}

/**
 * 已读公告消息
 */
export const ReadNotifyApi = (params) => {
	return post('api/app/notice/read', params)
}

/**
 * 一键已阅所有公告通知
 */
export const ReadAllNotifyApi = () => {
	return post('api/app/notice/read_all')
}


/**
 * ************************反馈*********************************
 */

/**
 * 获取反馈列表
 */
export const GetFeedbackListApi = (params) => {
	return post('api/app/ticket/list', params)
}
/**
 * 获取反馈详情
 */
export const GetFeedbackDetailApi = (params) => {
	return post(`api/app/ticket/${params.id}/show`)
}
/**
 * 获取反馈详情列表
 */
export const MyFeedbackDetailListApi = (params) => {
	return post('api/app/ticket/reply/list', params)
}

/**
 * 提交反馈
 */
export const SubmitFeedbackApi = (params) => {
	return post('api/app/ticket/add', params)
}
/**
 * 是否存在活动态反馈
 */
// export const ExistFeedbackSubmitApi = (params) => {
// 	return post('/api/app/ticket/check.do', params)
// }

/**
 * 补充反馈
 */
export const AddFeedbackSubmitApi = (params) => {
	return post('api/app/ticket/reply/add', params)
}
/**
 * 补充上传图片
 */
export const AddFeedbackImgApi = (params) => {
	return post('api/app/ticket/reply/upload', params)
}

/**
 * 反馈已解决
 */
export const SolveFeedbackApi = (params) => {
	return post(`api/app/ticket/${params.id}/solve`)
}
/**
 * 上传反馈图片
 */
export const UploadFeedbackImgApi = (params) => {
	return post('api/app/ticket/upload', params)
}