import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Device from "expo-device";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { TamaguiProvider } from "tamagui";

import NotificationListener from "./src/components/NotificationListener/NotificationListener";
import { COLORS } from "./src/constants/colors";
import AccessQuestion from "./src/pages/AccessQuestion/AccessQuestion";
import AccessibilityType from "./src/pages/AccessibilityType/AccessibilityType";
import AddDosageNum from "./src/pages/AddMedicine/AddDosageNum";
import AddFrequencyScreen from "./src/pages/AddMedicine/AddFrequencyScreen";
import AddMedicineScreen from "./src/pages/AddMedicine/AddMedicineScreen";
import Dashboard from "./src/pages/Dashboard/Dashboard";
import FamilyScreen from "./src/pages/FamilyScreen/FamilyScreen";
import History from "./src/pages/History/History";
import Login from "./src/pages/Login/Login";
//import WelcomeScreen from "./src/pages/Login/WelcomeScreen";
import OTP from "./src/pages/OTP/OTP";
import Profile from "./src/pages/Profile/Profile";
import WelcomeScreen from "./src/pages/WelcomeScreen/WelcomeScreen";
// eslint-disable-next-line import/namespace
import { persistor, store } from "./src/redux/store";
import config from "./tamagui.config";

// import "@tamagui/core/reset.css";
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "your-project-id",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const Stack = createNativeStackNavigator();

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Black": require("./assets/fonts/Inter-Black.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token),
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AutocompleteDropdownContextProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TamaguiProvider config={config}>
            <SafeAreaProvider>
              <NavigationContainer>
                <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
                  <StatusBar style="auto" />
                  <NotificationListener />
                  <Stack.Navigator
                    initialRouteName="Login"
                    screenOptions={{
                      headerShown: false,
                      contentStyle: {
                        backgroundColor: COLORS.white,
                      },
                    }}
                  >
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="OTP" component={OTP} />
                    <Stack.Screen
                      name="WelcomeScreen"
                      component={WelcomeScreen}
                    />
                    <Stack.Screen
                      name="AccessQuestion"
                      component={AccessQuestion}
                    />
                    <Stack.Screen
                      name="AccessibilityType"
                      component={AccessibilityType}
                    />
                    <Stack.Screen
                      name="FamilyScreen"
                      component={FamilyScreen}
                    />
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                    <Stack.Screen
                      name="AddMedicineScreen"
                      component={AddMedicineScreen}
                    />
                    <Stack.Screen
                      name="AddFrequencyScreen"
                      component={AddFrequencyScreen}
                    />
                    <Stack.Screen
                      name="AddDosageNum"
                      component={AddDosageNum}
                    />
                    <Stack.Screen
                      name="History"
                      children={(props) => (
                        <History {...props} currentRoute={"History"} />
                      )}
                    />
                    <Stack.Screen name="Profile" component={Profile} />
                  </Stack.Navigator>
                </SafeAreaView>
              </NavigationContainer>
            </SafeAreaProvider>
          </TamaguiProvider>
        </PersistGate>
      </Provider>
    </AutocompleteDropdownContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
