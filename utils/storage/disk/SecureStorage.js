import CryptoJS from 'crypto-js'

const SECURE_KEY = 'yycfsAppSecretKey123!'

export class SecureStorage {
	static encrypt(data) {
		return CryptoJS.AES.encrypt(JSON.stringify(data), SECURE_KEY).toString()
	}

	static decrypt(cipherText) {
		const bytes = CryptoJS.AES.decrypt(cipherText, SECURE_KEY)
		return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
	}

	static async setItem(key, value) {
		const encrypted = SecureStorage.encrypt(value)
		await uni.setStorage({
			key: `secure_${key}`,
			data: encrypted
		})
	}

	static async getItem(key) {
		const {
			data
		} = await uni.getStorage({
			key: `secure_${key}`
		})
		return data ? SecureStorage.decrypt(data) : null
	}
}