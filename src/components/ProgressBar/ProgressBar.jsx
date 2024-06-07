import React from "react";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";

import { COLORS } from "../../constants/colors";

export default function ProgressBar({ value }) {
  return (
    <View>
      <Progress.Bar
        progress={value}
        width={null}
        height={4}
        borderWidth={0}
        color={COLORS.primary}
      />
    </View>
  );
}
