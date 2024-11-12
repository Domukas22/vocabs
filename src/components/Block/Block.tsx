//
//
//

import { StyleProp, StyleSheetProperties, View, ViewStyle } from "react-native";

import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import Label from "../Label/Label";

interface _Input_WRAP {
  row?: boolean;
  styles?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  noBorder?: boolean;
}

export default function Block({
  row = false,
  styles,
  children,
  noBorder = false,
}: _Input_WRAP) {
  return (
    <View
      style={[
        {
          padding: 12,
          paddingBottom: 16,
          gap: 8,
          borderBottomWidth: 1,
          borderColor: MyColors.border_white_005,
        },
        row && { flexDirection: "row" },
        noBorder && { borderBottomWidth: 0, paddingBottom: 12 },
        styles,
      ]}
    >
      {children}
    </View>
  );
}
