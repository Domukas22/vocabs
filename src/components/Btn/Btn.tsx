//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { Pressable, StyleSheet, type TextStyle } from "react-native";
import { Styled_TEXT } from "../StyledText/StyledText";
import { PressableProps } from "react-native";
import btnStyles from "./btnStyles";
import { Href, Link } from "expo-router";

type Btn = PressableProps & {
  type?:
    | "simple"
    | "action"
    | "active"
    | "delete"
    | "seethrough"
    | "seethrough_primary"
    | "difficulty_3_active"
    | "difficulty_2_active"
    | "difficulty_1_active";
  text?: string;
  onPress?: () => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  text_STYLES?: TextStyle;
  stayPressed?: boolean;
  tiny?: boolean;
};

export default function Btn({
  text,
  iconLeft,
  iconRight,
  onPress = () => {},
  type = "simple",
  style,
  text_STYLES,
  stayPressed = false,
  tiny = false,
}: Btn) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { fontFamily: "Nunito-Medium" },
        btnStyles.default,
        pressed || stayPressed
          ? btnStyles[type].btn.press
          : btnStyles[type].btn.normal,
        tiny && btnStyles.tiny,
        style,
      ]}
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
    </Pressable>
  );
}
