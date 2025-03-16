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
}: {
  children: React.ReactNode;
  paddingTop?: boolean;
}) {
  return (
    <View style={[s.view, paddingTop && { paddingTop: HEADER_MARGIN || 68 }]}>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  view: {
    maxWidth: 700,
    width: "100%",
    // minHeight: "100%",
    flex: 1,
  },
});
