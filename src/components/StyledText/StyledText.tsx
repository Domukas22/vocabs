import { MyColors } from "@/src/constants/MyColors";
import { useFonts } from "expo-font";
import { Text, type TextProps, StyleSheet } from "react-native";

export type ThemedTextProps = TextProps & {
  type?:
    | "text_28_bold"
    | "text_22_bold"
    | "text_18_bold"
    | "text_18_semibold"
    | "text_18_medium"
    | "text_18_regular"
    | "text_18_light"
    | "text_15_bold"
    | "text_15_semibold"
    | "label"
    | "label_small"
    | "vocabTitle";
};

export function Styled_TEXT({
  style,
  type = "text_18_regular",
  ...rest
}: ThemedTextProps) {
  return <Text style={[s.default_COLOR, s[type], style]} {...rest} />;
}

const s = StyleSheet.create({
  default_COLOR: {
    color: MyColors.text_white,
  },
  text_28_bold: {
    fontSize: 28,
    fontFamily: "Nunito-Bold",
  },
  text_22_bold: {
    fontSize: 22,
    fontFamily: "Nunito-Bold",
  },
  text_18_bold: {
    fontSize: 18,
    fontFamily: "Nunito-Bold",
  },
  text_18_semibold: {
    fontSize: 18,
    fontFamily: "Nunito-SemiBold",
  },
  text_18_medium: {
    fontSize: 18,
    fontFamily: "Nunito-Medium",
  },
  text_18_regular: {
    fontSize: 18,
    fontFamily: "Nunito-Regular",
  },
  text_18_light: {
    fontSize: 18,
    fontFamily: "Nunito-Light",
  },
  text_15_bold: {
    fontSize: 15,
    fontFamily: "Nunito-Bold",
  },
  text_15_semibold: {
    fontSize: 15,
    fontFamily: "Nunito-SemiBold",
  },
  label: {
    fontSize: 18,
    fontFamily: "Nunito-Light",
    color: MyColors.text_white_06,
  },
  label_small: {
    fontSize: 16,
    fontFamily: "Nunito-Light",
    color: MyColors.text_white_06,
  },
  vocabTitle: {
    fontSize: 18,
    color: MyColors.text_white,
    fontFamily: "Nunito-Medium",
  },
});
