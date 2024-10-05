//
//
//

import { StyleProp, StyleSheetProperties, View, ViewStyle } from "react-native";

import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import Label from "../Label/Label";

interface _Input_WRAP {
  label?: string;
  labelIcon?: React.ReactNode;
  row?: boolean;
  noBorder?: boolean;
  children: React.ReactNode;
  styles?: StyleProp<ViewStyle>;
}

export default function Block({
  row = false,
  noBorder = false,
  children,
  styles,
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
        noBorder && { borderBottomWidth: 0, paddingBottom: 8 },
        styles,
      ]}
    >
      {children}
    </View>
  );
}
