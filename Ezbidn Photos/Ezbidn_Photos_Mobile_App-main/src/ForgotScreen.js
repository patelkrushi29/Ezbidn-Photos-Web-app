import React, { useState } from "react"
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { forgotPassword } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";

const ForgotScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const { setIsLoading } = useLoading();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const handleForgotPassword = async () => {
        if (!email.trim()) {
            Alert.alert("Validation Error", "Email is required");
            return;
        } else if (!validateEmail(email.trim())) {
            Alert.alert("Validation Error", "Enter a valid email");
            return;
        }
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        const response = await forgotPassword(email);
        if (response) {
            setIsLoading(false);
            if (response?.customcode == 200) {
                Alert.alert(
                    "Alert!",
                    response?.message ?? "",
                    [
                        { text: "OK", onPress: () => navigation.navigate("Verify", { getEmail: email, isCheckResetPass: true }) }
                    ]
                );
            } else {
                Alert.alert("Alert", response?.message);
            }
        } else {
            setIsLoading(false);
            Alert.alert("Alert!", "Server error please try again!");
        }
    }
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <View style={styles.backcontainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Image
                                source={require('../assets/back.png')}
                                style={styles.backIcon}
                            />
                        </TouchableOpacity>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../assets/play_store.png')}
                                style={styles.logo}
                            />
                        </View>

                        {/* Placeholder for balancing the layout */}
                        <View style={styles.backButton} />
                    </View>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>Enter your registered email address, we will send you verification code</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input}
                            placeholder="Enter email address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address" />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
                        <Text style={styles.buttonText}>Send Code</Text>
                    </TouchableOpacity>

                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Don’t haven an account?</Text>
                        <Text style={styles.loginText} onPress={() => navigation.navigate("Signup")}>Register Now</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    backcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: -10,
        height: 100,
        backgroundColor: '#FFF',
    },
    backButton: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        width: 40,
        height: 40,
    },
    imgIcon: {
        width: 25,
        height: 25,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 40,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    backText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 12,
        color: "#555",
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: "reguler",
        color: "#000",
    },
    required: {
        color: "red",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff",
        marginTop: 5,
    },
    button: {
        backgroundColor: "#E45122",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    footerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: 10,
        marginTop: 20,
    },
    footerText: {
        color: "#000",
        fontSize: 16,
    },
    loginText: {
        color: "#E04E26",
        fontSize: 16,
        marginLeft: 5,
        fontWeight: "medium",
    },
});

export default ForgotScreen;
