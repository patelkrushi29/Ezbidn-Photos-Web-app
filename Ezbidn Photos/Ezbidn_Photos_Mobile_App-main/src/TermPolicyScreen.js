import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TermPolicyScreen = () => {
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
                        <Text style={styles.title}>Terms & Conditions</Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <Text style={styles.heading}>Basic Terms</Text>
                    <Text style={styles.text}>
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks.
                    </Text>

                    <Text style={styles.subHeading}>1. Our Services</Text>
                    <Text style={styles.text}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </Text>

                    <Text style={styles.text}>
                        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s.
                    </Text>

                    <Text style={styles.text}>
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                    </Text>

                </ScrollView>
                <View style={styles.flexGrow} />
            </View>
        </SafeAreaView>
    );
};

export default TermPolicyScreen;

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
    scrollContainer: {
        paddingBottom: 20,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 16,
    },
});