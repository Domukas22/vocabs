//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { List_TYPE } from "@/src/features_new/lists/types";
import React from "react";
import { View } from "react-native";

export function ListCardBottom_WRAP({
  list,
  children,
}: {
  list: List_TYPE;
  children: React.ReactNode;
}) {
  const { total = 0 } = list?.vocab_infos || {};

  return children && total ? (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: MyColors.border_white_005,
      }}
    >
      {children}
    </View>
  ) : null;
}
