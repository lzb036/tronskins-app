import {
	Storage
} from '@/utils/storage/index.js'


let tradeMessageConfig = {
	csgoTotal: 0,
	tf2Total: 0,
	dota2Total: 0,
}

/**
 * 消息推送
 */
export const getTradeMessageShipping = function() {
	return Storage.memory.get('es_trade_message_shipping') ? Storage.memory.get('es_trade_message_shipping') : tradeMessageConfig;
}

export const setTradeMessageShipping = function(obj) {
	Storage.memory.set('es_trade_message_shipping', obj)
}

export const getPushMessageDelive = function() {
	return Storage.memory.get('es_trade_message_delive') ? Storage.memory.get('es_trade_message_delive') : false;
}

export const setPushMessageDelive = function(flag) {
	Storage.memory.set('es_trade_message_delive', flag)
}

export const getPushMessageReceive = function(){
	return Storage.memory.get('es_trade_message_receive') ? Storage.memory.get('es_trade_message_receive') : false;
}

export const setPushMessageReceive = function(flag){
	Storage.memory.set('es_trade_message_receive', flag);
}