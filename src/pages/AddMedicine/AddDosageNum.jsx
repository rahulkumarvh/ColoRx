import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Button, Card, YStack } from "tamagui";

import { COLORS } from "../../constants/colors";

const AddDosageNum = ({ route, navigation }) => {
  const { medicineUserData, setMedicineUserData } = route.params;
  const [selectedDosage, setSelectedDosage] = useState(
    medicineUserData?.dosage ? String(medicineUserData?.dosage) : "1",
  );

  const dosageNumbers = Array.from({ length: 10 }, (_, i) =>
    (i + 1).toString(),
  );

  const handleSaveDosage = () => {
    // Logic to save the dosage (selectedDosage)
    setMedicineUserData((prevState) => ({
      ...prevState,
      dosage: Number(selectedDosage),
    }));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Dosage</Text>
      <Card style={styles.card}>
        <YStack space="$4" padding="$4" alignItems="center">
          <Picker
            selectedValue={selectedDosage}
            onValueChange={(itemValue) => setSelectedDosage(itemValue)}
            style={styles.picker}
          >
            {dosageNumbers.map((number) => (
              <Picker.Item key={number} label={number} value={number} />
            ))}
          </Picker>
          <View style={styles.buttonContainer}>
            <Button onPress={handleSaveDosage} style={styles.button}>
              Save
            </Button>
          </View>
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
    borderRadius: 24,
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
    height: 150,
  },
  buttonContainer: {
    // marginTop: 16, // Add space between the picker and the button
  },
  button: {
    color: COLORS.white,
    width: 200,
    backgroundColor: COLORS.primary, // Use your theme color here
    borderRadius: 6,
  },
});

export default AddDosageNum;
