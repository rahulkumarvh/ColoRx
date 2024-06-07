// import DateTimePicker, {
//   DateTimePickerAndroid,
// } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Button, Card, Input, YStack } from "tamagui";

import { COLORS } from "../../constants/colors";

const AddFrequencyScreen = ({ route, navigation }) => {
  const { medicineUserData, setMedicineUserData } = route.params;
  const [show, setShow] = useState(false);
  const [freq, setFreq] = useState(medicineUserData?.frequency?.freq || 0);
  const [selectedDay, setSelectedDay] = useState(
    medicineUserData?.frequency?.repeatMode || "DAY",
  );
  const [date, setDate] = useState(medicineUserData?.frequency?.time || null);

  const onChange = (event, selectedDate) => {
    setShow(false);
    setDate(selectedDate);
  };

  const daysOfWeek = [
    { label: "Day(s)", value: "DAY" },
    { label: "Week(s)", value: "WEEK" },
    { label: "Month(s)", value: "MONTH" },
    { label: "Year(s)", value: "YEAR" },
  ];

  const saveData = () => {
    setMedicineUserData((prevState) => ({
      ...prevState,
      frequency: { freq, repeatMode: selectedDay, time: date },
    }));
  };

  const handleSaveFrequency = () => {
    saveData();
    navigation.goBack();
  };

  const isSaveEnabled = date && freq;

  // useEffect(() => {
  //   if (selectedDay && freq && date) {
  //     let newDate, newTime;

  //     const currentDate = new Date();
  //     const currentTime = currentDate.getTime();
  //     const givenTime = date.getTime();

  //     switch (selectedDay) {
  //       case "DAY": {
  //         if (givenTime < currentTime) {
  //           // If it's in the past, add one day (86400000 milliseconds) to it
  //           newTime = givenTime + 86400000;
  //         } else {
  //           // If it's in the future or the same, use it as it is
  //           newTime = givenTime;
  //         }
  //         newDate = new Date(newTime);
  //         break;
  //       }
  //       case "WEEK": {
  //         break;
  //       }
  //       case "MONTH": {
  //         break;
  //       }
  //       case "YEAR": {
  //         break;
  //       }
  //     }
  //     setDate(newDate);
  //   }
  // }, [selectedDay, freq]);

  // useEffect(() => {
  //   if (date) {
  //     saveData();
  //   }
  // }, [date]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Frequency</Text>
      <Card style={styles.card}>
        <YStack space="$4" padding="$4" alignItems="center">
          <View className="w-full">
            <Text className="mb-2">Repeat Every</Text>
            <Input
              maxLength={2}
              className="mb-2 "
              onChangeText={(text) =>
                setFreq(text.replace(/^(?!\d*[1-9]\d*$).*$/, ""))
              }
              keyboardType="numeric"
              placeholder="Enter number"
              value={freq}
              // style={styles.input}
            />
            <View className="bg-gray-200 rounded-xl">
              <Picker
                selectedValue={selectedDay}
                onValueChange={setSelectedDay}
                // style={styles.picker}
              >
                {daysOfWeek.map(({ label, value }) => (
                  <Picker.Item key={value} label={label} value={value} />
                ))}
              </Picker>
            </View>
          </View>

          {show && (
            <DateTimePicker
              mode="time"
              testID="dateTimePicker"
              value={date}
              onChange={onChange}
            />
          )}
          <Button
            onPress={() => {
              setDate(new Date());
              setShow(true);
            }}
            title="Show date picker!"
            variant="outlined"
            style={[
              styles.button,
              {
                backgroundColor: "transparent",
                color: COLORS.primary,
                border: "1px solid",
                borderColor: COLORS.primary,
              },
            ]}
          >
            {date && format(new Date(date), "h:mmaaaaa'm'")}
            {date ? "(Edit Time)" : "Choose Time"}
          </Button>

          {/* <XStack flexDirection="row" alignItems="center">
            <Picker
              selectedValue={selectedTime}
              onValueChange={setSelectedTime}
              style={[styles.picker, styles.timePicker]}
            >
              {timesOfDay.map((time) => (
                <Picker.Item key={time} label={time} value={time} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedPeriod}
              onValueChange={setSelectedPeriod}
              style={[styles.picker, styles.periodPicker]}
            >
              {periodsOfDay.map((period) => (
                <Picker.Item key={period} label={period} value={period} />
              ))}
            </Picker>
          </XStack> */}
          <Button
            onPress={handleSaveFrequency}
            style={[
              styles.button,
              { backgroundColor: !isSaveEnabled ? "#e7e7e7" : COLORS.primary },
            ]}
            disabled={!isSaveEnabled}
          >
            Save
          </Button>
        </YStack>
      </Card>
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
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "80%",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#f0f0f0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  picker: {
    width: "100%",
    // height: 150,
  },
  timePicker: {
    flex: 2,
    height: 150,
  },
  periodPicker: {
    flex: 2,
    height: 150,
  },
  pickerItem: {
    height: 150, // Increase or decrease the height as needed
  },
  button: {
    color: COLORS.white,
    width: "100%",
    backgroundColor: COLORS.primary, // Use your theme color here
    borderRadius: 6,
  },
});

export default AddFrequencyScreen;
