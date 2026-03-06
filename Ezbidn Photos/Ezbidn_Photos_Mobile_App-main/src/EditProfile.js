import React, { useEffect, useState } from "react"
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Storage from "./utils/storage";
import { editProfile, viewProfile } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";

const EditProfile = () => {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [userID, setUserID] = useState("");
    const { setIsLoading } = useLoading();

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await Storage.getUserData();
            if (userData) {
                setUserID(userData.id);
            }
        };
        fetchUserData();
    }, []);
    useEffect(() => {
        if (userID) {
            getViewProfile();
        }
    }, [userID]);

    const handleEditProfile = async () => {
        if (!fullName.trim()) {
            Alert.alert("Validation Error", "Enter the full name");
            return;
        }
        if (!phone.trim()) {
            Alert.alert("Validation Error", "Phone number is required.");
            return;
        } else if (!/^\d{10}$/.test(phone.trim())) {
            Alert.alert("Validation Error", "Phone number must be exactly 10 digits.");
            return;
        }
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        const response = await editProfile(18, fullName, phone);
        if (response) {
            setIsLoading(false);
            if (response?.customcode == 200) {
                // Storage.saveUserData(response.data, response.token);
                Alert.alert("Alert!", response?.message);
            } else {
                Alert.alert("Alert!", response?.message);
            }

        } else {
            setIsLoading(false);
            Alert.alert("Alert!", "Server error please try again");
        }
    };
    const getViewProfile = async () => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await viewProfile(userID);
            setIsLoading(false);

            if (response?.customcode === 200) {
                setFullName(response?.data?.name);
                setEmail(response?.data?.email);
                setPhone(response?.data?.phone);
            } else {
                Alert.alert("Error!", response?.message);
            }
        } catch (error) {
            setIsLoading(false);
            Alert.alert("Error!", "Server error, please try again.");
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
                        <View style={styles.txtContainer}>
                            <Text style={styles.mainTitle}>Edit Profile</Text>
                        </View>
                        {/* Placeholder for balancing the layout */}
                        <View style={styles.backButton} />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input} value={fullName || ""} onChangeText={setFullName} placeholder="Enter your name" />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input} value={email || ""} editable={false} placeholder="Enter email address" keyboardType="email-address" />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input} value={phone || ""} onChangeText={setPhone} placeholder="Your phone number" keyboardType="phone-pad" />
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity style={styles.updateButton} onPress={handleEditProfile}>
                        <Text style={styles.updateButtonText}>Save Changes →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.changePasswordButton} onPress={() => navigation.navigate("ChangePass")}>
                        <Text style={styles.changePasswordText}>Change Password →</Text>
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
    dividercontainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },
    dividerline: {
        flex: 1,
        height: 1,
        backgroundColor: "#DCDCDC",
    },
    dividertext: {
        marginHorizontal: 10,
        color: "#1E1E1E",
        fontWeight: "reguler",
    },
    socialBtnscontainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    socialbutton: {
        width: 60,
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        backgroundColor: "#fff",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    updateButton: {
        backgroundColor: "#E04E26",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 50,
    },
    updateButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    changePasswordButton: {
        borderWidth: 1,
        borderColor: "#E04E26",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    changePasswordText: {
        color: "#E04E26",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default EditProfile;
