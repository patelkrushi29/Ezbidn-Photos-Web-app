import React, { useState } from "react"
import { Alert, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { changePassword } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import Storage from "./utils/storage";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";

const ChangePassScreen = ({ route }) => {
    const navigation = useNavigation();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { setIsLoading } = useLoading();

    const validatePassword = (password) => {
        return password.length >= 6;
    };
    const handleChangePassword = async () => {
        if (!oldPassword) {
            Alert.alert("Validation Error", "Old Password is required");
            return;
        } else if (!validatePassword(oldPassword)) {
            Alert.alert("Validation Error", "Old Password must be at least 6 characters");
            return;
        }
        if (!newPassword) {
            Alert.alert("Validation Error", "New Password is required");
            return;
        } else if (!validatePassword(newPassword)) {
            Alert.alert("Validation Error", "New Password must be at least 6 characters");
            return;
        }
        if (oldPassword === newPassword) {
            Alert.alert("Validation Error",'New password must be different from the old password');
            return false;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Validation Error",'New password and confirm password must match');
            return false;
        }
        if (!confirmPassword) {
            Alert.alert("Validation Error", "Confirm Password is required");
            return;
        } else if (!validatePassword(confirmPassword)) {
            Alert.alert("Validation Error", "Confirm Password must be at least 6 characters");
            return;
        }
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        const response = await changePassword(oldPassword, newPassword);
        if (response) {
            setIsLoading(false);
            if (response?.customcode == 200) {
                Storage.clearStorage();
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
                    <Text style={styles.title}>Change Password</Text>
                    <Text style={styles.subtitle}>Enter your new password and confirm the new password to change password</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Old Password<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input}
                            placeholder="Enter old password"
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            secureTextEntry />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>New Password<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input}
                            placeholder="Enter confirm password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>

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

export default ChangePassScreen;
