import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from 'react-native-webview';
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";

const StripeCheckoutScreen = ({ route }) => {
    const { checkourURL } = route.params;
    const navigation = useNavigation();
    const { setIsLoading } = useLoading();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={require('../assets/back.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.txtContainer}>
                    <Text style={styles.title}>Checkout</Text>
                </View>
            </View>
            <WebView
                source={{ uri: checkourURL }}
                originWhitelist={['*']}
                style={{ flex: 1 }}
                useWebKit
                mixedContentMode="always"
                androidLayerType="hardware"
                cacheEnabled={false}
                cacheMode={'LOAD_NO_CACHE'}
                incognito={true}
                javaScriptEnabled
                onLoadStart={() => {
                    console.log('start', checkourURL);
                    setIsLoading(true);
                }}
                onLoadEnd={(event) => {
                    console.log('onLoadEnd----->', event);
                    setIsLoading(false);
                }}
                onNavigationStateChange={(navState) => {
                    console.log('URL changed to:', navState.url);

                    if (navState.url.includes('https://dev.ezbidn.com/user/account/order-confirmed')) {
                        // ✅ Payment successful
                        console.log('Payment success!');
                        setTimeout(() => {
                            setIsLoading(false);
                            navigation.replace("SuccessOrderView");
                        }, 1000);
                        // handlePaymentSuccess();
                    } else if (navState.url.includes('https://dev.ezbidn.com/user/account/order-failed')) {
                        // ❌ Payment cancelled
                        setTimeout(() => {
                            setIsLoading(false);
                            navigation.replace("FailedOrderView");
                        }, 1000);
                        // handlePaymentCancelled();
                    }
                }}
            />
        </SafeAreaView>
    );
};

export default StripeCheckoutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: -50,
        marginTop: -5,
    },
    backIcon: {
        width: 40,
        height: 40,
    },
    backButton: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    flexGrow: {
        flex: 1,
    },
    txtContainer: {
        flex: 1,
        alignItems: 'center',
    },
    planContainer: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    selectedPlan: {
        backgroundColor: "#E04E26",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    planTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },

});