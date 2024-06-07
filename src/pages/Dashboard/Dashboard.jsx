import { Ionicons } from "@expo/vector-icons"; // Import an icon library
import { History, User } from "@tamagui/lucide-icons";
import { format } from "date-fns";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import colors from "tailwindcss/colors";
import { Text } from "tamagui"; // Import the Tamagui Card component
import MedicineCard from "../../components/MedicineCard/MedicineCard";
import { MedicineReminderModal } from "../../components/MedicineReminderModal/MedicineReminderModal";
import { COLORS } from "../../constants/colors"; // Import the COLORS constant
import { nextTime, prevTime } from "../../helpers";
import { updateMedicineStatusBasedOnTime } from "../../redux/reducers/userReducer";

function Dashboard({ navigation }) {
  const [flag, setFlag] = useState(false);

  // Initialize dates for the calendar
  const startDay = new Date("2023-12-01");
  const endDay = new Date("2023-12-31");

  // Generate an array of date objects for December for both Rx types
  const myRxDates = generateDatesArray(startDay, endDay);
  const familyRxDates = generateDatesArray(startDay, endDay);
  const dispatch = useDispatch();

  // State for the selected Rx tab and events for each Rx type
  const [selectedRx, setSelectedRx] = useState("my-rx");
  const [type, setType] = useState("PENDING");

  const [myRxEvents, setMyRxEvents] = useState({});
  const [familyRxEvents, setFamilyRxEvents] = useState({});
  const { medicines, name, familyMedicines } = useSelector(
    (state) => state.userReducer,
  );
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [medicineData, setMedicineData] = useState(null);

  const scrollViewRef = useRef(); // Reference for the ScrollView

  // Function to generate dates array
  function generateDatesArray(start, end) {
    const datesArray = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      datesArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return datesArray;
  }

  // Function to switch between Rx tabs and scroll to top
  const handleRxPress = (rx) => {
    setSelectedRx(rx);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Function to handle adding a new medication
  const handleAddMedication = () => {
    // Logic to add a new medication
    navigation.navigate("AddMedicineScreen");
  };

  const MINUTE_MS = 60000;

  useEffect(() => {
    const interval = setInterval(() => {
      setFlag((prevState) => !prevState);
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [flag]);

  const medicinesWithNextTime = medicines.map((medicine) => ({
    ...medicine,
    nextTime: nextTime(medicine.frequency),
  }));

  const sortedMedicines = medicinesWithNextTime.sort(
    (a, b) => a.nextTime - b.nextTime,
  );

  function hasCrossedCurrentTime(dateTimeString) {
    // Parse the provided date-time string into a Date object
    const targetDate = new Date(dateTimeString);

    // Get the current date and time
    const currentDate = new Date();

    // Compare the target date with the current date
    return targetDate < currentDate;
  }

  const isWithinTimeWindow = (dateTime) => {
    const targetDate = new Date(dateTime);

    // Get the current date and time
    const currentDate = new Date();
    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(targetDate - currentDate);

    // Check if the time difference is less than or equal to 30 minutes (1800000 milliseconds)
    return timeDifference <= 1800000;
  };

  useEffect(() => {
    for (let i = 0; i < medicines.length; i++) {
      const data = medicines[i];
      if (data.status !== "TAKEN" && !medicineData) {
        if (hasCrossedCurrentTime(nextTime(data.frequency))) {
          if (isWithinTimeWindow(prevTime(data.frequency))) {
            setMedicineData(data);

            Notifications.scheduleNotificationAsync({
              content: {
                color: data.color,
                title: "Reminder",
                body: `Medicine ${data.medicineName} was due few moments back. Tap here to view more details.`,
                vibrate: true,
              },
              trigger: null,
            });
            setShowReminderModal(true);
            setType("MISSED");
            break;
          }
        } else if (isWithinTimeWindow(nextTime(data.frequency))) {
          setShowReminderModal(true);
          setMedicineData(data);

          setType("PENDING");
          Notifications.scheduleNotificationAsync({
            content: {
              color: data.color,
              title: "Reminder",
              body: `Medicine ${data.medicineName} is due now. Tap here to view more details.`,
              vibrate: true,
            },
            trigger: null,
          });
          break;
        }
      }
    }
  }, [medicines]);

  const onConfirmReminder = (medicineName) => {
    setShowReminderModal(false);

    dispatch(
      updateMedicineStatusBasedOnTime({ medicineName, userResponse: "YES" }),
    );
  };
  const onDenyReminder = (medicineName) => {
    dispatch(
      updateMedicineStatusBasedOnTime({ medicineName, userResponse: "NO" }),
    );
    setShowReminderModal(false);
  };
  return (
    <View className="px-3 flex-1">
      {medicineData && (
        <MedicineReminderModal
          visible={showReminderModal}
          medicine={medicineData}
          onConfirm={onConfirmReminder}
          onCancel={onDenyReminder}
          type={type}
        />
      )}
      <View className="mt-5 -mb-4">
        <View className="flex-row justify-between items-center ">
          <Text className="text-xl " fontFamily="Inter-Bold">
            <Text fontFamily="Inter-Regular">Welcome,</Text> {name}
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("History");
              }}
            >
              <History />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Profile");
              }}
            >
              <User />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text className="text-md " fontFamily="Inter-Bold">
            <Text fontFamily="Inter-Regular">
              Today is {format(new Date(), "MMMM d")}
            </Text>{" "}
          </Text>
        </View>
      </View>
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedRx === "my-rx" && styles.segmentButtonActive,
          ]}
          onPress={() => handleRxPress("my-rx")}
        >
          <Text
            style={[
              styles.segmentButtonText,
              selectedRx === "my-rx" && styles.segmentButtonTextActive,
            ]}
            fontFamily="Inter-Regular"
          >
            My
            <Text
              fontFamily="Inter-Black"
              style={[selectedRx === "my-rx" && styles.segmentButtonTextActive]}
            >
              Rx
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedRx === "family-rx" && styles.segmentButtonActive,
          ]}
          onPress={() => handleRxPress("family-rx")}
        >
          <Text
            style={[
              styles.segmentButtonText,
              selectedRx === "family-rx" && styles.segmentButtonTextActive,
            ]}
            fontFamily="Inter-Regular"
          >
            Family
            <Text
              fontFamily="Inter-Black"
              style={[
                selectedRx === "family-rx" && styles.segmentButtonTextActive,
              ]}
            >
              Rx
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
      <View
        className={`${
          (medicines.length === 0 || selectedRx === "family-rx") && "flex-1"
        }`}
      >
        {selectedRx === "family-rx" ? (
          <View className="flex-1  justify-center items-center -mt-20">
            <Text className="text-xl opacity-50" fontFamily="Inter-Regular">
              No medicine data available yet
            </Text>
          </View>
        ) : (
          medicines.length === 0 && (
            <View className="flex-1 justify-center items-center -mt-20">
              <Text className="text-xl opacity-50" fontFamily="Inter-Regular">
                Tap + to add a new medication
              </Text>
            </View>
          )
        )}
      </View>
      {selectedRx !== "family-rx" && medicines.length !== 0 && (
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
          <View style={styles.calendarContainer}>
            {sortedMedicines.filter(
              (ele) =>
                new Date() < nextTime(ele?.frequency) &&
                ele.status === "PENDING",
            ).length > 0 ? (
              sortedMedicines
                .filter(
                  (ele) =>
                    new Date() < nextTime(ele?.frequency) &&
                    ele.status === "PENDING",
                )
                .map((medicine, index) => (
                  <MedicineCard
                    key={index}
                    data={medicine}
                    // onPress={() => handleDatePress(date)}
                  />
                ))
            ) : (
              <View className="flex-1 justify-center items-center mt-48">
                <Text
                  className="text-xl opacity-50 text-center"
                  fontFamily="Inter-Regular"
                >
                  Well done! You've taken all your medications.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
      {selectedRx !== "family-rx" && (
        <TouchableOpacity
          style={[styles.plusButton, { backgroundColor: COLORS.primary }]}
          onPress={handleAddMedication}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    flexDirection: "column",
    paddingBottom: 40,
    gap: 10,
  },
  dateBox: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  segmentButtonTextActive: { color: COLORS.white },
  dateText: {
    fontSize: 18,
  },
  plusButton: {
    position: "absolute",
    bottom: 18,
    right: 18,
    borderRadius: 50,
    padding: 10,
  },
  segmentedControl: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray[200],
    marginTop: 32,
    padding: 6,
    marginBottom: 20,
    borderRadius: 100,
  },
  segmentButton: {
    paddingVertical: 10,
    flex: 1,
    alignItems: "center",
  },
  segmentButtonActive: {
    borderBottomColor: COLORS.primary,
    color: COLORS.white,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
  },
  segmentButtonText: {
    fontSize: 16,
  },
});

export default Dashboard;
