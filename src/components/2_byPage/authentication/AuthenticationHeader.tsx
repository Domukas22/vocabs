//
//
//

import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { View } from "react-native";

export default function AuthenticationHeader({
  text,
  image_EL,
}: {
  text: string;
  image_EL: React.ReactNode;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderBottomColor: MyColors.border_white_005,
      }}
    >
      {image_EL && image_EL}
      <Styled_TEXT type="text_22_bold">{text || "INSERT TEXT"}</Styled_TEXT>
    </View>
  );
}
