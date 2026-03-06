import React, { useState } from "react";
import { Alert, SafeAreaView, FlatList, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const inmateOptions = [
    {
        id: "federal",
        label: "Federal Inmate",
        image: require("../assets/inmatesImg.png"),
    },
    {
        id: "state",
        label: "State, County, City or Juvenile Inmate",
        image: require("../assets/inmatesImg.png"),
    },
];
const InmatesScreen = () => {
    const [selected, setSelected] = useState("federal");
    const [isEnabled, setIsEnabled] = useState(true);
    const navigation = useNavigation();
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
                <Text style={styles.heading}>Add Inmate</Text>
                <Text style={styles.subText}>What type of inmate you trying to add?</Text>

                <View style={styles.listContainer}>
                    <FlatList
                        data={inmateOptions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const isSelected = item.id === selected;
                            setIsEnabled(isSelected);
                            return (
                                <TouchableOpacity
                                    style={[styles.listOption, isSelected && styles.listSelectedOption]}
                                    onPress={() => setSelected(item.id)}
                                >
                                    <View style={styles.radioContainer}>
                                        <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                            {isSelected && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={[styles.label, isSelected && styles.selectedLabel]}>
                                            {item.label}
                                        </Text>
                                    </View>
                                    <Image source={item.image} style={styles.selectImage} />
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                <View style={styles.flexGrow} />

                {/* Next Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        if (isEnabled) {
                            Alert.alert(
                                "Alert!",
                                "Coming Soon!",
                                [
                                    { text: "OK",  }
                                ]
                            );
                        } else {
                            navigation.navigate("AddFederal");  // onPress: () => navigation.navigate("StateInmate")
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Next →</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default InmatesScreen;

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
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 15,
    },
    selectedCard: {
        backgroundColor: "#1E293B",
        borderColor: "#1E293B",
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#E55336",
        marginRight: 10,
    },
    radioSelected: {
        backgroundColor: "#E55336",
    },
    cardText: {
        fontSize: 16,
        fontWeight: "500",
        color: "black",
    },
    selectedText: {
        color: "white",
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    button: {
        backgroundColor: "#E55336",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 30,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    listContainer: {
        padding: 5,

    },
    listOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    listSelectedOption: {
        backgroundColor: "#1E293B",
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#E53E3E",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    radioOuterSelected: {
        borderColor: "#fff",
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#E53E3E",
    },
    label: {
        fontSize: 16,
        color: "#000",
        fontWeight: "600",
        flexShrink: 1,
        width: 200
    },
    selectedLabel: {
        color: "#fff",
    },
    selectImage: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
});
