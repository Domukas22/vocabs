//
//
//

import { StyleProp, View, ViewStyle } from "react-native";
import React from "react";
import { Styled_TEXT } from "../../Styled_TEXT/Styled_TEXT";

interface Label_PROPS {
  icon?: React.ReactNode;
  children: string;
  styles?: StyleProp<ViewStyle>;
}

const Label = React.memo(function Label({
  icon,
  children,
  styles,
}: Label_PROPS) {
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
});
export default Label;
