//
//
//

import { HEADER_MARGIN } from "@/src/constants/globalVars";
import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page_WRAP({
  children,
  paddingTop,
  bottomEdge = false,
}: {
  children: React.ReactNode;
  paddingTop?: boolean;
  bottomEdge?: boolean;
}) {
  return (
    <SafeAreaView
      style={s.MainScreen_VIEW}
      edges={
        bottomEdge
          ? ["top", "left", "right", "bottom"]
          : ["top", "left", "right"]
      }
    >
      <View style={[s.view, paddingTop && { paddingTop: HEADER_MARGIN || 68 }]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  MainScreen_VIEW: {
    backgroundColor: MyColors.fill_bg,
    flex: 1,
    paddingBottom: 0,
    paddingVertical: 0,
    alignItems: "center",
  },
  view: {
    maxWidth: 700,
    width: "100%",
    // minHeight: "100%",
    flex: 1,
  },
});
