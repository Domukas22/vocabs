//
//
//

import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page_WRAP({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={s.MainScreen_VIEW}>
      <View style={s.view}>{children}</View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  MainScreen_VIEW: {
    backgroundColor: MyColors.fill_bg,
    flex: 1,
    alignItems: "center",
  },
  view: {
    maxWidth: 700,
    width: "100%",
    flex: 1,
  },
});
