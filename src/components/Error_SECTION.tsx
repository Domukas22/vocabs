//
//
//

import { View } from "react-native";
import { MyColors } from "../constants/MyColors";
import { Styled_TEXT } from "./Styled_TEXT/Styled_TEXT";
import { ICON_error, ICON_toastNotification } from "./icons/icons";

export default function Error_SECTION({
  title = "An error has occured.",
  paragraph = "If the problem persists, please try to re-load the app or contact support. We apologize for the troubles.",
  children,
}: {
  title?: string;
  paragraph: string;
  children?: React.ReactNode;
}) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 16,
        borderColor: MyColors.border_red,
        backgroundColor: MyColors.fill_red_dark,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: MyColors.border_red,
        }}
      >
        <ICON_error />
        <Styled_TEXT
          type="text_18_bold"
          style={{ color: MyColors.text_red, flex: 1 }}
        >
          {title}
        </Styled_TEXT>
      </View>
      <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
        <Styled_TEXT>{paragraph}</Styled_TEXT>
      </View>
      {children && children}
    </View>
  );
}
