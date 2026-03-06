import React, { useEffect, useState } from "react";
import { SafeAreaView, Alert, Modal, FlatList, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLoading } from "./LoadingContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";
import { getInmateDetailById } from "./services/apiService";


const rulesData = [
    {
        id: "1",
        image: require("../assets/noAdult.png"),
        title: "No Adult Content",
        description: "No penetration, nudity, bikini etc..",
    },
    {
        id: "2",
        image: require("../assets/noShirtless.png"),
        title: "No Shirtless Children",
        description: "No infant nudity.",
    },
    {
        id: "3",
        image: require("../assets/noGang.png"),
        title: "No Gang Sign",
        description: "No emoji, cover-ups, stickers etc",
    },
    {
        id: "4",
        image: require("../assets/noGeneric.png"),
        title: "No Generic Hand Gesture",
        description: "Peace, victory sign, hand loose etc..",
    },
    {
        id: "5",
        image: require("../assets/noPhotos.png"),
        title: "No Photos with Money",
        description: "No money photos, credit cards.",
    },
    {
        id: "6",
        image: require("../assets/noProhibited.png"),
        title: "No Prohibited Substances",
        description: "No prohibited substances accepted.",
    },
];
const ListItem = ({ item }) => (
    <View style={styles.popItem}>
        <Image source={item.image} style={styles.popImage} />
        <View>
            <Text style={styles.popTitle}>{item.title}</Text>
            <Text style={styles.popDescription}>{item.description}</Text>
        </View>
    </View>
);
const SendPhotosScreen = ({ route }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const { inmate: inmateData, isVisibleBuyNow } = route.params;
    const { setIsLoading } = useLoading();
    const profile = isVisibleBuyNow ? inmateData.inamteProfile : inmateData;
    const [inmateDetailsData, setInmateData] = useState(null);
    const [dateValue, setDateValue] = useState("N/A");
    const [dateKey, setDateKey] = useState("Release Date");

    const getInmateProfile = async () => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        try {
            const storedId = await AsyncStorage.getItem('inmateId');
            console.log("storedId:", profile.id)

            const inmateIdToUse = profile.id ? profile.id : storedId;
            const response = await getInmateDetailById(inmateIdToUse);
            setIsLoading(false);
            if (response?.customcode === 200) {
                
                const inmateProfile = response?.data?.inamteProfile;
                console.log("projRelDate", inmateProfile.projRelDate)
                console.log("releaseCode", inmateProfile.releaseCode)
                console.log("actRelDate", inmateProfile.actRelDate)
                if (inmateProfile?.projRelDate) {
                    setDateValue(inmateProfile?.projRelDate)
                } else if (inmateProfile?.actRelDate) {
                    setDateValue(inmateProfile?.actRelDate)
                    if (inmateProfile.releaseCode === 'D') {
                        setDateKey('Deceased')
                    }
                }
                setInmateData(response.data);
            } else {
                Alert.alert("Error!", response?.message);
            }
        } catch (error) {
            setIsLoading(false);
            Alert.alert("Error!", "Server error, please try again.");
        }
    };
    useEffect(() => {
        if (profile.id) {
            getInmateProfile();
        } else {
            getInmateProfile();
        }
    }, [profile.id]);
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
                        <Text style={styles.title}>Send Photos to</Text>
                    </View>
                </View>

                {/* Subtitle */}
                <Text style={styles.heading}>1 Inmate</Text>
                <View style={styles.inmateContainer}>
                    {inmateDetailsData && (
                        <TouchableOpacity style={styles.inmateCard}>
                            <View style={styles.inamteCardContent}>
                                <Text style={styles.inmateName}>{inmateDetailsData.inamteProfile.nameFirst} {inmateDetailsData.inamteProfile.nameLast}</Text>
                                <Text style={styles.inmateName}>
                                    Sex:{" "}
                                    <Text style={styles.inmateRegister}>
                                        {inmateDetailsData.inamteProfile.sex}
                                    </Text>{" "}
                                    &nbsp;&nbsp;&nbsp;&nbsp; { }
                                    Age:{" "}
                                    <Text style={styles.inmateRegister}>
                                        {inmateDetailsData.inamteProfile.age}
                                    </Text>
                                </Text>
                                <Text style={styles.inmateRegister}>
                                    Register Number: <Text style={styles.inmateRegisterNumber}>{inmateDetailsData.inamteProfile.inmateNum}</Text>
                                </Text>
                                <Text style={styles.inmateRegister}>
                                    Location: <Text style={styles.inmateLocation}>{inmateDetailsData.inmateLocation.city} {inmateDetailsData.inmateLocation.state}</Text>
                                </Text>
                                <Text style={styles.inmateRegister}>
                                    {dateKey}: <Text style={styles.inmateLocation}>{dateValue}</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.flexGrow} />
                <TouchableOpacity style={styles.submitButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.submitText}>NEXT →</Text>
                </TouchableOpacity>
                {/* Modal for Popup */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                <Text style={styles.modalTitle}>Facility Rules</Text>
                                <TouchableOpacity style={styles.crossButton} onPress={() => setModalVisible(false)}>
                                    <Image source={require('../assets/blackCross.png')} style={styles.crossImage} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.modalText}>Most of the facilities have the following regulations regarding the photos. Please make sure your photos do not violate the facility regulations.</Text>
                            <FlatList
                                data={rulesData}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => <ListItem item={item} />}
                                contentContainerStyle={styles.popContainer}
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={async () => {
                                    if (!route.params?.isVisibleBuyNow) {
                                        try {
                                            await AsyncStorage.setItem('inmateId', String(inmateData.id));
                                        } catch (e) {
                                            console.error('Failed to save inmate ID:', e);
                                        }
                                    }
                                    setModalVisible(false);
                                    setTimeout(() => {
                                        navigation.navigate("Subscriptions", { isVisibleBuyNow: true });
                                    }, 1000); // 2 seconds delay
                                }}
                            >
                                <Text style={styles.closeButtonText}>I Agree & Continue →</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

