import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const CustomHeader = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                {/* Left - Menu Button */}
                <TouchableOpacity onPress={() => navigation.navigate("SideProfile")} style={styles.iconButton}>
                    <Image source={require('../assets/burger.png')} style={styles.burgerImgIcon} />
                </TouchableOpacity>

                {/* Center - Logo */}
                <Image source={require('../assets/onboardLogo.png')} style={styles.logo} resizeMode="contain" />

                {/* Right - Notification Icon */}
                <TouchableOpacity onPress={() => navigation.navigate("Notifications")} style={styles.iconButton}>
                    <Image source={require('../assets/notibell.png')} style={styles.bellImgIcon} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    iconButton: {
        padding: 10,
    },
    burgerImgIcon: {
        width: 37,
        height: 37,
        resizeMode: 'contain',
    },
    bellImgIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    logo: {
        height: 40,
        width: 100,
        resizeMode: 'contain',
    },
});

export default CustomHeader;
