//
//
//

import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { View } from "react-native";

interface bigModal_PROPS {
  children: React.ReactNode;
  open: boolean;
  z?: number;
}

export default function Big_MODAL({ children, open, z }: bigModal_PROPS) {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: z || 20,
        display: open ? "flex" : "none",
        backgroundColor: MyColors.fill_bg,
      }}
    >
      {open ? children : null}
    </View>
  );
}
