//
//
//

import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { Text, type TextProps, StyleSheet } from "react-native";

export type ThemedTextProps = TextProps & {
  type?:
    | "text_28_bold"
    | "text_22_bold"
    | "text_20_black"
    | "text_20_bold"
    | "text_18_bold"
    | "text_18_semibold"
    | "text_18_medium"
    | "text_18_regular"
    | "text_18_light"
    | "text_15_bold"
    | "text_15_semibold"
    | "text_14_bold"
    | "text_14_semibold"
    | "text_14_medium"
    | "label"
    | "label_small"
    | "text_error"
    | "list_title";
};

export const Styled_TEXT = React.memo(function Styled_TEXT({
  style,
  type = "text_18_regular",
  ...rest
}: ThemedTextProps) {
  return <Text style={[s.default_COLOR, s[type], style]} {...rest} />;
});

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
  text_20_black: {
    fontSize: 20,
    fontFamily: "Nunito-Black",
  },
  text_20_bold: {
    fontSize: 20,
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
  text_14_bold: {
    fontSize: 14,
    fontFamily: "Nunito-Bold",
  },
  text_14_semibold: {
    fontSize: 14,
    fontFamily: "Nunito-SemiBold",
  },
  text_14_medium: {
    fontSize: 14,
    fontFamily: "Nunito-Medium",
  },
  label: {
    fontSize: 18,
    fontFamily: "Nunito-Regular",
    color: MyColors.text_white_06,
  },
  label_small: {
    fontSize: 14,
    fontFamily: "Nunito-Medium",
    color: MyColors.text_white_06,
  },
  text_error: {
    fontSize: 18,
    fontFamily: "Nunito-Regular",
    color: MyColors.text_red,
  },

  list_title: {
    fontSize: 17,
    color: MyColors.text_white,
    fontFamily: "Nunito-Bold",
  },
});
