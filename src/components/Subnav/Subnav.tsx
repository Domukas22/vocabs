//
//
//

import { View } from "react-native";
import SearchBar from "../SearchBar/SearchBar";
import Btn from "../btn/btn";
import { ICON_displaySettings, ICON_X } from "../icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import React, { ReactNode } from "react";

export default function Subnav({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: MyColors.border_white_005,
      }}
    >
      {children}
    </View>
  );
}
