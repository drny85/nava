import { DefaultTheme } from "@react-navigation/native";
import { COLORS } from "../config";


export default {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    backgroud: COLORS.white,
  },
};
