import React, { useState } from "react";
import { ScrollView, TextInput, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 60) / 2;
const StateInmateScreen = () => {
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: "Austin", value: "small" },
        { label: "New York", value: "medium" },
        { label: "California", value: "large" },
    ]);
    return (
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

            <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
                {/* Subtitle */}
                <Text style={styles.heading}>Add State, County, City or Juvenile Inmate</Text>
                <Text style={styles.subText}>
                    Use search field to locate a Federal Inmate you like to send photos to Inmate's register number.
                </Text>

                <View style={styles.inputContainer}>
                    {/* Dropdown */}
                    <View style={styles.dropDownViewContainer}>
                        <Text style={styles.dropDownLabel}>
                            Select the State the Inmate is in <Text style={styles.dropDownRequired}>*</Text>
                        </Text>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder="Select state, County, City or Juvenile"
                            containerStyle={{ width: "100%" }}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Search the Facility the Inmate is in<Text style={styles.required}>*</Text></Text>
                    <TextInput style={styles.input} placeholder="Enter Your type" />
                </View>

                <View style={styles.flexGrow} />
            </ScrollView>

            <View style={styles.buttonsContainer}>
                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitText}>Enter Address Manualy →</Text>
                </TouchableOpacity>

                {/* Add New Inmate Button */}
                <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.navigate("InmateDetails")}>
                    <Text style={styles.outlineText}>Use this Address →</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default StateInmateScreen;

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
    dropDownViewContainer: {
        padding: 0,
        marginBottom: 20,
    },
    dropDownLabel: {
        fontSize: 16,
        fontWeight: "400",
        marginBottom: 5,
    },
    dropDownRequired: {
        color: "red",
    },
    dropdown: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
    },
    dropdownContainer: {
        borderColor: "#ccc",
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
        marginBottom: 10,
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
});