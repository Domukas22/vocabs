//
//
//

import { Pressable, type TextStyle } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { PressableProps } from "react-native";
import btnStyles, { btnTypes } from "./btnStyles";
import React from "react";
import TopRightBtnNr from "./TopRightBtnNr";

type Btn = PressableProps & {
  type?: btnTypes;
  text?: string;
  onPress?: () => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  text_STYLES?: TextStyle;
  stayPressed?: boolean;
  tiny?: boolean;
  topRightIconCount?: number;
  props?: PressableProps;
  blurAndDisable?: boolean;
};

export default function Btn({
  text,
  iconLeft,
  iconRight,
  onPress,
  type = "simple",
  style,
  text_STYLES,
  stayPressed = false,
  tiny = false,
  topRightIconCount = 0,
  blurAndDisable = false,
  props,
}: Btn) {
  return (
    <Pressable
      onPress={onPress && onPress}
      style={({ pressed }) => [
        btnStyles.default,
        blurAndDisable && { pointerEvents: "none" },
        pressed || stayPressed
          ? btnStyles[type].btn.press
          : btnStyles[type].btn.normal,
        tiny && btnStyles.tiny,
        style,
      ]}
      {...props}
    >
      {iconLeft && iconLeft}
      {text && (
        <Styled_TEXT
          type="text_18_regular"
          style={[text_STYLES, btnStyles[type].text]}
        >
          {text}
        </Styled_TEXT>
      )}
      {iconRight && iconRight}
      {topRightIconCount > 0 && <TopRightBtnNr count={topRightIconCount} />}
    </Pressable>
  );
}
