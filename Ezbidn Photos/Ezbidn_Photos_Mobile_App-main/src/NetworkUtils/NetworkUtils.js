import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export const checkInternetConnection = async () => {
	const state = await NetInfo.fetch();
	if (!state.isConnected) {
		Alert.alert(
			'Internet Connection',
			'You are offline. Please check your internet connection.'
		);
		return false;
	}
	return true;
};