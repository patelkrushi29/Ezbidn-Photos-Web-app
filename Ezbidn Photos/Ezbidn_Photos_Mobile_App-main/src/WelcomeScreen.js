import React, { useRef, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: 1,
        image: require('../assets/uploadPhoto.png'),
        title: "Upload Photo",
        description: "Select your favorite photos and upload them with ease.",
    },
    {
        id: 2,
        image: require('../assets/printPhoto.png'),
        title: "Printed & Shipped",
        description: "We print these photo & shipped to your special one.",
    },
    {
        id: 3,
        image: require('../assets/deliveredPhoto.png'),
        title: "Delivered",
        description: "After approved by facility staff, photos will be delivered to your loved one.",
    },
];

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.navigate("MainApp");
        }
    };

    const handleScroll = (event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const renderItem = ({ item }) => (
        <View style={styles.slide}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    onMomentumScrollEnd={handleScroll}
                    style={{ flex: 1 }}
                />

                {/* Pagination */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
                    ))}
                </View>

                {/* Buttons */}
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("MainApp")}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#fff", paddingTop: Platform.OS === 'android' ? 25 : 0, },
    container: { flex: 1, justifyContent: "center", marginBottom: 30 },
    slide: { width, alignItems: "center", padding: 20 },
    image: { width: width * 0.9, height: height * 0.45, borderRadius: 10, marginBottom: 20, marginTop: 10 },
    title: { fontSize: 24, fontWeight: "bold", color: "#1E1E1E", textAlign: "center" },
    description: { fontSize: 16, color: "#666", textAlign: "center", marginVertical: 10 },
    pagination: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ccc", marginHorizontal: 5 },
    activeDot: { backgroundColor: "#E04E26" },
    button: { backgroundColor: "#E04E26", padding: 15, borderRadius: 10, alignItems: "center",marginHorizontal: 20, marginVertical: 10 },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    skipText: { color: "#E04E26", fontSize: 16, marginVertical: 10, textAlign: "center" },
});

export default WelcomeScreen;
