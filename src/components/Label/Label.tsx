//
//
//

import { View } from "react-native";

import React from "react";
import { Styled_TEXT } from "../StyledText/StyledText";

interface Label_PROPS {
  icon?: React.ReactNode;
  children: string;
}

export default function Label({ icon, children }: Label_PROPS) {
  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      {icon && icon}
      <Styled_TEXT type="label" style={{ flex: 1 }}>
        {children}
      </Styled_TEXT>
    </View>
  );
}