export default SendPhotosScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
        marginBottom: 50,
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
        fontSize: 20,
        fontWeight: "reguler",
        marginBottom: 5,
    },
    txtContainer: {
        flex: 1,
        alignItems: 'center',
    },
    inmateContainer: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    listContainer: {
        paddingHorizontal: 5,
    },
    inmateCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        padding: 10,
    },
    inamteCardContent: {
        flex: 1,
    },
    inmateName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    inmateCamp: {
        fontSize: 14,
        color: '#666',
    },
    inmateRegister: {
        fontSize: 14,
        color: '#333',
    },
    inmateLocation: {
        fontSize: 13,
        color: 'black',
        fontWeight: 'reguler',

    },
    inmateRegisterNumber: {
        color: 'red',
        fontWeight: 'bold',
    },
    inamtePhotos: {
        fontSize: 12,
        color: '#999',
    },
    inamteArrowContainer: {
        backgroundColor: '#E04E2F',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        width: 30, // Fixed width for arrow section
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // Ensures full height of the card
    },
    inamteArrow: {
        fontSize: 18,
        color: 'white',
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    submitButton: {
        backgroundColor: "#E34E26", // Orange-red color
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: "#E34E26",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    outlineText: {
        color: "#E34E26",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "left",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalText: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 15,
        textAlign: "left",

    },

    closeButton: {
        backgroundColor: "#e6492d",
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    crossButton: {
        flexDirection: 'row',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: -10,
    },
    crossImage: {
        width: 35,
        height: 35,
    },
    popContainer: {
        padding: 0,
    },
    popItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    popImage: {
        width: 30,
        height: 30,
        marginRight: 15,
        resizeMode: "contain",
    },
    popTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    popDescription: {
        fontSize: 14,
        color: "#777",
        flexShrink: 1,
    },
});
