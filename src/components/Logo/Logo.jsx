import React, { Component, useCallback } from "react";
import { Text, View } from "react-native";

import { COLORS } from "../../constants/colors";

function Logo() {
  return (
    <View className="justify-center items-center">
      <View className="relative ">
        <Text
          style={{
            fontFamily: "Inter-Black",
            fontSize: 40,
          }}
        >
          <Text style={{ color: COLORS.black }}>C</Text>
          <Text style={{ color: COLORS.black }}>o</Text>
          <Text style={{ color: COLORS.black }}>l</Text>
          <Text style={{ color: COLORS.black }}>o</Text>
          <Text style={{ color: COLORS.primary }}>Rx</Text>
        </Text>
        <View
          className="absolute -bottom-0 right-0"
          style={{
            height: 6,
            width: 45,
            backgroundColor: COLORS.primary,
          }}
        />
      </View>
    </View>
  );
}

export default Logo;
