//
//
//

import { Pressable, PressableProps, StyleSheet, View } from "react-native";
import { Styled_TEXT } from "../../Basic/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";

type Btn = PressableProps & {
  text: string;
  active: boolean;
  onPress: () => void;
  last?: boolean;
};

export default function Settings_TOGGLE({
  text = "Toggle text",
  active = false,
  onPress = () => {},
  last = false,
}: Btn) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        pressed && s.btnPress,
        last && { borderBottomWidth: 0 },
      ]}
    >
      {text && (
        <Styled_TEXT type="text_18_regular" style={{ flex: 1 }}>
          {text}
        </Styled_TEXT>
      )}
      <View style={[s.toggle, active && s.toggleActive]}>
        <View style={[s.toggleCircle, active && s.toggleCircleActive]}></View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: MyColors.btn_1,
    borderBottomWidth: 1,
    borderBottomColor: MyColors.border_white_005,
  },
  btnPress: {
    backgroundColor: MyColors.btn_2,
  },
  toggle: {
    height: 30,
    width: 50,
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: "#353535",
    borderColor: MyColors.border_white_005,
    justifyContent: "center",
    padding: 4,
    alignItems: "flex-start",
  },
  toggleActive: {
    backgroundColor: MyColors.btn_active,
    borderColor: MyColors.border_contrast,
    alignItems: "flex-end",
  },
  toggleCircle: {
    width: 21,
    height: 21,
    borderRadius: 100,
    backgroundColor: MyColors.icon_gray,
  },
  toggleCircleActive: {
    backgroundColor: MyColors.icon_primary,
  },
});
