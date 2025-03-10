//
//
//

import React from "react";
import { View } from "react-native";

export function ListCardBottomRight_WRAP({
  children,
}: {
  children: React.ReactNode;
}) {
  return children ? (
    <View style={{ flexDirection: "row", gap: 2 }}>{children}</View>
  ) : null;
}
