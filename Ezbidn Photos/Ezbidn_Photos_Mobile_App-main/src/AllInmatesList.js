import React, { useEffect, useState } from "react";
import { SafeAreaView, Alert, Modal, FlatList, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";
import { inmateList, removeInmate } from "./services/apiService";



const AllInmatesList = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const { setIsLoading } = useLoading();
    const [inmates, setInmates] = useState([]);
    const [inmateID, setInmateID] = useState("");
    const [inmateName, setInmateName] = useState("");

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
            } else {
                setInmates([])
            }
        } catch (error) {
            setIsLoading(false);
            Alert.alert("Error!", "Server error, please try again.");
        }
    };
    useEffect(() => {
        getInmatesList();
    }, []);
    const deleteInmateAPI = async () => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await removeInmate(inmateID);
            setIsLoading(false);
            if (response?.customcode === 200) {
                Alert.alert("Success!", response?.message);
                setTimeout(() => {
                    getInmatesList();
                }, 1000);
            } else {
                Alert.alert("Alert!", response?.message);
                setTimeout(() => {
                    getInmatesList();
                }, 1000);
            }
        } catch (error) {
            setIsLoading(false);
            Alert.alert("Error!", "Server error, please try again.");
        }
    };
    const ConfirmDeleteModal = ({ visible, name, onCancel, onDelete }) => {
        return (
            <Modal
                visible={visible}
                transparent
                animationType="fade"
            >
                <View style={styles.overlay}>
                    <View style={styles.modelContainer}>
                        <Text style={styles.modelTitle}>Confirm Deletion</Text>
                        <Text style={styles.modelMessage}>
                            Are you sure you want to delete <Text style={styles.modelBold}>{name}</Text>? This action cannot be undone.
                        </Text>

                        <View style={styles.modelButtonRow}>
                            <TouchableOpacity style={styles.modelCancelButton} onPress={onCancel}>
                                <Text style={styles.modelCancelText}>CANCEL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modelDeleteButton} onPress={onDelete}>
                                <Text style={styles.modelDeleteText}>DELETE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };
    const InmateCard = ({ inmate }) => {
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
            <TouchableOpacity style={styles.inmateCard}>
                <View style={styles.inmateCardContent}>
                    <View style={styles.inmateInfo}>
                        <Text style={styles.inmateName}>{inmate.nameFirst} {inmate.nameLast}</Text>
                        <Text style={styles.inmateCamp}>{inmate.faclType}</Text>
                        <Text style={styles.inmateRegister}>
                            Register Number: <Text style={styles.inmateRegisterNumber}>{inmate.inmateNum}</Text>
                        </Text>
                        <Text style={styles.inmateRegister}>
                            {dateKey}: <Text style={styles.inmateLocation}>{dateValue}</Text>
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            navigation.navigate("SendPhotos", { inmate, isVisibleBuyNow: false })
                        }}>
                            <Text style={styles.buttonText}>SEND PHOTO</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.removeButton]} onPress={() => {
                            setInmateID(inmate.id)
                            setInmateName(inmate.nameFirst)
                            setModalVisible(true);
                        }}>
                            <Text style={[styles.buttonText, styles.removeText]}>REMOVE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
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
                        <Text style={styles.title}>Send Photos to</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate("Inmate")}>
                    <Text style={styles.submitText}>+ ADD INMATE</Text>
                </TouchableOpacity>
                <Text style={styles.heading}>{inmates.length} Inmate{inmates.length !== 1 ? 's' : ''}</Text>
                <View style={styles.inmateContainer}>
                    <FlatList
                        data={inmates}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <InmateCard inmate={item} />}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                    <View style={styles.flexGrow} />
                </View>
                <ConfirmDeleteModal
                    visible={modalVisible}
                    name={inmateName}
                    onCancel={() => setModalVisible(false)}
                    onDelete={() => {
                        setModalVisible(false);
                        // Perform delete action
                        setTimeout(() => {
                            deleteInmateAPI();
                        }, 1000);
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default AllInmatesList;

const styles = StyleSheet.create({
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
    inmateCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inmateInfo: {
        flex: 1,
    },

    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 8,
        backgroundColor: '#E34E26',
    },

    removeButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#E34E26',
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },

    removeText: {
        color: '#E34E26',
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
        marginBottom: 10,
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
        fontWeight: 'reguler',
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
        backgroundColor: "#E34E26",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginBottom: 20,
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modelContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        elevation: 5,
    },
    modelTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
    },
    modelMessage: {
        fontSize: 15,
        color: '#444',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    modelBold: {
        fontWeight: 'bold',
    },
    modelButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },
    modelCancelButton: {
        borderWidth: 1,
        borderColor: '#d32f2f',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    modelCancelText: {
        color: '#d32f2f',
        fontWeight: '500',
    },
    modelDeleteButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    modelDeleteText: {
        color: 'white',
        fontWeight: '500',
    },
});