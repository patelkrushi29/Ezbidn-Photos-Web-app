import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_KEY = 'userData';
const AUTH_TOKEN_KEY = 'authToken';

const Storage = {
    saveUserData: async (data, token) => {
        try {
            await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
            await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    },

    getUserData: async () => {
        try {
            const userData = await AsyncStorage.getItem(USER_DATA_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error retrieving user data:', error);
            return null;
        }
    },

    getAuthToken: async () => {
        try {
            return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        } catch (error) {
            console.error('Error retrieving auth token:', error);
            return null;
        }
    },

    clearStorage: async () => {
        try {
            await AsyncStorage.removeItem(USER_DATA_KEY);
            await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
};

export default Storage;
