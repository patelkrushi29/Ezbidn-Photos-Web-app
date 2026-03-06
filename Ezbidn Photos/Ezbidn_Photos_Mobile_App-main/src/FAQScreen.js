import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Collapsible from 'react-native-collapsible';

const faqData = [
    { question: 'How Long until the Inmate Receives the Photos?', answer: 'It is a long established fact that a reader will be distracted by the readable content of a page hand when looking at its hkl layout. Lorem Ipsum is simply dummy text of the printing and typesetting industry computing is a model.' },
    { question: "Can I Add Money to the Inmate's Photo Account?", answer: 'It is a long established fact that a reader will be distracted by the readable content of a page hand when looking at its hkl layout. Lorem Ipsum is simply dummy text of the printing and typesetting industry computing is a model.' },
    { question: 'What Size Prints Do You Offer?', answer: 'It is a long established fact that a reader will be distracted by the readable content of a page hand when looking at its hkl layout. Lorem Ipsum is simply dummy text of the printing and typesetting industry computing is a model.' },
    { question: 'Do you Offer Refunds?', answer: 'It is a long established fact that a reader will be distracted by the readable content of a page hand when looking at its hkl layout. Lorem Ipsum is simply dummy text of the printing and typesetting industry computing is a model.' }
];
const FAQScreen = () => {
    const navigation = useNavigation();
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleCollapse = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
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
                        <Text style={styles.title}>FAQ</Text>
                    </View>
                </View>
                {/* Subtitle */}
                <Text style={styles.heading}>Frequently Asked Questions</Text>
                <ScrollView style={styles.scrollContainer}>
                    {faqData.map((item, index) => (
                        <View key={index} style={styles.scrollItemContainer}>
                            <TouchableOpacity
                                style={[styles.scrollHeader, activeIndex === index && styles.scrollActiveHeader]}
                                onPress={() => toggleCollapse(index)}>
                                <Text style={[styles.scrollHeaderText, activeIndex === index && styles.scrollActiveHeaderText]}>{item.question}</Text>
                            </TouchableOpacity>
                            <Collapsible collapsed={activeIndex !== index}>
                                <View style={styles.contentContainer}>
                                    <Text style={styles.contentText}>{item.answer}</Text>
                                </View>
                            </Collapsible>
                        </View>
                    ))}
                    <View style={styles.flexGrow} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default FAQScreen;

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
        fontSize: 18,
        fontWeight: "Reguler",
        marginBottom: 5,
    },
    txtContainer: {
        flex: 1,
        alignItems: 'center',
    },
    subText: {
        fontSize: 14,
        color: "gray",
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        marginTop: 10,
    },
    scrollItemContainer: {
        marginBottom: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    scrollHeader: {
        backgroundColor: 'white',
        padding: 15,
        elevation: 2,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 8,
    },
    scrollActiveHeader: {
        backgroundColor: '#E44D26',

    },
    scrollHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollActiveHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    contentContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    contentText: {
        fontSize: 14,
        color: '#666',
    },
});
