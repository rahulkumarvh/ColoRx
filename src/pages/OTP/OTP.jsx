import { Pencil } from "@tamagui/lucide-icons";
import React, { useState, createRef } from "react";
import { TextInput, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, Text, View } from "tamagui";

import Logo from "../../components/Logo/Logo";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { COLORS } from "../../constants/colors";
import { setPhone } from "../../redux/reducers/userReducer";

function OTPInput({ navigation }) {
  const { phone } = useSelector((state) => state.userReducer);

  // Create an array of refs to store references to the text inputs
  const inputRefs = Array.from({ length: 4 }, () => createRef());

  // State to store OTP digits
  const [otp, setOtp] = useState(["", "", "", ""]);

  // Function to focus the next input box
  const focusNextInputBox = (index) => {
    if (index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  // Function to focus the previous input box
  const focusPreviousInputBox = (key, index) => {
    if (key === "Backspace" && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  // Function to handle OTP change
  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text !== "") {
      focusNextInputBox(index);
    }
  };

  // Function to handle OTP submission
  const handleOTPSubmit = () => {
    const otpValue = otp.join("");
    console.log("OTP Entered:", otpValue);
    navigation.replace("WelcomeScreen");
    // Add your OTP validation logic here
  };
  const dispatch = useDispatch();

  function areAllFieldsFilled(otp) {
    for (let i = 0; i < otp.length; i++) {
      if (otp[i] === "") {
        return false;
      }
    }
    return true;
  }
  const isDisabled = !areAllFieldsFilled(otp);

  return (
    <View>
      <View className="px-4">
        <View className="mb-32 mt-20">
          <Logo />
        </View>
        <View style={styles.container}>
          <View style={styles.otpText}>
            <Text className="text-lg" fontFamily="Inter-Regular">
              Enter the OTP sent to your phone
            </Text>
            <Text
              fontFamily="Inter-Regular"
              className="text-lg"
              style={{ color: COLORS.primary }}
              onPress={() => {
                dispatch(setPhone(null));
                navigation.replace("Login");
              }}
            >
              {phone} <Pencil size={10} color={COLORS.primary} />
            </Text>
          </View>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.otpBox}
                onChangeText={(text) => handleOTPChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    focusPreviousInputBox(nativeEvent.key, index);
                  }
                }}
                value={digit}
                maxLength={1}
                keyboardType="number-pad"
                textContentType="oneTimeCode" // For iOS autofill from SMS
              />
            ))}
          </View>
          <Button
            size="$4"
            backgroundColor={isDisabled ? undefined : COLORS.primary}
            fontWeight="bold"
            color={COLORS.white}
            onPress={handleOTPSubmit}
            style={styles.button}
            fontFamily="Inter-Regular"
            disabled={isDisabled}
          >
            Verify OTP
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 20,
  },
  otpText: {
    textAlign: "center",
    marginBottom: 20,
    alignItems: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "80%", // Set width as needed
    marginBottom: 20,
  },
  otpBox: {
    width: "14%", // Adjust width as needed
    borderBottomWidth: 2,
    borderColor: COLORS.primary,
    textAlign: "center",
    fontSize: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default OTPInput;
