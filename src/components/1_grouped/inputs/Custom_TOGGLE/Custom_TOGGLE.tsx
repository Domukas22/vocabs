//
//
//

import {
  Pressable,
  PressableProps,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import React from "react";

type Btn = PressableProps & {
  text: string;
  active: boolean;
  onPress: () => void;
  last?: boolean;
  icon?: React.ReactNode;
};

export default function Custom_TOGGLE({
  text = "Toggle text",
  icon,
  active = false,
  onPress = () => {},
  last = false,
}: Btn) {
  return (
    <Pressable
      style={({ pressed }) => [
        s.btn,
        pressed && s.btnPress,
        last && { borderBottomWidth: 0 },
      ]}
      onPress={onPress}
    >
      <View
        style={{ flex: 1, gap: 10, flexDirection: "row", alignItems: "center" }}
      >
        {icon && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 26,
            }}
          >
            {icon}
          </View>
        )}
        {text && (
          <Styled_TEXT type="text_18_regular" style={{ flex: 1 }}>
            {text}
          </Styled_TEXT>
        )}
      </View>
      <Switch
        trackColor={{ false: "#252525", true: MyColors.btn_active_press }}
        thumbColor={active ? MyColors.icon_primary : MyColors.icon_gray}
        ios_backgroundColor="#252525"
        onValueChange={onPress}
        value={active}
      />
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: MyColors.btn_2,
    borderBottomWidth: 1,
    borderBottomColor: MyColors.border_white_005,
  },
  btnPress: {
    backgroundColor: MyColors.btn_3,
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
