// src/utils/api.js
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { enqueueSnackbar } from "notistack"; // MUI Snackbar for toasts
import { getDecryptedLocalStorage, setEncryptedLocalStorage } from "../browserStorage";

const AUTH_ID = "EzbidnUser@2025";
const AUTH_PASSWORD = "$2b$08$j8iKt755df8WX/qjIz5Iwu.HsZUpeqbmbWtDsyNImhBUFr54AqqMS";

const basicAuthHeader = `Basic ${btoa(AUTH_ID + ":" + AUTH_PASSWORD)}`;

const replaceUrlParams = (url, params) => {
	return url.replace(/:(\w+)/g, (_, key) => params[key] || `:${key}`);
};

export const getDeviceUUID = () => {
	const localStorageKey = "device-uuid";
	let deviceUUID = getDecryptedLocalStorage(localStorageKey);

	if (!deviceUUID) {
		deviceUUID = uuidv4();
		setEncryptedLocalStorage(localStorageKey, deviceUUID);
	}

	return deviceUUID;
};

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
		Authorization: basicAuthHeader,
		Devicetype: "web",
		uuid: getDeviceUUID(),
		Lang: "en",
	},
	timeout: 60000,
});

api.interceptors.request.use(
	(config) => {
		const token = getDecryptedLocalStorage("token");
		if (token) {
			config.headers["X-Auth-Token"] = `${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => {
		if (!response.data?.status) {
			let error = {
				response,
			};
			handleApiError(error);
		}
		return response.data; // Return only data on success
	},
	(error) => {
		handleApiError(error);
		return Promise.reject(error);
	}
);

// Error handler for API failures
const handleApiError = (error) => {
	let errorMessage = "Something went wrong!";
	if (error.response) {
		const { status, data } = error.response;
		errorMessage = data?.message || (status === 401 ? "Unauthorized! Please login again." : errorMessage);
	} else if (error.message === "Network Error") {
		errorMessage = "Network Error! Please check your connection.";
	} else {
		errorMessage = error.message;
	}

	enqueueSnackbar(errorMessage, { variant: "error", autoHideDuration: 5000 });
};

const apiHandler = {
	get: async (url, params = {}, queryParams = {}) => {
		try {
			const finalUrl = replaceUrlParams(url, params);
			return await api.get(finalUrl, { params: queryParams });
		} catch (error) {
			throw error;
		}
	},

	post: async (url, params = {}, data = {}, config = {}) => {
		try {
			const finalUrl = replaceUrlParams(url, params);
			return await api.post(finalUrl, data, config);
		} catch (error) {
			throw error;
		}
	},

	put: async (url, params = {}, data = {}, config = {}) => {
		try {
			const finalUrl = replaceUrlParams(url, params);
			return await api.put(finalUrl, data, config);
		} catch (error) {
			throw error;
		}
	},

	delete: async (url, params = {}, config = {}) => {
		try {
			const finalUrl = replaceUrlParams(url, params);
			return await api.delete(finalUrl, config);
		} catch (error) {
			throw error;
		}
	},
};

export default apiHandler;
