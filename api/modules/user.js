import {
	deleteHttp,
	get,
	post
} from '@/utils/http/index.js'

/**
 * 用户信息
 */
export const userInfoApi = () => {
	return get('api/app/user/get')
}

/**
 * 修改昵称
 */
export const editNicknameApi = (params) => {
	return post('api/app/user/set/nickname', params)
}

/**
 * 修改密码
 */
export const editPasswordApi = (params) => {
	return post('api/app/user/set/password', params)
}

/**
 * 账户明细
 */
export const GetAccountDetailsApi = (params) => {
	return post('api/app/fund/changes/list', params)
}

/**
 * 锁定明细
 */
export const LockingFundListApi = (params) => {
	return get('api/app/locking/fund/list', params)
}
/**
 * 查看锁定明细
 */
export const LockingFundInfoApi = (params) => {
	return post(`api/app/locking/fund/${params.id}/detail`, params)
}


/**
 * 积分变更明细
 */
export const GetIntegralRecordApi = (params) => {
	return post('api/app/integral/changes/list', params)
}

/**
 * 积分明细变更详情
 */
export const IntegralChangeDetailApi = (params) => {
	return post(`api/app/integral/changes/${params.id}/detail`, params)
}

/**
 * 兑换卡券列表
 */
export const GetCouponsListApi = (params) => {
	return get('api/app/card/coupons/list', params)
}

/**
 * 积分兑换卡券
 */
export const CouponsExchangeApi = (params) => {
	return post('api/app/card/coupons/exchange', params)
}

/**
 * 获取我的卡券
 */
export const getMyCouponListApi = (params) => {
	return get('api/app/card/coupons/record/list', params)
}

/**
 * 抽奖奖品列表
 */
export const integralLotteryListApi = () => {
	return get(`api/app/lottery/app/prize/list`)
}

/**
 * 积分抽奖
 */
export const userIntegralLotteryApi = (params) => {
	return post('api/app/lottery/integral/lottery', params)
}

/**
 * 提现记录
 */
export const GetWithdrawRecordApi = (params) => {
	return post('api/app/withdraws/list', params)
}

/**
 * 用户提现
 */
export const AddUserWithdrawApi = (params) => {
	return post('api/app/withdraws/add', params)
}

/**
 * 取消提现
 */
export const CancelWithdrawApi = (params) => {
	return post('api/app/withdraws/cancel', params)
}

/**
 * 获取官方地址二维码
 */
export const OfficialWalletQRCodeApi = (params) => {
	return get('api/app/official/wallet/get', params)
}

/**
 * 钱包地址分配
 */
export const AssignOfficialWalletApi = () => {
	return post('api/app/official/wallet/assign')
}

/**
 * 获取钱包地址分配
 */
export const GetOfficialWalletAssignApi = () => {
	return get('api/app/official/wallet/get')
}

/**
 * 充值记录
 */
export const GetRechargeRecordApi = (params) => {
	return post('api/app/recharge/list', params)
}

/**
 * 充值卡充值
 */
export const ConsumeChargeCardApi = (params) => {
	return post('api/app/charge/card/consume', params)
}

/**
 * 获取用户主动添加的提现地址列表
 */
export const UserWithdrawAddressListApi = () => {
	return get('api/app/withdraw/wallet/list')
}

/**
 * 添加提现地址
 */
export const AddWithdrawAddressApi = (params) => {
	return post('api/app/withdraw/wallet/add', params)
}

/**
 * 移除提现地址
 */
export const RemoveWithdrawAddressApi = (params) => {
	return deleteHttp(`api/app/withdraw/wallet/${params.id}`)
}

/**
 * 获取用户待结算金额列表
 */
export const userSettlementListApi = (params) => {
	return post('api/app/settlement/fund/list', params)
}