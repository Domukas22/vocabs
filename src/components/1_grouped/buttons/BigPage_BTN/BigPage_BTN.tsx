//
//

import { View } from "react-native";
import { ICON_arrow } from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import Big_BTN from "../Big_BTN/Big_BTN";

//
export default function BigPage_BTN({
  title = "INSERT TITLE",
  description = "INSERT DESCRIPTION",
  onPress = () => {},
}: {
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Big_BTN onPress={onPress}>
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 8,
          paddingHorizontal: 14,
        }}
      >
        <Styled_TEXT type="text_18_bold">{title}</Styled_TEXT>
        <Styled_TEXT type="label_small">{description}</Styled_TEXT>
        <ICON_arrow direction="right" style={{ alignItems: "flex-end" }} />
      </View>
    </Big_BTN>
  );
}
