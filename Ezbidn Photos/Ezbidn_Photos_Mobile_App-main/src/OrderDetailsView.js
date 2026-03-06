import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, Modal, ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";
import { getOrderDetailsById } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import StepIndicator from 'react-native-step-indicator';

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 60) / 2;
const labels = ["Processing", "Shipped", "Completed"];
const currentPosition = 1;

const OrderDetailsView = ({ route }) => {
    const navigation = useNavigation();
    const { orderId } = route.params;
    const { setIsLoading } = useLoading();
    const [orderDetailsData, setOrderDetailsData] = useState(null);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };
    const getOrderDetailsAPI = async () => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await getOrderDetailsById(orderId);
            console.log("COdeeee:", response?.customcode)
            setIsLoading(false);
            if (response?.customcode === 200) {
                setOrderDetailsData(response.data);
            } else {
                Alert.alert("Error!", response?.message);
            }
        } catch (error) {
            setIsLoading(false);
            console.log("errorerror:", error)

            Alert.alert("Error!", "Server error, please try again.");
        }
    };
    useEffect(() => {
        getOrderDetailsAPI();
    }, []);
    const renderStepIndicator = ({ position, stepStatus }) => {
        if (position <= currentPosition) {
            return (
                <Image
                    source={require('../assets/white_check.png')}
                    style={{ width: 14, height: 14, tintColor: 'white' }}
                    resizeMode="contain"
                />
            );
        }
        return null;
    };
    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 25,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: '#4CAF50',
        stepStrokeWidth: 2,
        stepStrokeFinishedColor: '#4CAF50',
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: '#4CAF50',
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: '#4CAF50',
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#4CAF50',
        stepIndicatorLabelFontSize: 1,
        currentStepIndicatorLabelFontSize: 1,
        labelColor: '#999999',
        labelSize: 13,
        currentStepLabelColor: '#4CAF50',
        labelAlign: 'center',
    };
    const statusToStepIndex = {
        processing: 0,
        shipped: 1,
        completed: 2,
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
                        <Text style={styles.title}>Order Details</Text>
                    </View>
                </View>
                {orderDetailsData && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                        <Text style={styles.sectionTitle}>Order Details - #{orderId}</Text>

                        {/* User Info Section */}
                        <View style={styles.userInfoContainer}>
                            <Text style={styles.sectionTitle}>User Info</Text>
                            <Text style={styles.label}><Text style={styles.bold}>Name:</Text> {orderDetailsData.user_name}</Text>
                            <Text style={styles.label}><Text style={styles.bold}>Email:</Text> {orderDetailsData.user_email}</Text>
                            <Text style={styles.label}><Text style={styles.bold}>Type:</Text> {orderDetailsData.user_role}</Text>
                        </View>

                        {/* Inmate Info Section */}
                        <View style={styles.userInfoContainer}>
                            <Text style={styles.sectionTitle}>Inmate Info</Text>
                            <Text style={styles.label}><Text style={styles.bold}>Name:</Text> {orderDetailsData.inmate_nameFirst} {orderDetailsData.inmate_nameLast}</Text>
                            <Text style={styles.label}><Text style={styles.bold}>Location:</Text> {orderDetailsData.inmate_faclName} ({orderDetailsData.inmate_faclCode})</Text>
                            <Text style={styles.label}><Text style={styles.bold}>Register Number:</Text> {orderDetailsData.inmate_inmateNum}</Text>
                        </View>

                        {/* Order Info Section */}
                        <View style={styles.userInfoContainer}>
                            <Text style={styles.sectionTitle}>Order Info</Text>
                            <Text style={styles.label}><Text style={styles.bold}>Amount:</Text> ${(orderDetailsData.amount_total / 100).toFixed(2)}</Text>
                            <Text style={styles.label}><Text style={styles.bold}>Payment Status:</Text> {orderDetailsData.payment_status.charAt(0).toUpperCase() + orderDetailsData.payment_status.slice(1)}</Text>
                            <Text style={styles.label}><Text style={styles.bold}>Transaction ID:</Text> {orderDetailsData.transaction_id}</Text>
                            <Text style={styles.label}><Text style={styles.bold}>Date:</Text> {formatDate(orderDetailsData.created_at)}</Text>
                            <Text style={styles.label}><Text style={styles.bold}>Order Status:</Text></Text>

                        </View>
                        <View style={styles.stepIndicatorContainer}>
                            <StepIndicator
                                customStyles={customStyles}
                                currentPosition={statusToStepIndex[orderDetailsData.shipment_status?.toLowerCase()] ?? 0}
                                labels={labels}
                                stepCount={labels.length}
                                renderStepIndicator={renderStepIndicator}
                            />
                        </View>
                        {/* Images Section */}
                        {orderDetailsData?.images?.length > 0 && (
                            <View style={styles.imageSection}>
                                <Text style={styles.sectionTitle}>Images</Text>
                                <View style={styles.imageGrid}>
                                    {orderDetailsData.images.map((item) => (
                                        <View key={item.id} style={styles.imageCard}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={styles.image}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                        <View style={styles.flexGrow} />
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};

export default OrderDetailsView;

const styles = StyleSheet.create({
    stepIndicatorContainer: {
        marginTop: 5,
    },
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
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
    userInfoContainer: {
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    bold: {
        fontWeight: 'bold',
    },
    imageSection: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageCard: {
        width: '48%',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    image: {
        width: '100%',
        height: 120,
    },
    imageLabel: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
    },
});