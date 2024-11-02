//
//
//

import { PressableProps, Pressable, StyleSheet } from "react-native";
import React from "react";
import { MyColors } from "@/src/constants/MyColors";
import { Btn_BLUR } from "../Btn/Btn";

type TransitionBtn_PROPS = PressableProps & {
  children: React.ReactNode;
  onPress: () => void;
  highlighted?: boolean;
  blurAndDisable?: boolean;
  props?: PressableProps;
};

export default function Transition_BTN({
  children,
  style,
  props,
  highlighted = false,
  blurAndDisable = false,
  onPress = () => {},
}: TransitionBtn_PROPS) {
  return (
    <Pressable
      style={({ pressed }) => [
        s.btn,
        blurAndDisable && { pointerEvents: "none" },
        pressed && s.pressed,
        highlighted && s.highlighted,
        style as object,
      ]}
      onPress={onPress}
      {...props}
    >
      {blurAndDisable && <Btn_BLUR />}

      {children && children}
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
    backgroundColor: MyColors.btn_2,
    minHeight: 44,
    borderRadius: 12,
    width: "100%",
    minWidth: "100%",
    position: "relative",
  },
  pressed: {
    backgroundColor: MyColors.btn_3,
  },
  highlighted: {
    backgroundColor: MyColors.btn_green,
    borderColor: MyColors.border_green,
  },
});
