import { Platform } from "react-native";
import Storage from "../utils/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import uuid from 'react-native-uuid';

const API_BASE_URL = "https://api.ezbidn.com/api/v1";

const getUUID = async () => {
    const savedUUID = await AsyncStorage.getItem('saveUDID');
    if (savedUUID) {
        return savedUUID;
    }
    const credentials = await Keychain.getGenericPassword({ service: 'DeviceUUID' });
    if (credentials) {
        await AsyncStorage.setItem('saveUDID', credentials.password);
        return credentials.password;
    } else {
        const newUUID = uuid.v4();
        await AsyncStorage.setItem('saveUDID', newUUID);
        await Keychain.setGenericPassword('uuid', newUUID, { service: 'DeviceUUID' });
        return newUUID;
    }
};
const request = async (endpoint, method, body = null, auth = false) => {
    const uuid = await getUUID();

    const headers = {
        "Content-Type": "application/json",
        "devicetype": Platform.OS,
        "uuid": uuid
    };
    const authToken = await Storage.getAuthToken();
    console.log("authToken token:", authToken);

    if (authToken) {
        headers["x-auth-token"] = authToken;
    }
    if (auth) {
        const username = "EzbidnUser@2025";
        const password = "$2b$08$j8iKt755df8WX/qjIz5Iwu.HsZUpeqbmbWtDsyNImhBUFr54AqqMS";
        headers["Authorization"] = `Basic ${btoa(`${username}:${password}`)}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        console.log("reqquest parms:", response);

        const jsonResponse = await response.json();
        console.log("Response:", jsonResponse);

        return jsonResponse;
    } catch (error) {
        console.error("API Request Error:", error);
        return null;
    }
};

export const login = async (email, password) => {
    return request("/user/login", "POST", { email, password }, true);
};

export const guestLogin = async (email) => {
    return request("/user/guestLogin", "POST", { email }, true);
};
export const socialLogin = async (name, email, provider, provider_id, phone, profile_picture) => {
    return request("/user/socialLogin", "POST", { name, email, provider, provider_id, phone, profile_picture }, true);
};
export const register = async (name, email, password, phone) => {
    return request("/user/register", "POST", { name, email, password, phone }, true);
};
export const verifyOtp = async (otp, email) => {
    return request("/user/verifyOtp", "POST", { otp, email }, true);
}
export const forgotPassword = async (email) => {
    return request("/user/forgotPassword", "POST", { email }, true);
}
export const resendOtp = async (email) => {
    return request("/user/resendOtp", "POST", { email }, true);
}
export const verifyPassOtp = async (otp, email) => {
    return request("/user/verifyPassOtp", "POST", { otp, email }, true);
}
export const resetPassword = async (verificationId, email, newpassword) => {
    return request("/user/resetPassword", "POST", { verificationId, email, newpassword }, true);
}
export const editProfile = async (verificationId, name, phone) => {
    return request("/user/editProfile", "PUT", { verificationId, name, phone }, true);
}
export const viewProfile = async (verificationId) => {
    return request(`/user/viewProfile?verificationId=${verificationId}`, "GET", null, true);
};
export const changePassword = async (oldPassword, newPassword) => {
    return request("/user/changePassword", "PUT", { oldPassword, newPassword }, true);
}
export const contactUsForm = async (email, description) => {
    return request("/user/contactUsForm", "POST", { email, description }, true);
}
export const findFederalInmate = async (inmateId) => {
    return request(`/inmate/findFederalInmate/${inmateId}`, "GET", null, true);
};
export const saveInmate = async (nameFirst, nameMiddle, nameLast, sex, race, age, inmateNum, faclCode, faclName, faclType, faclURL, releaseCode, projRelDate, actRelDate) => {
    return request("/inmate/saveInmate", "POST", { nameFirst, nameMiddle, nameLast, sex, race, age, inmateNum, faclCode, faclName, faclType, faclURL, releaseCode, projRelDate, actRelDate }, true);
}
export const inmateList = async () => {
    return request(`/inmate/inmateList`, "GET", null, true);
};
export const pricingTierst = async () => {
    return request(`/user/pricingTiers`, "GET", null, true);
};
export const uploadImage = async (imageUri, inmate_id, image_type) => {
    const formData = new FormData();

    formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "photo.jpg",
    });
    formData.append("inmate_id", inmate_id);
    formData.append("image_type", image_type);

    return uploadImagerequest("/user/imageUpload", "POST", formData, true);
};
const uploadImagerequest = async (url, method, data) => {
    const headers = {
        "Content-Type": "multipart/form-data",
        "devicetype": Platform.OS,
        "uuid": "safasfafasfasfasfas"
    };
    const authToken = await Storage.getAuthToken();
    console.log("authToken token:", authToken);
    console.log("uploadImage Starting Api :");

    if (authToken) {
        headers["x-auth-token"] = authToken;
    }
    const username = "EzbidnUser@2025";
    const password = "$2b$08$j8iKt755df8WX/qjIz5Iwu.HsZUpeqbmbWtDsyNImhBUFr54AqqMS";
    headers["Authorization"] = `Basic ${btoa(`${username}:${password}`)}`;

    const options = {
        method,
        headers,
    };

    const body = data;
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method,
            headers,
            body,
        });
        console.log("uploadImage parms:", response);
        const jsonResponse = await response.json();
        console.log("ploadImage Response:", jsonResponse);
        return await jsonResponse;
        // return await response.json();
    } catch (err) {
        console.error("API error:", err);
        throw err;
    }
};
export const deleteUploadedImage = async (imageId) => {
    return request(`/user/deleteUploadedImage/${imageId}`, "PUT", null, true);
};
export const removeInmate = async (id) => {
    return request(`/inmate/removeInmate/${id}`, "PUT", null, true);
};
export const getInmateDetailById = async (id) => {
    return request(`/inmate/getInmateDetailById/${id}`, "GET", null, true);
};
export const checkoutOrder = async (inmate_id, customer_id, pricing_tier_id, images) => {
    console.log("ImageIDD", images)
    return request("/user/checkoutOrder", "POST", { inmate_id, customer_id, pricing_tier_id, images }, true);
}
export const getAllOrders = async () => {
    return request(`/user/getAllOrders`, "GET", null, true);
};
export const getOrderDetailsById = async (orderId) => {
    return request(`/user/getOrderDetailsById/${orderId}`, "GET", null, true);
};