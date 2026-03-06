import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import CustomHeader from './CustomHeader';
import { useLoading } from "./LoadingContext";
import { checkInternetConnection } from "./NetworkUtils/NetworkUtils";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAllOrders } from './services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const data = [
  {
    id: "1",
    name: "Rocky Smith",
    event: "Action Conservation Camp #11",
    photoCount: "1 Photo (4x5)",
    date: "25 Feb 2025 at 10:46AM",
    imageUrl: "https://via.placeholder.com/150",
  },
];
const OrderItem = ({ inmate }) => {
  const [imageError, setImageError] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <Image
        source={
          imageError || !inmate?.images?.length
            ? require('../assets/userImg.png')
            : { uri: inmate.images[0].image }
        }
        style={styles.image}
        onError={() => setImageError(true)}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{inmate.inmate_nameFirst} {inmate.inmate_nameLast}</Text>
        <Text style={styles.event}>{inmate.inmate_faclName} ({inmate.inmate_faclCode})</Text>
        <Text style={styles.photoCount}>
          {inmate.images.length} {inmate.images.length > 1 ? 'Photos' : 'Photo'}
        </Text>
        <Text style={styles.event}><Text style={styles.bold}>Payment: </Text> {inmate.payment_status.charAt(0).toUpperCase() + inmate.payment_status.slice(1)}</Text>
        <Text style={styles.event}><Text style={styles.bold}>Shipment Status: </Text> {inmate.shipment_status.charAt(0).toUpperCase() + inmate.shipment_status.slice(1)}</Text>
        <Text style={styles.event}><Text style={styles.bold}>Date : </Text> {moment(inmate.created_at).format('MMMM Do YYYY')}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.reorderButton} onPress={async () => {
            navigation.navigate("SendPhotos", { inmate, isVisibleBuyNow: false })
          }}>
            <Text style={styles.buttonText}>Reorder →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailsButton} onPress={async () => {
            navigation.navigate("OrderDetailsView", { orderId: inmate.order_id })
          }}>
            <Text style={styles.detailsText}>View Details →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const OrdersScreen = ({ }) => {
  const { setIsLoading } = useLoading();
  const [ordersList, setOrdersList] = useState([]);
  const navigation = useNavigation();

  const getOrdersList = async () => {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await getAllOrders();
      setIsLoading(false);
      if (response?.customcode === 200) {
        setOrdersList(response.data)
      } else if (response?.customcode === 213) {
        setOrdersList([]);
      } else {
        Alert.alert("Error!", response?.message);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error!", "Server error, please try again.");
    }
  };
  useFocusEffect(
    useCallback(() => {
      getOrdersList();
    }, [])
  );
  return (
    <FlatList
      data={ordersList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <OrderItem inmate={item} />}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  event: {
    fontSize: 14,
    color: "#555",
  },
  bold: {
    fontWeight: 'bold',
  },
  photoCount: {
    fontSize: 14,
    color: "#E04E26",
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  reorderButton: {
    backgroundColor: "#E04E26",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  detailsButton: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderColor: "#E04E26",
    borderWidth: 1,
  },
  detailsText: {
    color: "#E04E26",
    fontWeight: "bold",
  },
});

export default OrdersScreen;
