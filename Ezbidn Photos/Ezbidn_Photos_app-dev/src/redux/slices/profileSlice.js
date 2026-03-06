import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setEncryptedLocalStorage, getDecryptedLocalStorage } from "../../utils/browserStorage";
import apiHandler from "../../utils/API/api";
import apiConfig from "../../utils/API/apiConfig";

// Initial state
const initialState = {
	user: getDecryptedLocalStorage("user") || null,
	loading: false,
	error: null,
	success: false,
};

// 🟢 Fetch Profile API Call
export const fetchProfile = createAsyncThunk("profile/fetchProfile", async (_, { rejectWithValue }) => {
	try {
		const response = await apiHandler.get(apiConfig.user.getProfile.url, {});
		const { data, status } = response;

		if (status) {
			setEncryptedLocalStorage("user", data);
		}

		return data;
	} catch (error) {
		return rejectWithValue(error.response?.data || "Failed to fetch profile");
	}
});

// 🟢 Update Profile API Call
export const updateProfile = createAsyncThunk("profile/updateProfile", async (profileData, { rejectWithValue }) => {
	try {
		const response = await apiHandler.put(
			apiConfig.user.updateProfile.url,
			{},
			{
				verificationId: profileData.verificationId,
				name: profileData.FullName,
				phone: profileData.Phone,
			}
		);
		// const { data, status } = response;

		return response;
	} catch (error) {
		return rejectWithValue(error.response?.data || "Failed to update profile");
	}
});

// 🟢 Change Password API Call
export const changePassword = createAsyncThunk("profile/changePassword", async (passwordData, { rejectWithValue }) => {
	try {
		const response = await apiHandler.put(
			apiConfig.user.changePassword.url,
			{},
			{
				oldPassword: passwordData.oldPassword,
				newPassword: passwordData.newPassword,
			}
		);
		return response || "Password changed successfully";
	} catch (error) {
		return rejectWithValue(error.response?.data || "Failed to change password");
	}
});

// 🟢 Profile slice
const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		clearProfile: (state) => {
			state.profile = null;
			state.success = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// 🟢 Fetch Profile Handlers
			.addCase(fetchProfile.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.success = false;
			})
			.addCase(fetchProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
				state.success = true;
			})
			.addCase(fetchProfile.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// 🟢 Update Profile Handlers
			.addCase(updateProfile.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.profile = action.payload;
				state.success = true;
			})
			.addCase(updateProfile.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// 🟢 Change Password Handlers
			.addCase(changePassword.pending, (state) => {
				state.loading = true;
			})
			.addCase(changePassword.fulfilled, (state) => {
				state.loading = false;
				state.success = true;
			})
			.addCase(changePassword.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
