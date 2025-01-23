//
//
//

import { StyleProp, View, ViewStyle } from "react-native";
import React from "react";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

interface Label_PROPS {
  icon?: React.ReactNode;
  children: string;
  styles?: StyleProp<ViewStyle>;
}

export default function Label({ icon, children, styles }: Label_PROPS) {
  return (
    <View
      style={[{ flexDirection: "row", gap: 8, alignItems: "center" }, styles]}
    >
      {icon && icon}
      <Styled_TEXT type="label" style={{ flex: 1 }}>
        {children}
      </Styled_TEXT>
    </View>
  );
}
