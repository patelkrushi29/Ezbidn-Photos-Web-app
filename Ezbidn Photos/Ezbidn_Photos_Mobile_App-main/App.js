import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from "./src/SplashScreen";
import SignupScreen from "./src/SignupScreen";
import LoginScreen from "./src/LoginScreen";
import ForgotScreen from "./src/ForgotScreen";
import VerifyScreen from "./src/VerifyScreen";
import ResetPassScreen from "./src/ResetPassScreen";
import WelcomeScreen from "./src/WelcomeScreen";
import HomeScreen from "./src/HomeScreen";
import OrdersScreen from "./src/OrdersScreen";
import ProfileScreen from "./src/ProfileScreen";
import CustomHeader from "./src/CustomHeader";
import { Image } from "react-native";
import InmatesScreen from "./src/InmatesScreen";
import AddFederal from "./src/AddFederal";
import SendPhotosScreen from "./src/SendPhotosScreen";
import ImportPhotosScreen from "./src/ImportPhotosScreen";
import ConfirmationInmate from "./src/ConfirmationInmate";
import EditProfile from "./src/EditProfile";
import InmateListScreen from "./src/InmatesListScreen";
import PaymentMethodScreen from "./src/PaymentMethodScreen";
import SideProfileScreen from "./src/SideProfileScreen";
import StateInmateScreen from "./src/StateInmateScreen";
import InmateDetailsScreen from "./src/InmateDetailsScreen";
import AboutUsScreen from "./src/AboutUsScreen";
import SupportCenterScreen from "./src/SupportCenterScreen";
import FAQScreen from "./src/FAQScreen";
import PrivacyPolicyScreen from "./src/PrivacyPolicyScreen";
import RefundScreen from "./src/RefundScreen";
import TermPolicyScreen from "./src/TermPolicyScreen";
import NotificationAlertScreen from "./src/NotificationAlertScreen";
import SubscriptionScreen from "./src/SubscriptionScreen";
import { LoadingProvider } from "./src/LoadingContext";
import LoadingIndicator from "./src/LoadingIndicator";
import ChangePassScreen from "./src/ChangePassScreen";
import AllInmatesList from "./src/AllInmatesList";
import StripeCheckoutScreen from "./src/StripeCheckoutScreen";
import SuccessOrderView from "./src/SuccessOrderView";
import FailedOrderView from "./src/FailedOrderView";
import OrderDetailsView from "./src/OrderDetailsView";
import React, { useEffect, useState } from 'react';
import Storage from "./src/utils/storage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs Navigator
function ScreenWithHeader({ component, navigation }) {
  return (
    <>
      <CustomHeader navigation={navigation} />
      {component}
    </>
  );
}

// Bottom Tab Navigator
function BottomTabNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fetchData = async () => {
    const userData = await Storage.getUserData();
    if (userData) {
      setIsLoggedIn(true);
      getInmatesList();
    } else {
      setIsLoggedIn(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        tabBarIcon: ({ color, size, focused }) => {
          let icon;
          if (route.name === 'Home') {
            icon = focused
              ? require('./assets/home-active.png')
              : require('./assets/home-inactive.png');
          } else if (route.name === 'Orders') {
            icon = focused
              ? require('./assets/orders-active.png')
              : require('./assets/orders-inactive.png');
          } else if (route.name === 'Profile') {
            icon = focused
              ? require('./assets/profile-active.png')
              : require('./assets/profile-inactive.png');
          }
          return <Image source={icon} style={{ width: 25, height: 25 }} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {isLoggedIn && (
        <>
          <Tab.Screen name="Orders" component={OrdersScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}

// Main App Navigation
export default function App() {
  return (
    <LoadingProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }} >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Forgot" component={ForgotScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen name="Reset" component={ResetPassScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Inmate" component={InmatesScreen} />
          <Stack.Screen name="AddFederal" component={AddFederal} />
          <Stack.Screen name="SendPhotos" component={SendPhotosScreen} />
          <Stack.Screen name="ImportPhotos" component={ImportPhotosScreen} />
          <Stack.Screen name="ConfirmInmate" component={ConfirmationInmate} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="InmateList" component={InmateListScreen} />
          <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
          <Stack.Screen name="SideProfile" component={SideProfileScreen} />
          <Stack.Screen name="StateInmate" component={StateInmateScreen} />
          <Stack.Screen name="InmateDetails" component={InmateDetailsScreen} />
          <Stack.Screen name="AboutUs" component={AboutUsScreen} />
          <Stack.Screen name="SupportCenter" component={SupportCenterScreen} />
          <Stack.Screen name="FAQUI" component={FAQScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="RefundView" component={RefundScreen} />
          <Stack.Screen name="TermCondition" component={TermPolicyScreen} />
          <Stack.Screen name="Notifications" component={NotificationAlertScreen} />
          <Stack.Screen name="Subscriptions" component={SubscriptionScreen} />
          <Stack.Screen name="ChangePass" component={ChangePassScreen} />
          <Stack.Screen name="AllInmatesListView" component={AllInmatesList} />
          <Stack.Screen name="StripeCheckoutScreen" component={StripeCheckoutScreen} />
          <Stack.Screen name="SuccessOrderView" component={SuccessOrderView} />
          <Stack.Screen name="FailedOrderView" component={FailedOrderView} />
          <Stack.Screen name="OrderDetailsView" component={OrderDetailsView} />

          {/* After authentication, show the Bottom Tabs */}
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
      <LoadingIndicator />
    </LoadingProvider>
  );
}