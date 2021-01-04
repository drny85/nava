import { Dimensions } from "react-native";


const { width, height } = Dimensions.get("screen");

export const COLORS = {
  // colors
  black: "#1E1F20",
  white: "#FFFFFF",
  lightGray: "#ABAFB8",
  light: "rgba(0, 0, 0, 0.12)",
  gray: "#BEC1D2",
  primary: "#6D042A",
  secondary: "#E9E7E8",
  ascent: "#DA6844",
  card: "#bdc3c7",
  tile: "#ecf0f1",
  white: "#f7f7f7",
  text: "#555B5D",
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  navTitle: 25,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  h5: 12,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  navTitle: { fontFamily: "monserrat-thin", fontSize: SIZES.navTitle },
  italic: {fontFamily: 'montserrat-bold-italic', fontSize: SIZES.body3},
  h1: { fontFamily: "montserrat-bold", fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: "montserrat-bold", fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: "montserrat-bold", fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: "montserrat-bold", fontSize: SIZES.h4, lineHeight: 22 },
  h5: { fontFamily: "montserrat-bold", fontSize: SIZES.h5, lineHeight: 22 },
  body1: {
    fontFamily: "montserrat",
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: "montserrat",
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: "montserrat",
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: "montserrat",
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: "montserrat",
    fontSize: SIZES.body5,
    lineHeight: 22,
  },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;


