import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const encryptData = (data) => {
	try {
		const jsonData = JSON.stringify(data);
		return CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
	} catch (error) {
		console.error("Encryption error:", error);
		return null;
	}
};

const decryptData = (encryptedData) => {
	try {
		const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
		const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
		return JSON.parse(decryptedData);
	} catch (error) {
		console.error("Decryption error:", error);
		return null;
	}
};

export const setEncryptedLocalStorage = (key, value) => {
	const encryptedValue = encryptData(value);
	if (encryptedValue) {
		localStorage.setItem(key, encryptedValue);
	}
};

export const getDecryptedLocalStorage = (key) => {
	const encryptedValue = localStorage.getItem(key);
	return encryptedValue ? decryptData(encryptedValue) : null;
};

export const removeLocalStorage = (key) => {
	localStorage.removeItem(key);
};

export const setEncryptedSessionStorage = (key, value) => {
	const encryptedValue = encryptData(value);
	if (encryptedValue) {
		sessionStorage.setItem(key, encryptedValue);
	}
};

export const getDecryptedSessionStorage = (key) => {
	const encryptedValue = sessionStorage.getItem(key);
	return encryptedValue ? decryptData(encryptedValue) : null;
};

export const removeSessionStorage = (key) => {
	sessionStorage.removeItem(key);
};
