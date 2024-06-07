import React from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { Button, Text, View, XStack } from "tamagui";

import Logo from "../../components/Logo/Logo";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { COLORS } from "../../constants/colors";
import { setColorBlindness } from "../../redux/reducers/userReducer";

const AccessQuestion = ({ navigation }) => {
  const dispatch = useDispatch();

  const setColorBlindnessDefault = () => {
    dispatch(setColorBlindness("DEFAULT"));
  };

  const handleAccess = (isColorBlind) => {
    if (isColorBlind === true) {
      navigation.navigate("AccessibilityType");
    } else if (isColorBlind === false) {
      setColorBlindnessDefault();
      navigation.navigate("FamilyScreen");
    }
  };
  return (
    <View>
      <View className="mt-2">
        <ProgressBar value={2 / 5} />
      </View>
      <View className="mb-32 mt-20">
        <Logo />
      </View>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.header, { color: COLORS.primary }]}>
            Accessibility
          </Text>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            Do you experience color blindness?
          </Text>
        </View>
        <XStack
          space="$4"
          alignItems="center"
          justifyContent="center"
          style={styles.buttonContainer}
        >
          <Button
            size="$4"
            theme="default"
            style={[styles.button, { backgroundColor: COLORS.primary }]}
            color="white"
            onPress={() => handleAccess(true)}
          >
            Yes
          </Button>
          <Button
            size="$4"
            theme="default"
            style={[styles.button, { backgroundColor: COLORS.primary }]}
            color="white"
            onPress={() => handleAccess(false)}
          >
            No
          </Button>
        </XStack>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around", // Adjust the distribution of space
    backgroundColor: "#fff",
  },
  headerContainer: {
    // If necessary, adjust the space at the top of the screen
    marginTop: 20,
    marginBottom: 0,
  },
  header: {
    fontSize: 28,
    marginBottom: 4,
    fontFamily: "Inter-Bold",
    textAlign: "center", // Center the text horizontally
  },
  questionContainer: {
    // Adjust the space around the question
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontFamily: "Inter-Regular",
    textAlign: "center", // Center the text horizontally
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Distribute buttons evenly
    width: "100%", // Use the full width of the container
    paddingHorizontal: 20, // Add some padding on the sides
  },
  button: {
    fontSize: 16,
    // Specify a fixed height for buttons or make it responsive
    paddingVertical: 10, // Adjust vertical padding for buttons
    paddingHorizontal: 20, // Adjust horizontal padding for buttons
    borderRadius: 6, // Round the corners of the buttons
    // Ensure buttons have a minimum width or are responsive
    minWidth: 120, // Adjust based on your screen size or use a percentage
    height: 50, // Adjust based on your screen size or use a percentage
  },
});

export default AccessQuestion;
