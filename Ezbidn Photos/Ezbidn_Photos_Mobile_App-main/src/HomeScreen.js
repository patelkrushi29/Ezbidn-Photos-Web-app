import React, { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Alert, ScrollView, View, Text, FlatList, Image, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { inmateList } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";
import Storage from "./utils/storage";

const { width } = Dimensions.get("window");

const slides = [
    {
        id: 1,
        image: require('../assets/banner-Img.png'),
        title: "Upload Photo",
        description: "Select your favorite photos and upload them with ease.",
    },
    {
        id: 2,
        image: require('../assets/printPhoto.png'),
        title: "Printed & Shipped",
        description: "We print these photo & shipped to your special one.",
    },
    {
        id: 3,
        image: require('../assets/deliveredPhoto.png'),
        title: "Delivered",
        description: "After approved by facility staff, photos will be delivered to your loved one.",
    },
];
const InmateCard = ({ inmate }) => {
    const navigation = useNavigation();
    const projRelDate = inmate?.projRelDate;
    const actRelDate = inmate?.actRelDate;
    const releaseCode = inmate?.releaseCode;
    let dateValue = 'N/A';
    let dateKey = 'Release Date';

    if (projRelDate) {
        dateValue = projRelDate;
    } else if (actRelDate) {
        dateValue = actRelDate;
        if (releaseCode === 'D') {
            dateKey = 'Deceased';
        }
    }
    return (
        <TouchableOpacity style={styles.inmateCard} onPress={() => {
            navigation.navigate("SendPhotos", { inmate, isVisibleBuyNow: false })
        }}>
            <View style={styles.inamteCardContent}>
                <Text style={styles.inmateName}>{inmate.nameFirst} {inmate.nameLast}</Text>
                <Text style={styles.inmateCamp}>{inmate.faclType}</Text>
                <Text style={styles.inmateRegister}>
                    Register Number: <Text style={styles.inmateRegisterNumber}>{inmate.inmateNum}</Text>
                </Text>
                <Text style={styles.inmateRegister}>
                    {dateKey}: <Text style={styles.inamtePhotos}>{dateValue}</Text>
                </Text>
            </View>
            <View style={styles.inamteArrowContainer}>
                <Text style={styles.inamteArrow}>→</Text>
            </View>
        </TouchableOpacity>
    );
};
const ActionButton = ({ imageIcon, title, onPress, imageSource }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Image source={imageIcon} style={styles.iconImage} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Image source={imageSource} style={styles.cardimage} />
        </TouchableOpacity>
    );
};
const HomeScreen = () => {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const { setIsLoading } = useLoading();
    const [inmates, setInmates] = useState([]);

    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const renderItem = ({ item }) => (
        <View style={styles.slide}>
            <Image source={item.image} style={styles.image} />
        </View>
    );
    const getInmatesList = async () => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await inmateList();
            setIsLoading(false);
            if (response?.customcode === 200) {
                setInmates(response.data)
            } else if (response?.customcode === 213) {
                setInmates([]);
            } else {
                Alert.alert("Error!", response?.message);
            }
        } catch (error) {
            setIsLoading(false);
            Alert.alert("Error!", "Server error, please try again.");
        }
    };
    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetchData = async () => {
                const userData = await Storage.getUserData();
                if (userData && isActive) {
                    getInmatesList();
                }
            };
            fetchData();
            return () => {
                isActive = false;
            };
        }, [])
    );
    function handleBackButtonClick() {
        return true;
    }
    function handleBackButtonClick11() {
        return false;
    }
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener(
                'hardwareBackPress',
                handleBackButtonClick11,
            );
        };
    }, []);
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            {/* Carousel */}
            <View style={{ flexGrow: 1 }}>
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    onMomentumScrollEnd={handleScroll}
                />
                {/* Pagination */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
                    ))}
                </View>
            </View>
            <View style={styles.cardcontainer}>
                <ActionButton
                    imageIcon={require("../assets/uploadIcon.png")}
                    title="Send Photos"
                    onPress={() => navigation.navigate("AddFederal")}
                    imageSource={require("../assets/sendPhotos.png")}
                />
                <ActionButton
                    imageIcon={require("../assets/addInmate.png")}
                    title="Add Inmates"
                    onPress={() => navigation.navigate("Inmate")}
                    imageSource={require("../assets/inmatesPhotos.png")}
                />
            </View>
            {inmates.length > 0 && (
                <>
                    <Text style={styles.Inmatetitle}>{'Inmates'}</Text>
                    <View style={styles.inmateContainer}>
                        <FlatList
                            data={inmates}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <InmateCard inmate={item} />}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.listContainer}
                        />
                    </View>
                </>
            )}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", justifyContent: "center" },
    slide: { width, alignItems: "center", padding: 20 },
    image: {
        width: width * 0.9,
        height: 200,
        borderRadius: 20,
        marginBottom: 5,
        marginTop: 0
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 5,
        marginTop: -10,
    },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ccc", marginHorizontal: 5 },
    activeDot: { backgroundColor: "#E04E26" },
    button: { backgroundColor: "#E04E26", padding: 15, borderRadius: 10, alignItems: "center", marginVertical: 10, marginLeft: 10, marginRight: 10 },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    card: {
        width: 160,
        height: 200,
        backgroundColor: "white",
        borderRadius: 15,
        padding: 10,
        alignItems: "flex-start",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FF6B00",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        textAlign: "left",
        marginBottom: 10,
    },
    Inmatetitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        textAlign: "left",
        padding: 10
    },
    cardimage: {
        width: 100,
        height: 80,
        resizeMode: "contain",
        marginHorizontal: 0,
    },
    cardcontainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 20,
    },
    iconImage: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
    inmateContainer: {
        flex: 1,
        paddingVertical: 16,
        backgroundColor: '#f9f9f9',
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    inmateCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        marginRight: 10, // Spacing between cards
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        padding: 15,
        width: 300, // Fixed width for each card
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
});

export default HomeScreen;
