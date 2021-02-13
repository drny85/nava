// @ts-nocheck
import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import Constants from "expo-constants";
import { StatusBar } from 'expo-status-bar';


const Screen = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>

      {children}
      <StatusBar style='auto' />


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
});

export default Screen;
