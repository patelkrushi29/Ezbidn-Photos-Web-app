import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const inmates = [
    {
        id: "1",
        name: "Richard Smith",
        camp: "Acton Conservation Camp #11",
        registerNumber: "87528440",
        photosSent: 0,
    },
    {
        id: "2",
        name: "Rocky Smith",
        camp: "Acton Conservation Camp #11",
        registerNumber: "52648703",
        photosSent: 1,
    },
];

const InmateListScreen = () => {
        const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <View style={styles.backcontainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={require('../assets/back.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <View style={styles.txtContainer}>
                    <Text style={styles.mainTitle}>Inmates</Text>
                </View>
                {/* Placeholder for balancing the layout */}
                <View style={styles.backButton} />
            </View>
            <FlatList
                data={inmates}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.details}>{item.camp}</Text>
                            <Text style={styles.details}>
                                Register Number: <Text style={styles.registerNumber}>{item.registerNumber}</Text>
                            </Text>
                            <Text style={[styles.photosSent, item.photosSent > 0 ? styles.photosAvailable : styles.photosNone]}>
                                {item.photosSent > 0 ? `${item.photosSent} Photos Send` : "No Photos Send"}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.arrowButton}>
                            <Text style={styles.arrow}>➜</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("PaymentMethod")}>
                <Text style={styles.addButtonText}>Add New Inmate ➜</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    card: {
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        marginHorizontal: 15,
        marginVertical: 7,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    cardContent: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 3,
    },
    details: {
        fontSize: 14,
        color: "#666",
    },
    registerNumber: {
        fontWeight: "bold",
        color: "#E53935",
    },
    photosSent: {
        fontSize: 14,
        marginTop: 3,
    },
    photosAvailable: {
        color: "#E53935",
        fontWeight: "bold",
    },
    photosNone: {
        color: "#888",
    },
    arrowButton: {
        backgroundColor: "#E04E26",
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    arrow: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    addButton: {
        backgroundColor: "#E04E26",
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        margin: 15,
        borderRadius: 5,
        position: "absolute",
        bottom: 20,
        left: 15,
        right: 15,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
        marginTop: 20,
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
});

export default InmateListScreen;
