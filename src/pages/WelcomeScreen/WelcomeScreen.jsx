import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, StatusBar } from "react-native";
import { useDispatch } from "react-redux";
import { Input, Button, Text, View } from "tamagui";

import Logo from "../../components/Logo/Logo";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { setName } from "../../redux/reducers/userReducer";

const WelcomeScreen = ({ navigation }) => {
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
    const { name } = data;
    dispatch(setName(name));
    navigation.navigate("AccessQuestion");
  };

  return (
    <View>
      <View className="mt-2">
        <ProgressBar value={1 / 5} />
      </View>

      <View className="px-4">
        <View className="mb-32 mt-20">
          <Logo />
        </View>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Text style={styles.text} fontFamily="Inter-Bold">
            Welcome
          </Text>

          <View className="mb-2">
            <View className="mb-1">
              <Controller
                control={control}
                rules={{
                  required: true,
                  minLength: 3,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    borderWidth={2}
                    // style={styles.input}
                    placeholder="Enter Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    size="$4"
                    className={`${errors.phone && "border border-red-500"}`}
                  />
                )}
                name="name"
              />
            </View>
            {errors.name && (
              <Text className="text-red-500">Enter a valid name</Text>
            )}
          </View>

          <Button
            style={styles.button}
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText} fontFamily="Inter-Regular">
              Next
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    // padding: 40,
    paddingTop: 0,
    backgroundColor: "#fff",
  },
  text: {
    color: "#009e73",
    textAlign: "center",
    marginBottom: 30,
    fontSize: 30,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#009e73",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default WelcomeScreen;
