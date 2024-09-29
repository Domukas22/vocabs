//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";
import { ICON_toastNotification } from "../icons/icons";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";

export default function Notification_BOX({
  type,
  text = "This is a green toast",
}: {
  type: "success" | "error" | "warning";
  text: string | undefined;
}) {
  return (
    <View style={s.wrap}>
      <View
        style={[
          s.box,
          type === "success" && { backgroundColor: MyColors.btn_green },
          type === "error" && { backgroundColor: MyColors.fill_red_dark },
          type === "warning" && { backgroundColor: MyColors.fill_yellow_dark },
        ]}
      >
        <ICON_toastNotification type={type} />
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
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    gap: 12,
  },
});
