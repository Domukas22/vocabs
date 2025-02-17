//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";
import { ICON_toastNotification } from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { Toast_TYPE } from "@/src/types/general_TYPES";

export default function Notification_BLOCK({
  type,
  text = "This is a green toast",
}: {
  type: Toast_TYPE;
  text: string | undefined;
}) {
  return (
    <View style={s.wrap}>
      <View
        style={[
          s.box,
          type === "success" && {
            backgroundColor: MyColors.btn_green,
            borderColor: MyColors.border_green,
          },
          type === "error" && {
            backgroundColor: MyColors.fill_red_dark,
            borderColor: MyColors.border_red,
          },
          type === "warning" && {
            backgroundColor: MyColors.fill_yellow_dark,
            borderColor: MyColors.border_yellow,
          },
        ]}
      >
        <View style={{ marginTop: 1 }}>
          <ICON_toastNotification type={type} />
        </View>
        <Styled_TEXT
          type="text_18_medium"
          style={[
            { flex: 1 },

            type === "success" && { color: MyColors.text_green },
            type === "error" && { color: MyColors.text_red },
            type === "warning" && { color: MyColors.text_yellow },
          ]}
        >
          {text}
        </Styled_TEXT>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingHorizontal: 12,
    width: "100%",
  },
  box: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 8,
    gap: 12,
    borderWidth: 1,
  },
});
