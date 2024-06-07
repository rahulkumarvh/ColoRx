// import { Input } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import React, { Component, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, View } from "tamagui";

import Logo from "../../components/Logo/Logo";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { COLORS } from "../../constants/colors";
import { setPhone } from "../../redux/reducers/userReducer";

function Login({ navigation }) {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mobile: "",
    },
  });

  const onSubmit = (data) => {
    const { phone } = data;
    dispatch(setPhone("+1" + phone));
    navigation.navigate("OTP");
  };

  const { phone, isSetupDone } = useSelector((state) => state.userReducer);

  useEffect(() => {
    if (isSetupDone) {
      navigation.replace("Dashboard");
    }
  }, [isSetupDone]);
  if (isSetupDone) {
    return null;
  }
  return (
    <View>
      <View className="mt-10 px-4 flex-col space-between ">
        <View className="mb-32 mt-20">
          <Logo />
        </View>
        <View className="mb-2">
          <View className="mb-1">
            <Controller
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                },
                minLength: 10,
                maxLength: 10,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  size="$4"
                  borderWidth={2}
                  placeholder="Enter Phone number"
                  keyboardType="phone-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  maxLength={10}
                  className={`${errors.phone && "border border-red-500"}`}
                />
              )}
              name="phone"
            />
          </View>
          {errors.phone && (
            <Text className="text-red-500">Enter a valid phone number.</Text>
          )}
        </View>
        <View>
          <Button
            title="Submit"
            onPress={handleSubmit(onSubmit)}
            size="$4"
            backgroundColor={COLORS.primary}
            color={COLORS.white}
            fontWeight="bold"
            fontFamily="Inter-Bold"
          >
            Login
          </Button>
        </View>
      </View>
    </View>
  );
}

export default Login;
