//
//
//

import React from "react";
import { ScrollView } from "react-native-gesture-handler";

export function DisplaySettingsModalContent_SCROLLVIEW({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ScrollView style={{ flex: 1, width: "100%" }}>{children}</ScrollView>;
}
