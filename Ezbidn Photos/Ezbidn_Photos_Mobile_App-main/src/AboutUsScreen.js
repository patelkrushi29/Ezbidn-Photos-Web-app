import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AboutUsScreen = () => {
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
                        <Text style={styles.title}>About Us</Text>
                    </View>
                </View>
                {/* Subtitle */}
                <Text style={styles.heading}>Our Vision</Text>
                <Text style={styles.subText} subText></Text>
                <ScrollView contentContainerStyle={styles.subContainer}>
                    <Text style={styles.TitleText}>
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                    </Text>
                    <Image
                        source={require('../assets/aboutUsBanner.png')}
                        style={styles.subImage}
                    />
                    <Text style={styles.TitleText}>
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks.
                    </Text>
                </ScrollView>
                <View style={styles.flexGrow} />
            </View>
        </SafeAreaView>
    );
};

export default AboutUsScreen;

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
    subContainer: {
        alignItems: 'center',
    },
    TitleText: {
        fontSize: 16,
        textAlign: 'left',
        marginBottom: 20,
    },
    subImage: {
        width: '100%',
        height: 160,
        borderRadius: 10,
        marginBottom: 20,
    },
});
