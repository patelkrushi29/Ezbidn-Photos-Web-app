import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { contactUsForm } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";

const SupportCenterScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const { setIsLoading } = useLoading();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const handleSubmit = async () => {
        if (!email.trim()) {
            Alert.alert("Validation Error", "Email is required");
            return;
        } else if (!validateEmail(email)) {
            Alert.alert("Validation Error", "Enter a valid email");
            return;
        } else if (!message.trim()) {
            Alert.alert("Validation Error", "Description is required");
            return;
        }
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        const response = await contactUsForm(email, message);
        if (response) {
            setIsLoading(false);
            if (response?.customcode == 200) {
                Alert.alert(
                    "Success!",
                    response?.message ?? "",
                    [
                        { text: "OK", onPress: () => navigation.goBack() }
                    ]
                );
            } else {
                Alert.alert("Alert!", response?.message);
            }
        } else {
            setIsLoading(false);
            Alert.alert("Alert!", "Server error please try again!");
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image
                            source={require('../assets/back.png')}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                    <View style={styles.txtContainer}>
                        <Text style={styles.title}>Support Center</Text>
                    </View>
                </View>
                {/* Subtitle */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView contentContainerStyle={styles.subContainer}>
                            <Text style={styles.heading}>
                                Our dedicated team is here to assist you with any question or issues
                            </Text>
                            <Image source={require("../assets/supportBanner.png")} style={styles.subImage} />
                            <View style={styles.vistContainer}>
                                <Text style={styles.visitHeading}>Visit us</Text>
                                <Text style={styles.visitAddress}>123 Irving St, San Francisco, California 93510</Text>
                                <Text style={styles.visitHeading}>Contact Us</Text>
                                <Text style={styles.visitAddress}>support@ezbidn.com</Text>
                                <Text style={styles.visitAddress}>(615) 616-6170</Text>
                                <Text style={styles.helpHeading}>For Any Help</Text>
                                <TextInput
                                    style={styles.helpInput}
                                    placeholder="Enter email address"
                                    placeholderTextColor="#A0A0A0"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                                <TextInput
                                    style={styles.messageInput}
                                    placeholder="Enter your message"
                                    placeholderTextColor="#A0A0A0"
                                    value={message}
                                    onChangeText={setMessage}
                                    multiline={true}
                                />
                                <TouchableOpacity style={styles.helpButton} onPress={handleSubmit}>
                                    <Text style={styles.helpButtonText}>Email Us →</Text>
                                </TouchableOpacity>
                                <View style={styles.flexGrow} />
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

export default SupportCenterScreen;

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
        marginTop: 20,
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
        fontSize: 18,
        fontWeight: "Reguler",
        marginBottom: 20,
    },
    txtContainer: {
        flex: 1,
        alignItems: 'center',
    },
    subContainer: {
        alignItems: 'center',
    },
    subImage: {
        width: '100%',
        height: 140,
        borderRadius: 10,
        marginBottom: 20,
    },
    vistContainer: {
        padding: 0,
    },
    visitHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#D64527',
        marginBottom: 10,
    },
    visitAddress: {
        fontSize: 15,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#333",
        backgroundColor: "#F9F9F9",
    },
    button: {
        backgroundColor: "#E04E2F",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
    helpHeading: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 10,
        marginTop: 10,

    },
    helpInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#333",
        backgroundColor: "#F9F9F9",
    },
    messageInput: {
        height: 100,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        textAlignVertical: 'top',
        marginTop: 10,

    },
    helpButton: {
        backgroundColor: "#E04E2F",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
        width: '140',
        marginTop: 20,
    },
    helpButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
});