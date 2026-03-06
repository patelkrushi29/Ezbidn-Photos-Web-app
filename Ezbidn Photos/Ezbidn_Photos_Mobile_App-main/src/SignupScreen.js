import React, { useState } from "react"
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { register, socialLogin } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";
import Storage from "./utils/storage";
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import {
    AccessToken,
    AuthenticationToken,
    LoginManager,
    GraphRequest, GraphRequestManager,
} from "react-native-fbsdk-next";


const SignupScreen = () => {
    const { setIsLoading } = useLoading();
    const navigation = useNavigation();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };
    const handelFBLoginAPI = async (fbUserInfo) => {
        setIsLoading(true);
        const fbUser = JSON.parse(fbUserInfo);
        console.log("User Info:", fbUser);

        const response = await socialLogin(fbUser.name, fbUser.email, "facebook", fbUser.provider_id, "", fbUser.profile_picture);
        if (response) {
            setIsLoading(false);
            if (response?.customcode == 200) {
                Storage.saveUserData(response.data, response.token);
                setTimeout(() => {
                    navigation.navigate("MainApp");
                }, 1000);
            } else if (response?.customcode == 210) {
                Alert.alert(
                    "Alert!",
                    response?.message ?? "",
                    [
                        { text: "OK", onPress: () => navigation.navigate("Verify", { getEmail: email, isCheckResetPass: false }) }
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
    const handelGoogleLoginAPI = async (googleUserInfo) => {
        setIsLoading(true);
        const googleUser = JSON.parse(googleUserInfo);
        if (googleUser.type === "success") {
            const userData = googleUser.data.user;
            const idToken = googleUser.data.user.id;
            const response = await socialLogin(userData.name, userData.email, "google", idToken, googleUser.data.user.phone, userData.photo);
            if (response) {
                setIsLoading(false);
                if (response?.customcode == 200) {
                    Storage.saveUserData(response.data, response.token);
                    setTimeout(() => {
                        navigation.navigate("MainApp");
                    }, 1000);
                } else if (response?.customcode == 210) {
                    Alert.alert(
                        "Alert!",
                        response?.message ?? "",
                        [
                            { text: "OK", onPress: () => navigation.navigate("Verify", { getEmail: email, isCheckResetPass: false }) }
                        ]
                    );
                } else {
                    Alert.alert("Alert", response?.message);
                }
            } else {
                setIsLoading(false);
                Alert.alert("Alert!", "Server error please try again!");
            }
        } else {
            console.log("Google login failed or was cancelled.");
        }
    }
    const googleLogin = async () => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        GoogleSignin.configure({
            iosClientId: '579043110855-m34fcgp94u3jrv5k69rjailc1hfmcfu2.apps.googleusercontent.com',
            webClientId: '579043110855-s2ooa293h4kmhrqfb4jmr02tuc4r55pp.apps.googleusercontent.com',
            offlineAccess: true,
        });
        GoogleSignin.hasPlayServices().then((hasPlayService) => {
            if (hasPlayService) {
                GoogleSignin.signIn().then((userInfo) => {
                    console.log("GoogleUser", JSON.stringify(userInfo))
                    handelGoogleLoginAPI(JSON.stringify(userInfo));
                }).catch((e) => {
                    console.log("ERROR IS: " + JSON.stringify(e));
                })
            }
        }).catch((e) => {
            console.log("ERROR IS: " + JSON.stringify(e));
        })
    };
    const faceBookLogin = async () => {
        console.log("Start");
        try {
            const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
            console.log("Result:", result);
            if (result.isCancelled) {
                console.log("Login cancelled");
                setIsLoading(false);
                return;
            }
            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                console.log("Something went wrong obtaining access token");
                setIsLoading(false);
                return;
            }
            const accessToken = data.accessToken;
            const userInfoRequest = new GraphRequest(
                '/me',
                {
                    accessToken,
                    parameters: {
                        fields: {
                            string: 'id,name,email,picture.type(large)',
                        },
                    },
                },
                (error, result) => {
                    setIsLoading(false);
                    if (error) {
                        console.log("Error fetching data: ", error);
                    } else {
                        const userData = {
                            name: result.name,
                            email: result.email,
                            provider: 'facebook',
                            provider_id: result.id,
                            profile_picture: result.picture?.data?.url,
                        };
                        handelFBLoginAPI(JSON.stringify(userData));
                    }
                }
            );

            new GraphRequestManager().addRequest(userInfoRequest).start();

        } catch (error) {
            console.log("Login failed with error: ", error);
        }
    };
    const handleRegister = async () => {
        if (!fullName.trim()) {
            Alert.alert("Validation Error", "Enter the full name");
            return;
        }
        if (!email.trim()) {
            Alert.alert("Validation Error", "Email is required");
            return;
        } else if (!validateEmail(email.trim())) {
            Alert.alert("Validation Error", "Enter a valid email");
            return;
        }
        if (!password.trim()) {
            Alert.alert("Validation Error", "Password is required");
            return;
        } else if (!validatePassword(password.trim())) {
            Alert.alert("Validation Error", "Password must be at least 6 characters");
            return;
        }
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        const response = await register(fullName, email, password, phone);
        if (response) {
            setIsLoading(false);
            if (response?.customcode == 200) {
                Alert.alert(
                    "Signup Successful",
                    response?.message ?? "",
                    [
                        { text: "OK", onPress: () => navigation.navigate("Verify", { getEmail: email, isCheckResetPass: false }) }
                    ]
                );
            } else {
                Alert.alert("Alert!", response?.message);
            }

        } else {
            setIsLoading(false);
            Alert.alert("Alert!", "Server error please try again");
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
                    <Text style={styles.title}>Create your account!</Text>
                    <Text style={styles.subtitle}>Start connecting with your loved ones today</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input}
                            placeholder="Enter your name"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input}
                            placeholder="Enter email address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Set Password<Text style={styles.required}>*</Text></Text>
                        <TextInput style={styles.input}
                            placeholder="Enter password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>

                    <View style={styles.dividercontainer}>
                        <View style={styles.dividerline} />
                        <Text style={styles.dividertext}>{'or'}</Text>
                        <View style={styles.dividerline} />
                    </View>

                    <View style={styles.socialBtnscontainer}>
                        <TouchableOpacity style={styles.socialbutton} onPress={googleLogin}>
                            <Image
                                source={require('../assets/Googlelogo.png')}
                                style={styles.imgIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialbutton} onPress={faceBookLogin}>
                            <Image
                                source={require('../assets/fblogo.png')}
                                style={styles.imgIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <Text style={styles.loginText} onPress={() => navigation.navigate("Login")}>Login</Text>
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
});

export default SignupScreen;
