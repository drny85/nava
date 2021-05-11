import React, { useState } from "react";
import { View } from "react-native";
import LottieView from 'lottie-react-native'
import { COLORS } from "../config";
import Screen from "./Screen";

const Spinner = () => {
  return (
    <Screen style={{ backgroundColor: "transparent" }}>
      <LottieView
        loop={true}
        autoPlay
        colorFilters={[{ keypath: "Sending Loader", color: COLORS.secondary }]}
        // onAnimationFinish={() => setIsVisible(false)}
        source={require("../assets/animations/spiner.json")}
      />
    </Screen>
  );
};

export default Spinner;
