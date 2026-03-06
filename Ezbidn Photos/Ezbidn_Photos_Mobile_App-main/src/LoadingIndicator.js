import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { useLoading } from "./LoadingContext";
const LoadingIndicator = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <Modal transparent animationType="fade" visible={isLoading}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default LoadingIndicator;
