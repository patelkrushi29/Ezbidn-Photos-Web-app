import React, { useState } from "react";
import { ScrollView, TextInput, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 60) / 2;
const InmateDetailsScreen = () => {
    const navigation = useNavigation();
    const [checked, setChecked] = useState(false);
    const [city, setCity] = useState("Acton");
    const [state, setState] = useState("California");
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={require('../assets/back.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.txtContainer}>
                    <Text style={styles.title}>Inmate</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                {/* Subtitle */}
                <Text style={styles.heading}>Inmate Details</Text>
                <Text style={styles.subText}>
                    Ensure accurate delivery by confirming the inmate’s name, ID number, and facility details before sending.
                </Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name<Text style={styles.required}>*</Text></Text>
                    <TextInput style={styles.input} placeholder="Enter Inmate first name" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name<Text style={styles.required}>*</Text></Text>
                    <TextInput style={styles.input} placeholder="Enter Inmate last name" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Your Relation to the Inmate<Text style={styles.required}>*</Text></Text>
                    <TextInput style={styles.input} placeholder="Enter Your Relation" />
                </View>

                <TouchableOpacity
                    style={styles.checkBoxContainer}
                    onPress={() => setChecked(!checked)}
                    activeOpacity={0.8}
                >
                    <Image
                        source={
                            checked
                                ? require("../assets/unCheckBox.png")
                                : require("../assets/unCheckBox.png")
                        }
                        style={styles.checkbox}
                    />
                    <Text style={styles.checkBoxlabel}>I Confirm the Mailing Address</Text>
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Facility Name<Text style={styles.required}>*</Text></Text>
                    <TextInput style={styles.input} placeholder="Acton Conservation Camp #11" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address Line 1<Text style={styles.required}>*</Text></Text>
                    <TextInput style={styles.input} placeholder="Enter Address Line 1" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address Line 2 (Optional)<Text style={styles.required}>*</Text></Text>
                    <TextInput style={styles.input} placeholder="Enter Address Line 2" />
                </View>
                <View style={styles.cityContainer}>
                    <View style={styles.cityInputWrapper}>
                        <Text style={styles.cityLabel}>
                            City <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.cityInput}
                            value={city}
                            onChangeText={setCity}
                            placeholder="Enter city"
                        />
                    </View>

                    <View style={styles.cityInputWrapper}>
                        <Text style={styles.cityLabel}>
                            State <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.cityInput}
                            value={state}
                            onChangeText={setState}
                            placeholder="Enter state"
                        />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Zip Code<Text style={styles.required}>*</Text></Text>
                    <TextInput style={styles.input} placeholder="Enter Zipcode" />
                </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={[styles.button, styles.outlinedButton]}>
                    <Text style={styles.outlinedText}>Save Inmate →</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.filledButton]} onPress={() => navigation.navigate("PaymentMethod")}>
                    <Text style={styles.filledText}>Next →</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default InmateDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingTop: 50,
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
    checkBoxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
    },
    checkBoxlabel: {
        fontSize: 16,
        marginLeft: 8,
        color: "black",
    },
    cityContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    cityInputWrapper: {
        flex: 1,
        marginRight: 20,
        marginLeft: -10
    },
    cityLabel: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    required: {
        color: "red",
    },
    cityInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: "#f8f8f8",
    },
});
