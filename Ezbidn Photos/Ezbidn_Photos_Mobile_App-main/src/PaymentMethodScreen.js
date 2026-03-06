import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const paymentMethods = [
    { id: "stripe", name: "Stripe", image: require("../assets/StripeIcon.png") },
    { id: "paypal", name: "PayPal", image: require("../assets/paypalIcon.png") },
    { id: "applepay", name: "Apple Pay", image: require("../assets/applePayIcon.png") },
    { id: "googlepay", name: "Google Pay", image: require("../assets/gpayIcon.png") },
];
const PaymentMethodScreen = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = useState("stripe");

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.container}>
                <View style={styles.backcontainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image
                            source={require('../assets/back.png')}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                    <View style={styles.txtContainer}>
                        <Text style={styles.mainTitle}>Payment Method</Text>
                    </View>
                    {/* Placeholder for balancing the layout */}
                    <View style={styles.backButton} />
                </View>
                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.option,
                                selected === method.id && styles.selectedOption,
                            ]}
                            onPress={() => setSelected(method.id)}
                        >
                            <View style={styles.radioContainer}>
                                <View style={[styles.radioCircle, selected === method.id && styles.radioSelected]} />
                                <Text style={styles.text}>{method.name}</Text>
                            </View>
                            <Image source={method.image} style={styles.image} resizeMode="contain" />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.flexGrow} />

                <TouchableOpacity style={styles.addButton} onPress={() => {
                    navigation.replace("MainApp");
                }}>
                    <Text style={styles.addButtonText}>Save Changes ➜</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    txtContainer: {
        flex: 1,
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: "Reguler",
        marginTop: -5,
    },
    backcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: -10,
        height: 60,
        backgroundColor: '#FFF',
    },
    backButton: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    backIcon: {
        width: 40,
        height: 40,
    },
    addButton: {
        backgroundColor: "#E04E26",
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        margin: 15,
        borderRadius: 5,
        position: "absolute",
        bottom: 20,
        left: 15,
        right: 15,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    scrollContainer: {
        padding: 16,
        maxHeight: 500,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E5E5",
        backgroundColor: "#FFF",
        marginBottom: 10,
    },
    selectedOption: {
        borderColor: "#E04E26",
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#E04E26",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    radioSelected: {
        backgroundColor: "#E04E26",
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    image: {
        width: 50,
        height: 25,
    },
});

export default PaymentMethodScreen;