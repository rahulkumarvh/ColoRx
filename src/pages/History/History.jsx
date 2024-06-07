import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import colors from "tailwindcss/colors";
import { ScrollView, Text } from "tamagui";
import Logo from "../../components/Logo/Logo";
import MedicineCard from "../../components/MedicineCard/MedicineCard";
import { COLORS } from "../../constants/colors";

export default function History({ currentRoute }) {
  const [selectedRx, setSelectedRx] = useState("taken");
  const { medicines, name } = useSelector((state) => state.userReducer);

  const handleRxPress = (rx) => {
    setSelectedRx(rx);
  };
  const scrollViewRef = useRef(); // Reference for the ScrollView

  const takenMedicines = medicines.filter((ele) => ele.lastTaken);

  return (
    <View className="p-4 ">
      <View className="mb-5 mt-10">
        <Logo />
      </View>
      <View className="">
        <Text fontFamily="Inter-Regular" className="text-2xl mb-2">
          Medicine History
        </Text>
      </View>
      <View>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedRx === "taken" && styles.segmentButtonActive,
            ]}
            onPress={() => handleRxPress("taken")}
          >
            <Text
              style={[
                styles.segmentButtonText,
                selectedRx === "taken" && styles.segmentButtonTextActive,
              ]}
              fontFamily="Inter-Regular"
            >
              Taken
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedRx === "missed" && styles.segmentButtonActive,
            ]}
            onPress={() => handleRxPress("missed")}
          >
            <Text
              style={[
                styles.segmentButtonText,
                selectedRx === "missed" && styles.segmentButtonTextActive,
              ]}
              fontFamily="Inter-Regular"
            >
              Missed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {selectedRx === "missed" && (
        <>
          <View className=" justify-center mt-40 items-center ">
            <Text
              className="text-xl opacity-50 text-center"
              fontFamily="Inter-Regular"
            >
              Well done! You've not missed any medicines.
            </Text>
          </View>
        </>
      )}
      {selectedRx === "taken" && (
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
          <View style={styles.calendarContainer}>
            {takenMedicines.length > 0 ? (
              takenMedicines.map((medicine, index) => (
                <MedicineCard
                  key={index}
                  data={medicine}
                  lastTaken={medicine?.lastTaken}
                  route={currentRoute}
                  // onPress={() => handleDatePress(date)}
                />
              ))
            ) : (
              <View className="flex-1 justify-center items-center mt-40">
                <Text
                  className="text-xl opacity-50 text-center"
                  fontFamily="Inter-Regular"
                >
                  {medicines.length === 0
                    ? "You haven't taken any medicines yet."
                    : "Well done! You've taken all your medicines."}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

{
  /* <MedicineCard
                    key={index}
                    data={medicine}
                    // onPress={() => handleDatePress(date)}
                  /> */
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
