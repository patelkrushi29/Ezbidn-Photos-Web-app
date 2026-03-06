import React, { useEffect, useState } from "react"
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Storage from "./utils/storage";
import { viewProfile } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";


const menuItems = [
    { icon: require("../assets/inmateProfileIcon.png"), title: "Inmates", subtitle: "View or add your loved once" },
    { icon: require("../assets/subscriptionIcon.png"), title: "Plans", subtitle: "Choose plan according to your need" },
    // { icon: require("../assets/paymentMethodIcon.png"), title: "Payment Method", subtitle: "Different type online payment methods" },
    { icon: require("../assets/aboutUsIcon.png"), title: "About Us", subtitle: "Know more about Ezbidn" },
    { icon: require("../assets/supportIcon.png"), title: "Support Center", subtitle: "For any query, feel free to contact us" },
    { icon: require("../assets/FaqIcon.png"), title: "FAQ", subtitle: "Find quick answers to common questions" },
    { icon: require("../assets/privacyIcon.png"), title: "Privacy Policy", subtitle: "Know about our privacy policy" },
    { icon: require("../assets/refundIcon.png"), title: "Refund Policy", subtitle: "Know about our refund policy" },
    { icon: require("../assets/termIcon.png"), title: "Terms & Conditions", subtitle: "Know about our terms & conditions" },
];
const guestMenuItems = [
    { icon: require("../assets/subscriptionIcon.png"), title: "Plans", subtitle: "Choose plan according to your need" },
    { icon: require("../assets/aboutUsIcon.png"), title: "About Us", subtitle: "Know more about Ezbidn" },
    { icon: require("../assets/FaqIcon.png"), title: "FAQ", subtitle: "Find quick answers to common questions" },
    { icon: require("../assets/privacyIcon.png"), title: "Privacy Policy", subtitle: "Know about our privacy policy" },
    { icon: require("../assets/refundIcon.png"), title: "Refund Policy", subtitle: "Know about our refund policy" },
    { icon: require("../assets/termIcon.png"), title: "Terms & Conditions", subtitle: "Know about our terms & conditions" },
];

const SideProfileScreen = () => {
    const navigation = useNavigation();
    const getScreenName = (index) => {
        const screens = ["AllInmatesListView", "Subscriptions", "AboutUs", "SupportCenter", "FAQUI", "PrivacyPolicy", "RefundView", "TermCondition"];
        return screens[index] || "Inmate";
    };
    const guestGetScreenName = (index) => {
        const screens = ["Subscriptions", "AboutUs", "FAQUI", "PrivacyPolicy", "RefundView", "TermCondition"];
        return screens[index] || "Inmate";
    };
    const [fullName, setFullName] = useState("");
    const [userID, setUserID] = useState("");
    const { setIsLoading } = useLoading();
    const [isVisibleBuyNow] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await Storage.getUserData();
            if (userData) {
                setFullName(userData.name);
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
            } else {
                Alert.alert("Error!", response?.message);
            }
        } catch (error) {
            setIsLoading(false);
            Alert.alert("Error!", "Server error, please try again.");
        }
    };
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
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/play_store.png')}
                            style={styles.logo}
                        />
                    </View>
                    {/* Placeholder for balancing the layout */}
                    <View style={styles.backButton} />
                </View>

                {/* Profile Header */}
                {userID !== "" && (
                    <View style={styles.profileContainer}>
                        {/* Profile Image */}
                        <Image
                            source={require("../assets/userImg.png")}
                            style={styles.profileImage}
                        />
                        {/* User Name and Premium Badge Container */}
                        <View style={styles.textContainer}>
                            <Text style={styles.profileName}>{fullName || ""}</Text>
                            <View style={styles.premiumBadge}>
                                <Image
                                    source={require("../assets/premium.png")}
                                    style={styles.premiumIcon}
                                />
                                <Text style={styles.premiumText}>Premium</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Scrollable Menu */}
                <ScrollView style={styles.menuContainer}>
                    {(userID !== "" ? menuItems : guestMenuItems).map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() =>
                                navigation.navigate(
                                    userID !== "" ? getScreenName(index) : guestGetScreenName(index),
                                    { isVisibleBuyNow: false }
                                )
                            }                        >
                            <Image source={item.icon} style={styles.menuIcon} />
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                            </View>
                            <Image source={require("../assets/rightArrow.png")} style={styles.arrowIcon} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {userID !== "" && (
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => {
                            Storage.clearStorage();
                            navigation.replace("Login");
                        }}
                    >
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    textContainer: {
        marginLeft: 12,
        flexDirection: "column",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        backgroundColor: "#fff",
        marginHorizontal: 10,
        borderRadius: 10,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: "#E74C3C",
    },
    cameraIcon: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#E74C3C",
        padding: 6,
        borderRadius: 15,
    },
    cameraImage: {
        width: 20,
        height: 20,
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        marginLeft: 10,
    },
    premiumBadge: {
        flexDirection: "row",
        backgroundColor: "#E74C3C",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15,
        marginTop: 6,
        alignItems: "center",
        marginLeft: 10,

    },
    premiumIcon: {
        width: 14,
        height: 14,
        marginRight: 5,
    },
    premiumText: {
        color: "#fff",
        fontSize: 12,
    },
    menuContainer: {
        marginHorizontal: 10,
        marginTop: 10,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF5F5",
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 8,
        borderRadius: 10,
    },
    menuIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: "reguler",
        color: "#2C3E50",
    },
    menuSubtitle: {
        fontSize: 12,
        color: "#7F8C8D",
    },
    arrowIcon: {
        width: 20,
        height: 20,
    },
    logoutButton: {
        flexDirection: "row",
        backgroundColor: "#E74C3C",
        padding: 15,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
        marginBottom: 20,
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 8,
    },
    logoutIcon: {
        width: 18,
        height: 18,
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
    logoContainer: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 40,
    },
});

export default SideProfileScreen;
