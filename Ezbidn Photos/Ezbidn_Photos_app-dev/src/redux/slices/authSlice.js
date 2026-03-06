import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setEncryptedLocalStorage, getDecryptedLocalStorage, removeLocalStorage } from "../../utils/browserStorage";
import apiHandler from "../../utils/API/api";
import apiConfig from "../../utils/API/apiConfig";

const initialState = {
	user: getDecryptedLocalStorage("user") || null,
	token: getDecryptedLocalStorage("token") || null,
	isLoggedIn: false,
	isUserAdmin: false,
	loading: false,
	error: null,
};

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
	try {
		let isUserAdmin = false,
			isLoggedIn = false;
		const response = await apiHandler.post(apiConfig.auth.login.url, {}, credentials);
		const { token, data, status, customcode } = response;

		if (status) {
			setEncryptedLocalStorage("user", data);
			setEncryptedLocalStorage("token", token);
			setEncryptedLocalStorage("userLogined", true);
			isLoggedIn = true;
			if (data?.role === "admin") {
				isUserAdmin = true;
				setEncryptedLocalStorage("admin", true);
			}
		}

		return { user: data, token, isLoggedIn, isUserAdmin, customcode, status };
	} catch (error) {
		return rejectWithValue(error || "Login failed");
	}
});
export const loginGuestUser = createAsyncThunk("auth/loginGuestUser", async (credentials, { rejectWithValue }) => {
	try {
		let isUserAdmin = false,
			isLoggedIn = false;
		const response = await apiHandler.post(apiConfig.auth.guestLogin.url, {}, credentials);
		const { token, data, status, customcode } = response;

		if (status) {
			setEncryptedLocalStorage("user", data);
			setEncryptedLocalStorage("token", token);
			setEncryptedLocalStorage("userLogined", true);
			isLoggedIn = true;
		}

		return { user: data, token, isLoggedIn, isUserAdmin, customcode };
	} catch (error) {
		return rejectWithValue(error || "Login failed");
	}
});

export const socialLogin = createAsyncThunk("auth/socialLogin", async (credentials, { rejectWithValue }) => {
	try {
		let isUserAdmin = false,
			isLoggedIn = false;
		const response = await apiHandler.post(apiConfig.auth.socialLogin.url, {}, credentials);
		const { token, data, status } = response;

		if (status) {
			setEncryptedLocalStorage("user", data);
			setEncryptedLocalStorage("token", token);
			setEncryptedLocalStorage("userLogined", true);
			isLoggedIn = true;
		}

		return { user: data, token, isLoggedIn, isUserAdmin };
	} catch (error) {
		return rejectWithValue(error || "Login failed");
	}
});

// 🟢 Register API Call
export const registerUser = createAsyncThunk("auth/registerUser", async (credentials, { rejectWithValue }) => {
	try {
		const response = await apiHandler.post(apiConfig.auth.register.url, {}, credentials);
		return response;
	} catch (error) {
		return rejectWithValue(error.response?.data || "Registration failed");
	}
});

export const resendOtp = createAsyncThunk("auth/resendOtp", async (email, { rejectWithValue }) => {
	try {
		const response = await apiHandler.post(apiConfig.auth.resendOTP.url, {}, { email });
		return response || "OTP resent successfully";
	} catch (error) {
		return rejectWithValue(error.response?.data || "Failed to resend OTP");
	}
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (data, { rejectWithValue }) => {
	try {
		const response = await apiHandler.post(apiConfig.auth.verifyOtp.url, {}, { email: data.email, otp: data.otp });
		return response || "OTP resent successfully";
	} catch (error) {
		return rejectWithValue(error.response?.data || "Failed to resend OTP");
	}
});

export const verifyPasswordOtp = createAsyncThunk("auth/verifyPasswordOtp", async (data, { rejectWithValue }) => {
	try {
		const response = await apiHandler.post(
			apiConfig.auth.verifyPasswordOtp.url,
			{},
			{ email: data.email, otp: data.otp }
		);
		return response || "OTP resent successfully";
	} catch (error) {
		return rejectWithValue(error.response?.data || "Failed to resend OTP");
	}
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
	try {
		const response = await apiHandler.post(apiConfig.auth.forgotPassword.url, {}, { email });
		return response || "Reset link sent successfully";
	} catch (error) {
		return rejectWithValue(error.response?.data || "Failed to send reset link");
	}
});
export const resetPassword = createAsyncThunk("auth/resetPassword", async (data, { rejectWithValue }) => {
	try {
		const response = await apiHandler.post(
			apiConfig.auth.resetPassword.url,
			{},
			{
				verificationId: data.verificationId,
				newpassword: data.newPassword,
				email: data.email,
			}
		);
		return response || "Reset link sent successfully";
	} catch (error) {
		return rejectWithValue(error.response?.data || "Failed to send reset link");
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.isLoggedIn = false;
			state.isUserAdmin = false;

			removeLocalStorage("user");
			removeLocalStorage("token");
			removeLocalStorage("userLogined");
			removeLocalStorage("admin");
		},
	},
	extraReducers: (builder) => {
		builder
			// 🟢 Login Handlers
			.addCase(socialLogin.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(socialLogin.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isLoggedIn = action.payload.isLoggedIn;
				state.isUserAdmin = action.payload.isUserAdmin;
			})
			.addCase(socialLogin.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isLoggedIn = action.payload.isLoggedIn;
				state.isUserAdmin = action.payload.isUserAdmin;
				state.customcode = action.payload.customcode;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(loginGuestUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginGuestUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.isLoggedIn = action.payload.isLoggedIn;
				state.isUserAdmin = action.payload.isUserAdmin;
				state.customcode = action.payload.customcode;
			})
			.addCase(loginGuestUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(registerUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(registerUser.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(resendOtp.pending, (state) => {
				state.loading = true;
			})
			.addCase(resendOtp.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(resendOtp.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			.addCase(verifyOtp.pending, (state) => {
				state.loading = true;
			})
			.addCase(verifyOtp.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(verifyOtp.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// 🟢 Resend OTP Handlers
			.addCase(verifyPasswordOtp.pending, (state) => {
				state.loading = true;
			})
			.addCase(verifyPasswordOtp.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(verifyPasswordOtp.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// 🟢 Forgot Password Handlers
			.addCase(forgotPassword.pending, (state) => {
				state.loading = true;
			})
			.addCase(forgotPassword.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(forgotPassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(resetPassword.pending, (state) => {
				state.loading = true;
			})
			.addCase(resetPassword.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(resetPassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
