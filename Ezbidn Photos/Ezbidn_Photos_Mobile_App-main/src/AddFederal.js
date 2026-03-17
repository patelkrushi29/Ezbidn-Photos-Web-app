import React, { useEffect, useState } from "react";
import { SafeAreaView, Alert, TextInput, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { findFederalInmate } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import NetInfo from "@react-native-community/netinfo";
import { saveInmate } from "./services/apiService";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 60) / 2;
const AddFederal = () => {
    const navigation = useNavigation();
    const [inmateId, setInmateId] = useState("");
    const { setIsLoading } = useLoading();
    const [inmate, setInmateData] = useState(null);

    const saveInmateAPI = async (nameFirst, nameMiddle, nameLast, sex, race, age,
        inmateNum,
        faclCode,
        faclName,
        faclType,
        faclURL,
        releaseCode,
        projRelDate,
        actRelDate
    ) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        const response = await saveInmate(nameFirst,
            nameMiddle,
            nameLast,
            sex,
            race,
            age,
            inmateNum,
            faclCode,
            faclName,
            faclType,
            faclURL,
            releaseCode,
            projRelDate,
            actRelDate,);
        if (response) {
            setIsLoading(false);
            if (response?.customcode == 200) {
                navigation.navigate("SendPhotos", { inmate, isVisibleBuyNow: true, inmateId: String(response.data.id) })
            } else if (response?.customcode == 207) {
                navigation.navigate("SendPhotos", { inmate, isVisibleBuyNow: true, inmateId: String(response.data.id) })
            } else if (response?.customcode == 401) {
                Alert.alert(
                    "Alert!",
                    "For saving the inmate information, you have to log in to the app!",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("Login")
                        }
                    ],
                    { cancelable: true }
                );
            } else {
                setIsLoading(false);
                setModalVisible(false);
                Alert.alert("Alert", response?.message);
            }
        } else {
            setIsLoading(false);
            Alert.alert("Alert!", "Server error please try again!");
        }
    };
    const getInmateIdProfile = async () => {
        if (!inmateId) {
            Alert.alert("Validation Error", "Enter the 8 digit register number");
            return;
        }
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await findFederalInmate(inmateId);
            setIsLoading(false);
            if (response?.customcode === 200) {
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
        if (inmateId.trim() === '') {
            setInmateData(null);
        }
    }, [inmateId]);
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
                        <Text style={styles.title}>Inmates</Text>
                    </View>
                </View>

                {/* Subtitle */}
                <Text style={styles.heading}>Add Federal Inmate</Text>
                <Text style={styles.subText}>
                    Use search field to locate a Federal Inmate you like to send photos to Inmate's register number.
                </Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                        Inmate 8 Digit Registered Number
                        <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={inmateId || ""}
                        onChangeText={setInmateId}
                        placeholder="Enter Inmate ID or Registered Number"
                    />
                </View>
                {inmate && (
                    <View style={styles.inmateContainer}>
                        <TouchableOpacity style={styles.inmateCard}>
                            <View style={styles.inmateCardContainer}>
                                <View style={styles.avatarContainer}>
                                    <View style={styles.avatarCircle}>
                                        <Text style={styles.avatarText}>
                                            {inmate.inamteProfile.nameFirst?.charAt(0)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.inamteCardContent}>
                                    <Text style={styles.inmateName}>
                                        {inmate.inamteProfile.nameFirst} {inmate.inamteProfile.nameMiddle} {inmate.inamteProfile.nameLast}
                                    </Text>
                                    <Text style={styles.inmateRegister}>
                                        Inmate Number:{" "}
                                        <Text style={styles.inmateRegisterNumber}>
                                            {inmate.inamteProfile.inmateNum}
                                        </Text>
                                    </Text>
                                    <Text style={styles.inmateRegister}>
                                        Sex:{" "}
                                        <Text style={styles.inmateRegisterNumber}>
                                            {inmate.inamteProfile.sex}
                                        </Text>{" "}
                                        &nbsp;&nbsp;&nbsp;&nbsp; { }
                                        Age:{" "}
                                        <Text style={styles.inmateRegisterNumber}>
                                            {inmate.inamteProfile.age}
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.flexGrow} />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={[styles.button, styles.outlinedButton]} onPress={getInmateIdProfile}>
                        <Text style={styles.outlinedText}>Search Inmate →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.filledButton, !inmate && styles.disabledButton]}
                        disabled={!inmate}
                        onPress={() => {
                            saveInmateAPI(inmate.inamteProfile.nameFirst,
                                inmate.inamteProfile.nameMiddle,
                                inmate.inamteProfile.nameLast,
                                inmate.inamteProfile.sex,
                                inmate.inamteProfile.race,
                                inmate.inamteProfile.age,
                                inmate.inamteProfile.inmateNum,
                                inmate.inamteProfile.faclCode,
                                inmate.inamteProfile.faclName,
                                inmate.inamteProfile.faclType,
                                inmate.inamteProfile.faclURL,
                                inmate.inamteProfile.releaseCode,
                                inmate.inamteProfile.projRelDate,
                                inmate.inamteProfile.actRelDate,
                            )
                        }}
                    >
                        <Text style={styles.filledText}>Save & Next →</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AddFederal;

const styles = StyleSheet.create({
    disabledButton: {
        backgroundColor: '#cccccc'
    },
    inmateCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 10,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
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
        fontWeight: 'bold',
    },
    inmateRegisterNumber: {
        color: 'black',
        fontWeight: 'reguler',

    },
    inamtePhotos: {
        fontSize: 12,
        color: '#999',
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
    inmateContainer: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
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
        fontWeight: "bold",
        marginBottom: 5,
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
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10, // Space between buttons
        padding: 20,
        marginBottom: 30,
    },
    button: {
        width: buttonWidth, // Equal width for both buttons
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
    },
    outlinedButton: {
        borderWidth: 1,
        borderColor: "#E44D26",
        backgroundColor: "transparent",
    },
    outlinedText: {
        color: "#E44D26",
        fontSize: 16,
        fontWeight: "bold",
    },
    filledButton: {
        backgroundColor: "#E44D26",
    },
    filledText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
