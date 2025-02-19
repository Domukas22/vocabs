//
//

import { ActivityIndicator, View } from "react-native";
import { ICON_arrow } from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import Big_BTN from "../Big_BTN/Big_BTN";
import { MyColors } from "@/src/constants/MyColors";

//
export default function BigPage_BTN({
  title = "INSERT TITLE",
  description = "INSERT DESCRIPTION",
  IS_loading = true,
  onPress = () => {},
}: {
  title: string;
  description: string;
  IS_loading: boolean;
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
        <View style={{ flexDirection: "row" }}>
          <Styled_TEXT type="text_18_bold">{title}</Styled_TEXT>
          {IS_loading ? (
            <ActivityIndicator
              color={MyColors.icon_gray}
              style={{ marginLeft: "auto" }}
            />
          ) : null}
        </View>
        <Styled_TEXT type="label_small" style={{ opacity: IS_loading ? 0 : 1 }}>
          {description}
        </Styled_TEXT>
        <ICON_arrow direction="right" style={{ alignItems: "flex-end" }} />
      </View>
    </Big_BTN>
  );
}
