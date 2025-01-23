//
//
//

import React from "react";
import { StyleSheet, View } from "react-native";
import { MyColors } from "@/src/constants/MyColors";

interface Footer_PROPS {
  contentAbove?: React.ReactNode;
  btnLeft?: React.ReactNode;
  btnRight?: React.ReactNode;
}

export default function TwoBtn_BLOCK({
  contentAbove,
  btnLeft,
  btnRight,
}: Footer_PROPS) {
  return (
    <View style={s.parent}>
      <View style={{ width: "100%" }}>{contentAbove && contentAbove}</View>
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

    marginTop: "auto",
  },
  bottom: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    flexDirection: "row",
  },
});
