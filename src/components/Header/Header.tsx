//
//
//

import React from "react";
import { StyleSheet, View } from "react-native";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";

interface _header {
  big?: boolean;
  title?: string;
  btnLeft?: React.ReactNode;
  btnRight?: React.ReactNode;
}

export default function Header({
  big = false,
  title = "A nice title",
  btnLeft,
  btnRight,
}: _header) {
  return (
    <View style={s.header}>
      {btnLeft && btnLeft}
      {big && (
        <Styled_TEXT type="text_22_bold" style={{ flex: 1 }}>
          {title}
        </Styled_TEXT>
      )}
      {!big && (
        <Styled_TEXT
          type="text_18_semibold"
          style={{ flex: 1, textAlign: "center" }}
        >
          {title}
        </Styled_TEXT>
      )}
      {btnRight && btnRight}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: MyColors.border_white_005,
    paddingHorizontal: 12,
    height: 60,
    alignItems: "center",
  },
});
