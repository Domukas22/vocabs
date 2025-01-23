//
//
//

import { View } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import React, { ReactNode } from "react";

export default function Subheader({
  children,
  noPadding = false,
}: {
  children: ReactNode;
  noPadding?: boolean;
}) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          gap: 8,
          flexWrap: "wrap",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderColor: MyColors.border_white_005,
        },
        noPadding && { paddingHorizontal: 0, paddingVertical: 0 },
      ]}
    >
      {children}
    </View>
  );
}
