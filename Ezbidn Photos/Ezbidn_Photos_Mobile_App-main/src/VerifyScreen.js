import React, { useState } from "react"
import { Alert, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { OtpInput } from "react-native-otp-entry";
import { verifyOtp } from "./services/apiService";
import { resendOtp } from "./services/apiService";
import { verifyPassOtp } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";

const VerifyScreen = ({ route }) => {
    const navigation = useNavigation();
    const [otp, setOtp] = useState("");
    const { setIsLoading } = useLoading();
    const { getEmail } = route.params;
    const { isCheckResetPass } = route.params;

    const handleVerify = async () => {
        if (otp.length === 6) {
            setIsLoading(true);
            const response = await verifyOtp(otp, getEmail);
            if (response) {
                setIsLoading(false);
                if (response?.customcode == 200) {
                    Alert.alert(
                        "Successful",
                        response?.message ?? "",
                        [
                            { text: "OK", onPress: () => navigation.navigate("Login") }
                        ]
                    );
                } else {
                    Alert.alert("Alert!", response?.message);
                }
            } else {
                setIsLoading(false);
                Alert.alert("Alert!", "Server error please try again!");
            }
        } else {
            Alert.alert("Invalid OTP", "Please enter all 6 digits of the OTP.");
        }
    };
    const handleResendOTP = async () => {
        setIsLoading(true);
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        const response = await resendOtp(getEmail);
        if (response) {
            setIsLoading(false);
            Alert.alert("Alert!", response?.message);
        } else {
            setIsLoading(false);
            Alert.alert("Alert!", "Server error please try again!");
        }
    };
    const handleVerifyPassOTP = async () => {
        if (otp.length === 6) {
            const isConnected = await checkInternetConnection();
            if (!isConnected) {
                return;
            }
            setIsLoading(true);
            const response = await verifyPassOtp(otp, getEmail);
            if (response) {
                setIsLoading(false);
                if (response?.customcode == 200) {
                    Alert.alert(
                        "Successful",
                        response?.message ?? "",
                        [
                            {
                                text: "OK", onPress: () => navigation.navigate("Reset", {
                                    fetchEmail: response.data.email,
                                    getVerificationID: response.data.verificationId
                                })
                            }
                        ]
                    );
                } else {
                    Alert.alert("Alert!", response?.message);
                }
            } else {
                setIsLoading(false);
                Alert.alert("Alert!", "Server error please try again!");
            }
        } else {
            Alert.alert("Invalid OTP", "Please enter all 6 digits of the OTP.");
        }
    };
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
                    <Text style={styles.title}>Verify OTP</Text>
                    <Text style={styles.subtitle}>Enter your verification code from your email address that we’ve sent</Text>

                    <OtpInput
                        numberOfDigits={6}
                        focusColor="#E04E26"
                        autoFocus={false}
                        hideStick={true}
                        placeholder="------"
                        blurOnFilled={true}
                        disabled={false}
                        type="numeric"
                        secureTextEntry={false}
                        focusStickBlinkingDuration={500}
                        onFocus={() => console.log("Focused")}
                        onBlur={() => console.log("Blurred")}
                        onTextChange={(text) => setOtp(text)}
                        onFilled={(text) => console.log(`OTP is ${text}`)}
                        textInputProps={{
                            accessibilityLabel: "One-Time Password",
                        }}
                        theme={{
                            containerStyle: styles.otpcontainer,
                            pinCodeContainerStyle: styles.pinCodeContainer,
                            pinCodeTextStyle: styles.pinCodeText,
                            focusStickStyle: styles.focusStick,
                            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                            placeholderTextStyle: styles.placeholderText,
                            filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                            disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
                        }}
                    />

                    <TouchableOpacity style={styles.button} onPress={isCheckResetPass == false ? handleVerify : handleVerifyPassOTP}>
                        <Text style={styles.buttonText}>Verify</Text>
                    </TouchableOpacity>

                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Didn’t receive?</Text>
                        <Text style={styles.loginText} onPress={handleResendOTP}>Resend</Text>
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
    otpcontainer: {
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

export default VerifyScreen;
