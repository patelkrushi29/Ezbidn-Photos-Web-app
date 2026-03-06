import React, { useState } from "react";
import { SafeAreaView, SectionList, View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";


const notificationsArr = [
    {
        title: "Today",
        data: [
            {
                id: "1",
                sender: "Rebel",
                message: "Your 1 Photo to Rocky Smith has been Successfully Submitted.",
                time: "Today at 9:42 PM",
            },
            {
                id: "2",
                message: "New Inmate Rocky Smith has been Successfully Added.",
                time: "Today at 8:16 PM",
            },
        ],
    },
    {
        title: "Last Week",
        data: [
            {
                id: "3",
                sender: "Rebel",
                message: "The Photo You Sent has been Successfully Delivered to David Brown.",
                time: "Last Week",
            },
        ],
    },
];
const NotificationItem = ({ sender, message, time }) => (
    <View style={styles.notificationItem}>
        <Text style={styles.message}>
            {sender && <Text style={styles.sender}>{sender} </Text>}
            {message}
        </Text>
        <Text style={styles.time}>{time}</Text>
    </View>
);

const NotificationAlertScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1 , backgroundColor: "#fff"}}>
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
                        <Text style={styles.title}>Notifications</Text>
                    </View>
                </View>
                <SectionList
                    sections={notificationsArr}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <NotificationItem sender={item.sender} message={item.message} time={item.time} />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                    showsVerticalScrollIndicator={false}
                />
                <View style={styles.flexGrow} />
            </View>
        </SafeAreaView>
    );
};

export default NotificationAlertScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
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
    txtContainer: {
        flex: 1,
        alignItems: 'center',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
    },
    notificationItem: {
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    message: {
        fontSize: 14,
        color: "#333",
    },
    sender: {
        fontWeight: "bold",
    },
    time: {
        fontSize: 12,
        color: "#888",
        marginTop: 4,
    },
});