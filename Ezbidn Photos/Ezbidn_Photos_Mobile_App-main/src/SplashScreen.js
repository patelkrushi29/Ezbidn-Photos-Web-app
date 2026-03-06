import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Storage from "./utils/storage";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(async () => {
      const token = await Storage.getAuthToken();
      console.log('Auth Token:', token);

      if (token) {
        navigation.navigate('MainApp');
      } else {
        navigation.navigate('Welcome');
      }
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/play_store.png")} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 200,
    height: 150,
    resizeMode: "contain",
  },
});

export default SplashScreen;
