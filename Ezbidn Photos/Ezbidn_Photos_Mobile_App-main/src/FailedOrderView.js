import React, { useState } from "react";
import { SafeAreaView, Modal, ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 60) / 2;
const FailedOrderView = ({ isVisible, onClose }) => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.header}>
                        <View style={styles.popupContainer}>
                            <Image source={require("../assets/redCross.png")} style={styles.icon} />
                            <Text style={styles.popupTitle}>Order Failed</Text>
                            <Text style={styles.popupDescription}>
                            Your order has been cancelled. If this was a mistake, please try again or contact support.
                            </Text>
                            <TouchableOpacity style={styles.popupButton} onPress={() => {
                                navigation.replace("MainApp");
                            }}>
                                <Text style={styles.popupButtonText}>Go to Home →</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.flexGrow} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default FailedOrderView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
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
        marginLeft: -10
    },
    flexGrow: {
        flex: 1,
    },
    txtContainer: {
        flex: 1,
        alignItems: 'center',
    },
    subText: {
        fontSize: 14,
        color: "gray",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#E55336",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    popupContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 200,
    },
    icon: {
        width: 60,
        height: 60,
        marginBottom: 15,
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    popupDescription: {
        fontSize: 14,
        textAlign: "center",
        marginVertical: 10,
        color: "#555",
    },
    popupButton: {
        backgroundColor: "#E85528",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 15,
    },
    popupButtonText: {
        color: "white",
        fontSize: 16,
    },
});