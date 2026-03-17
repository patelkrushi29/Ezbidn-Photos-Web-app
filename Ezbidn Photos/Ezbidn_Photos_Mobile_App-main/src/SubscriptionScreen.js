import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { pricingTierst } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubscriptionScreen = ({ route }) => {
    const navigation = useNavigation();
    const { setIsLoading } = useLoading();
    const [subscriptionList, setInmates] = useState([]);
    const InmateCard = ({ inmate }) => {
        return (
            <TouchableOpacity
                style={[styles.planContainer]}
            >
                <View style={styles.header}>
                    <Text style={styles.price}>${(inmate.price_cents / 100).toFixed(2)}</Text>
                </View>
                <View style={styles.benefitRow}>
                    <Image source={require("../assets/blueTick.png")} style={styles.tickIcon} />
                    <Text style={styles.benefits}>You can Send Up to {inmate.label}</Text>
                </View>
                <View style={styles.buttonRow}>
                    {route.params?.isVisibleBuyNow && (
                        <TouchableOpacity style={[styles.button]} onPress={async () => {
                            try {
                                await AsyncStorage.setItem('planID', String(inmate.id));
                                const savedInmateId = await AsyncStorage.getItem('inmateId');
                                navigation.navigate("ImportPhotos", { inmate, inmateId: savedInmateId });
                            } catch (e) {
                                console.error('Failed to save inmate ID:', e);
                            }
                        }}>
                            <Text style={styles.buttonText}>
                                {"Buy Now"}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.photos}>{inmate.label}</Text>
                </View>
            </TouchableOpacity>
        );
    };
    const getPricingTierstList = async () => {
        console.log("API Call");
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await pricingTierst();
            console.log("API Response");

            setIsLoading(false);
            if (response?.customcode === 200) {
                setInmates(response.data)
            } else {
                Alert.alert("Error!", response?.message);
            }
        } catch (error) {
            setIsLoading(false);
            Alert.alert("Error!", "Server error, please try again.");
        }
    };
    useEffect(() => {
        getPricingTierstList();
    }, []);
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
                        <Text style={styles.title}>Plans</Text>
                    </View>
                </View>

                <FlatList
                    data={subscriptionList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <InmateCard inmate={item} />}
                />

                <View style={styles.flexGrow} />
            </View>
        </SafeAreaView>
    );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: 20,
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
        marginLeft: 10,
    },
    flexGrow: {
        flex: 1,
    },
    txtContainer: {
        flex: 1,
        alignItems: 'center',
    },
    planContainer: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    selectedPlan: {
        backgroundColor: "#E04E26",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    planTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    price: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#444",
    },
    description: {
        marginTop: 10,
        fontSize: 14,
        color: "#444",
    },
    benefitRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    tickIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    benefits: {
        fontSize: 14,
        marginTop: 5,
        color: "#444",
    },
    buttonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 15,
    },
    button: {
        width: 150,
        marginTop: 15,
        backgroundColor: "#E04E26",
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    photos: {
        marginTop: 10,
        textAlign: "right",
        fontWeight: "bold",
        color: "#333",
    },
});