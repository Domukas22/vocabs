//
//
//

import { View } from "react-native";
import React from "react";

export function ListBtn_TOP({
  name = "INSERT LIST NAME",
  description,
  owner_USERNAME,
  IS_shared = false,
  IS_submitted = false,
  vocab_COUNT = 0,
  children,
}: {
  name?: string | undefined;
  description?: string | undefined;
  owner_USERNAME?: string | undefined;
  IS_shared?: boolean;
  IS_submitted?: boolean;
  vocab_COUNT?: number;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 14,
      }}
    >
      {children && children}
    </View>
  );
}
