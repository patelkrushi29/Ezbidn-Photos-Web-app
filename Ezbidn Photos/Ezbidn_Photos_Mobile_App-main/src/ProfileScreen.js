import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import Storage from "./utils/storage";
import { viewProfile } from "./services/apiService";
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";


const ProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userID, setUserID] = useState("");
  const [role, setRole] = useState("");
  const [provider, setProvider] = useState("");
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await Storage.getUserData();
      if (userData) {
        setUserID(userData.id);
      }
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    if (userID) {
      getViewProfile();
    }
  }, [userID]);
  useFocusEffect(
    useCallback(() => {
      getViewProfile();
      return () => {
        console.log('Screen is unfocused');
      };
    }, [])
  );

  const getViewProfile = async () => {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await viewProfile(userID);
      setIsLoading(false);

      if (response?.customcode === 200) {
        setFullName(response?.data?.name);
        setEmail(response?.data?.email);
        setPhone(response?.data?.phone);
        setRole(response?.data?.role);
        setProvider(response?.data?.provider);
      } else {
        Alert.alert("Error!", response?.message);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error!", "Server error, please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.imageWrapper}>
            <Image source={require("../assets/userImg.png")} style={styles.profileImage} />
            <TouchableOpacity style={styles.cameraIconWrapper}>
              <Image source={require("../assets/cameraIcon.png")} style={styles.cameraIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.userName}>{fullName || ""}</Text>
            <View style={styles.premiumBadge}>
              <Image source={require("../assets/premium.png")} style={styles.premiumIcon} />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={fullName || ""} editable={false} />
          <Text style={styles.label}>Email Address</Text>
          <TextInput style={styles.input} value={email || ""} editable={false} />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phone || ""} editable={false} />
        </View>
        {role === "user" && provider === "email" && (
          <>
            <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate("EditProfile")}>
              <Text style={styles.updateButtonText}>Update Profile →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.changePasswordButton} onPress={() => navigation.navigate("ChangePass")}>
              <Text style={styles.changePasswordText}>Change Password →</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    margin: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cameraIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 5,
    elevation: 2,
  },
  cameraIcon: {
    width: 16,
    height: 16,
  },
  infoSection: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53935",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 5,
  },
  premiumIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  premiumText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: "#E04E26",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 50,
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  changePasswordButton: {
    borderWidth: 1,
    borderColor: "#E04E26",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  changePasswordText: {
    color: "#E04E26",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
