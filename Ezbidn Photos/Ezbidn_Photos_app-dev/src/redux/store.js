import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { getDecryptedLocalStorage } from "../utils/browserStorage";

const preloadedState = {
	auth: {
		user: getDecryptedLocalStorage("user") || null,
		token: getDecryptedLocalStorage("token") || null,
		isLoggedIn: getDecryptedLocalStorage("userLogined") ? true : false,
		isUserAdmin: getDecryptedLocalStorage("admin") ? true : false,
	},
};
const store = configureStore({
	reducer: {
		auth: authReducer,
	},
	preloadedState,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
