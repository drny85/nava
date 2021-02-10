import { DefaultTheme } from "@react-navigation/native";
import { COLORS } from "../config";
import colors from "../config/colors";

export default {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    backgroud: COLORS.white,
  },
};
