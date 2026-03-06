import config from '@/config/index.js'
import {
	Storage
} from '@/utils/storage/index.js'

/**
 * 默认游戏
 */
export const getGameType = function() {
	return Storage.memory.get('es_game_type') ? Storage.memory.get('es_game_type') : config.defaultGameType;
}
export const setGameType = function(type) {
	Storage.memory.set('es_game_type', type)
}

/**
 * 默认语言
 */
export const getLanguage = function() {
	return Storage.memory.get('es_language') ? Storage.memory.get('es_language') : config.defaultLanguage;
}
export const setLanguage = function(language) {
	Storage.memory.set('es_language', language)
}

/**
 * 默认服务器地址
 */
export const getServerCookie = function(){
	return Storage.memory.get('es_server') ? Storage.memory.get('es_server') : config.apiBaseUrl;
}
export const setServerCookie = function(server) {
	Storage.memory.set('es_server', server)
}

export const getServerListCookie = function(){
	let arr = [];
	arr.push(config.apiBaseUrl)
	return Storage.memory.get('es_server_list') ? Storage.memory.get('es_server_list') : arr;
}
export const setServerListCookie = function(list) {
	Storage.memory.set('es_server_list', list)
}

// webid(sessionid)
export function getWEBIDCookie() {
	return Storage.memory.get('es_session_id') ? Storage.memory.get('es_session_id') : null;
}
export function setWEBIDCookie(session_id) {
	Storage.memory.set('es_session_id', session_id)
}

/**
 * 系统参数
 */
export function getSysParamsCookie() {
	return Storage.memory.get('es_sys_params') ? Storage.memory.get('es_sys_params') : null;
}
export function setSysParamsCookie(params) {
	Storage.memory.set('es_sys_params', params)
}