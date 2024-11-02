//
//
//

import {
  Dimensions,
  Pressable,
  StyleSheet,
  type TextStyle,
  Animated,
} from "react-native";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";
import { PressableProps } from "react-native";
import btnStyles, { btnTypes } from "./btnStyles";
import React from "react";
import TopRightBtnNr from "./TopRightBtnNr";
import { BlurView } from "expo-blur";
import { View } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useRef, useEffect } from "react";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
      {/* {blurAndDisable && <Btn_BLUR />} Add overflow: hidden to pressable if you decide to use this */}

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

export function Btn_BLUR() {
  return (
    <View
      style={{
        minWidth: "100%",

        position: "absolute",
        zIndex: 10,
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
      }}
    >
      <BlurView
        intensity={20}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: 1,
            borderRadius: 50,
            width: "auto",
            height: "auto",
            zIndex: 2,
          },
        ]}
      />
    </View>
  );
}

const ShimmerLoading = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get("window");

  const _ref = useRef<View>(null);

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerValue]);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width], // Diagonal movement
  });

  return (
    <View
      style={{
        minWidth: "100%",

        position: "absolute",
        zIndex: 1,
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
      }}
      ref={_ref}
    >
      <BlurView
        intensity={30}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: 1,
            borderRadius: 50,
            width: "auto",
            height: "auto",
            zIndex: 2,
          },
        ]}
      />
      {/* <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "150%", // Extends beyond the container for smooth shimmer
          height: "150%",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          opacity: 0.5,
          zIndex: 1,
          transform: [{ translateX }, { rotate: "120deg" }], // Diagonal animation
        }}
      >
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255, 255, 255, 0.1)",
            "rgba(255, 255, 255, 0.1)",
            "transparent",
          ]}
          locations={[0, 0.2, 0.8, 1]}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Animated.View> */}
    </View>
  );
};
