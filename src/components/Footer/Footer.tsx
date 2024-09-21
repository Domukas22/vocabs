//
//
//

import React from "react";
import { StyleSheet, View } from "react-native";
import { MyColors } from "@/src/constants/MyColors";

interface _header {
  btnLeft?: React.ReactNode;
  btnRight?: React.ReactNode;
}

export default function Footer({ btnLeft, btnRight }: _header) {
  return (
    <View style={s.header}>
      {btnLeft && btnLeft}
      {btnRight && btnRight}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    borderTopWidth: 1,
    gap: 8,
    borderColor: MyColors.border_white_005,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
});
