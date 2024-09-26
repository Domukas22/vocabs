//
//
//

import React from "react";
import { StyleSheet, View } from "react-native";
import { MyColors } from "@/src/constants/MyColors";

interface _header {
  contentAbove?: React.ReactNode;
  btnLeft?: React.ReactNode;
  btnRight?: React.ReactNode;
}

export default function Footer({ contentAbove, btnLeft, btnRight }: _header) {
  return (
    <View style={s.parent}>
      {contentAbove && contentAbove}
      <View style={s.bottom}>
        {btnLeft && btnLeft}
        {btnRight && btnRight}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  parent: {
    borderTopWidth: 1,
    borderColor: MyColors.border_white_005,
    alignItems: "center",
    gap: 16,
  },
  bottom: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    flexDirection: "row",
  },
});
