import React, { useRef, useEffect, useState } from "react";
import { Linking, Alert, SafeAreaView, KeyboardAvoidingView, ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "react-native-image-picker";
import Storage from "./utils/storage";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";
import { checkoutOrder, uploadImage } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import { pick } from '@react-native-documents/picker';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

const ImportPhotosScreen = ({ route }) => {
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
    ]);
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const { inmate, inmateId: routeInmateId, planId: routePlanId } = route.params;
    const [fullName, setFullName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const { setIsLoading } = useLoading();
    const finalImagesRef = useRef([]);
    const [inmateId, setInmateId] = useState(routeInmateId || "");
    const [customerId, setCustomerId] = useState("");
    const [planId, setPlanId] = useState(routePlanId || "");
    let intArray = [];
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await Storage.getUserData();
            if (userData) {
                setFullName(userData.name);
                setCustomerId(userData.customer_id);
            }
        };
        fetchUserData();
    }, []);
    const selectImage = () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: "photo",
                includeBase64: false,
                selectionLimit: inmate.max_images,
                maxWidth: 800,
                maxHeight: 800,
            },
            async (response) => {
                if (response.didCancel) return;
                if (response.assets) {
                    const newImages = response.assets.map((asset) => asset.uri);
                    finalImagesRef.current = newImages.slice(0, inmate.max_images);
                    setImages([]);
                    setImages((prev) => [...prev, ...finalImagesRef.current]);
                }
            }
        );
    };
    const removeImage = (uri) => {
        const updatedImages = images.filter((image) => image !== uri);
        setImages(updatedImages);
        finalImagesRef.current = finalImagesRef.current.filter((image) => image !== uri);
        if (updatedImages.length === 0) {
            finalImagesRef.current = [];
        }
    };
    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.pickerImage} />
            <TouchableOpacity style={styles.crossButton} onPress={() => removeImage(item)}>
                <Image source={require('../assets/redCross.png')} style={styles.crossImage} />
            </TouchableOpacity>
        </View>
    );
    const imagesUploadAPI = async (image, inmate_id, image_type) => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return { success: false };
        }
        setIsLoading(true);
        const response = await uploadImage(image, inmate_id, image_type);
        setIsLoading(false);
        if (response) {
            if (response?.customcode === 200) {
                const id = response.data.id;
                intArray.push(id);
                return { success: true };
            } else {
                setIsUploading(false);
                setTimeout(() => {
                    Alert.alert("Alert!", response?.message);
                }, 1000);
                console.log("Status code:", response?.customcode);
                return { success: false };
            }
        } else {
            Alert.alert("Alert!", "Server error please try again!");
            return { success: false };
        }
    };

    const handleSubmit = async () => {
        if (finalImagesRef.current.length === 0 || finalImagesRef.current.length < inmate.min_images) {
            Alert.alert("Validation Error", `Please add at least ${inmate.min_images} image before submitting.`);
            return;
        }
        setIsUploading(true);
        let allSuccessful = true;
        for (const uri of finalImagesRef.current) {
            const result = await imagesUploadAPI(uri, inmateId, "local");
            if (!result.success) {
                allSuccessful = false;
                break;
            }
        }
        setIsUploading(false);
        if (allSuccessful) {
            handleCheckOutAPI()
        }
    };
    const handleCheckOutAPI = async () => {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            return;
        }
        setIsLoading(true);
        const response = await checkoutOrder(inmateId, customerId, planId, intArray);
        if (response) {

            if (response?.customcode == 200) {
                const checkourURL = response.data.url;
                console.log('Checkout URL:', checkourURL); // Add this

                // const supported = await Linking.canOpenURL(checkourURL);
                // if (supported) {
                //     Linking.openURL(checkourURL); // opens in default browser
                // } else {
                //     Alert.alert("Error", "Cannot open the Stripe Checkout URL.");
                // }
                setTimeout(() => {
                    setIsLoading(false);
                    navigation.navigate("StripeCheckoutScreen", { checkourURL });
                }, 1000);
                // navigation.navigate("ConfirmInmate");
            } else {
                Alert.alert("Alert!", response?.message);
            }
        } else {
            setIsLoading(false);
            Alert.alert("Alert!", "Server error please try again!");
        }
    };
    const documentPickImage = async () => {
        try {
            const files = await pick({
                type: ['image/*'], // Ensures PNG, JPG, etc. are all selectable
                allowMultiSelection: true,
                mode: 'import', // For iCloud/local file support
            });

            const selectedUris = files.map(file => file.uri);
            finalImagesRef.current = selectedUris.slice(0, inmate.max_images);
            setImages([...finalImagesRef.current]);

        } catch (err) {
            if (err.code === 'DOCUMENT_PICKER_CANCELED') {
                console.log('Picker cancelled');
            } else {
                console.error('Picker Error:', err);
            }
        }
    };
    const loginWithFacebook = async () => {
        try {
          const result = await LoginManager.logInWithPermissions(['public_profile', 'user_photos']);
      
          if (result.isCancelled) {
            console.log('Login cancelled');
            return;
          }
      
          const data = await AccessToken.getCurrentAccessToken();
      
          if (!data) {
            console.log('Failed to get access token');
            return;
          }
      
          const accessToken = data.accessToken.toString();
          fetchUserPhotos(accessToken);
        } catch (error) {
          console.log('Login error', error);
        }
      };
      const fetchUserPhotos = async (accessToken) => {
        try {
          const response = await fetch(
            `https://graph.facebook.com/v18.0/me/photos?fields=album,name,images,created_time&access_token=${accessToken}`
          );
          const json = await response.json();
          console.log('User Photos:', json);
        } catch (error) {
          console.error('Error fetching photos:', error);
        }
      };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Image source={require('../assets/back.png')} style={styles.backIcon} />
                            </TouchableOpacity>
                            <View style={styles.txtContainer}>
                                <Text style={styles.title}>{fullName}</Text>
                            </View>
                        </View>

                        {/* Subtitle */}
                        <Text style={styles.subText}>Import Photos From</Text>
                        <View style={styles.socialContainer}>
                            {/* Upload Button */}
                            <TouchableOpacity style={styles.socialButton} onPress={selectImage}>
                                <Image source={require("../assets/blackUploadIcon.png")} style={styles.socialIcon} />
                                <Text style={styles.socialLabel}>Upload</Text>
                            </TouchableOpacity>

                            {/* Facebook Button */}
                            <TouchableOpacity style={styles.socialButton} onPress={loginWithFacebook}>
                                <Image source={require("../assets/fblogo.png")} style={styles.socialIcon} />
                                <Text style={styles.socialLabel}>Facebook</Text>
                            </TouchableOpacity>

                            {/* Instagram Button */}
                            <TouchableOpacity style={styles.socialButton} onPress={() => console.log("Instagram Clicked")}>
                                <Image source={require("../assets/instaIcon.png")} style={styles.socialIcon} />
                                <Text style={styles.socialLabel}>Instagram</Text>
                            </TouchableOpacity>

                            {/* Google Photos Button */}
                            <TouchableOpacity style={styles.socialButton} onPress={documentPickImage}>
                                <Image source={require("../assets/Googlelogo.png")} style={styles.socialIcon} />
                                <Text style={styles.socialLabel}>Photos</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Dropdown */}
                        {/* <View style={styles.dropDownViewContainer}>
                            <Text style={styles.dropDownLabel}>
                                Photo Size <Text style={styles.dropDownRequired}>*</Text>
                            </Text>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder="Select Photo Size"
                                containerStyle={{ width: "100%" }}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                        </View> */}

                        {/* Image Upload */}
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: "#ddd",
                                borderStyle: "dashed",
                                borderRadius: 10,
                                padding: 50,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            {image ? (
                                <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 10 }} />
                            ) : (
                                <TouchableOpacity onPress={selectImage} style={{ alignItems: "center" }}>
                                    <Image source={require("../assets/redUploadIcon.png")} style={styles.uploadIcon} />
                                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                                        Drag & Drop Photo or <Text style={{ color: "#E55336" }}>Browse</Text>
                                    </Text>
                                    <Text style={{ fontSize: 12, color: "#888" }}>
                                        Photo Formats: JPEG, PNG, HEIC
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{ padding: 10 }}>
                            <Text style={styles.title}>Photo Preview</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                {images.map((item, index) => (
                                    <View key={item + index} style={styles.imageContainer}>
                                        <Image source={{ uri: item }} style={styles.pickerImage} />
                                        <TouchableOpacity style={styles.crossButton} onPress={() => removeImage(item)}>
                                            <Image source={require('../assets/redCross.png')} style={styles.crossImage} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Next Button */}
                        <TouchableOpacity
                            style={[styles.button, isUploading && { opacity: 0.5 }]}
                            onPress={handleSubmit}
                            disabled={isUploading}
                        >
                            <Text style={styles.buttonText}>
                                {isUploading ? "Uploading..." : "Submit →"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ImportPhotosScreen;

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
        fontWeight: "reguler",
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
        fontSize: 16,
        color: "black",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#E55336",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },
    socialButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    socialIcon: {
        width: 50, // Adjust as needed
        height: 50, // Adjust as needed
        marginBottom: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
    },
    socialLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
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
    uploadIcon: {
        width: 36, // Adjust as needed
        height: 32, // Adjust as needed
    },
    textInputContainer: {
        margin: 0,
    },
    textInputLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111",
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: "#333",
        backgroundColor: "#FFF",
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    imageContainer: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 10,
        position: 'relative',
    },
    pickerImage: {
        width: '100%',
        height: '100%',
    },
    addButton: {
        backgroundColor: '#D9531E',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    addText: {
        color: 'white',
        fontWeight: 'bold',
    },
    crossButton: {
        position: 'absolute',
        top: 1,
        right: 1,
        backgroundColor: 'clear',
        borderRadius: 12,
    },
    crossImage: {
        width: 30,
        height: 30,
    },
});
