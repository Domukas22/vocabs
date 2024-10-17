//
//
//

import { Pressable, type TextStyle } from "react-native";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";
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

  props,
}: Btn) {
  return (
    <Pressable
      onPress={onPress && onPress}
      style={({ pressed }) => [
        { position: "relative" },
        btnStyles.default,
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
          style={[btnStyles[type].text, text_STYLES]}
        >
          {text}
        </Styled_TEXT>
      )}
      {iconRight && iconRight}
      {topRightIconCount > 0 && <TopRightBtnNr count={topRightIconCount} />}
    </Pressable>
  );
}
