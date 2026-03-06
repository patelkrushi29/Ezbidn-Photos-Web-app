import React, { useState } from "react";
import { SafeAreaView, Modal, ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Checkbox } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 60) / 2;
const ConfirmationInmate = ({ isVisible, onClose }) => {
    const navigation = useNavigation();
    const [checked, setChecked] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Image
                                source={require('../assets/back.png')}
                                style={styles.backIcon}
                            />
                        </TouchableOpacity>
                        <View style={styles.txtContainer}>
                            <Text style={styles.title}>Confirmation</Text>
                        </View>
                    </View>

                    {/* Subtitle */}
                    <Text style={styles.heading}>Shipping Info</Text>
                    <Text style={styles.subText}>Check all shipping information if you don’t make any changes please click on submit button & reach out to your loved ones</Text>
                    <Text style={styles.heading}>Inmate Details</Text>

                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <View>
                                <Text style={styles.name}>Richard Smith</Text>
                                <Text style={styles.details}>Acton Conservation Camp #11</Text>
                                <Text style={styles.details}>
                                    Register Number: <Text style={styles.highlight}>87528440</Text>
                                </Text>
                                <Text style={styles.cardPhotos}>1 Photos (4x5)</Text>
                            </View>
                            <TouchableOpacity style={styles.cardButton}>
                                <Text style={styles.cardButtonText}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", padding: 8 }}>
                        <Checkbox
                            status={checked ? "checked" : "unchecked"}
                            onPress={() => setChecked(!checked)}
                        />
                        <Text style={{ fontSize: 14, color: "#333" }}>
                            I agree to the Ezbidn{" "}
                            <Text style={{ color: "#E53E3E", fontWeight: "bold" }}>
                                Terms & Condition
                            </Text>
                            ,{" "}
                            <Text style={{ color: "#E53E3E", fontWeight: "bold" }}>
                                Delivery Guidelines
                            </Text>{" "}
                            and{" "}
                            <Text style={{ color: "#E53E3E", fontWeight: "bold" }}>
                                Privacy Policy
                            </Text>
                            .
                        </Text>
                    </View>


                    <View style={styles.flexGrow} />
                    {/* Next Button */}
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddFederal")}>
                        <Text style={styles.buttonText}>Submit →</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Modal
                    isVisible={isVisible}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    backdropOpacity={0.5}
                    useNativeDriver
                    style={styles.modalContainer} // Ensuring the modal is centered
                >
                    <View style={styles.popupContainer}>
                        <Image source={require("../assets/orderConfirm.png")} style={styles.icon} />
                        <Text style={styles.popupTitle}>Your Order is Confirmed!</Text>
                        <Text style={styles.popupDescription}>
                            Thank you for your order! Your order is being processed and will be
                            completed within 2-3 days. You will receive an email confirmation
                            when your order is completed.
                        </Text>
                        <TouchableOpacity style={styles.popupButton} onPress={() => {
                            // navigation.navigate("MainApp");
                            navigation.replace("MainApp");
                        }}>
                            <Text style={styles.popupButtonText}>Go to Home →</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

export default ConfirmationInmate;

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
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
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
    card: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

    },
    heading: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    details: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    highlight: {
        color: "#E74C3C",
        fontWeight: "bold",
    },
    cardPhotos: {
        fontSize: 14,
        color: "#E74C3C",
        fontWeight: "bold",
        marginTop: 4,
    },
    cardButton: {
        backgroundColor: "#E74C3C",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    cardButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 0, // Ensures the modal is centered and takes full screen
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
