//
//

import { Animated, Easing, View } from "react-native";
import { MyColors } from "../constants/MyColors";
import { useEffect, useRef } from "react";

//
export default function Skeleton_VIEW() {
  return (
    <View style={{ gap: 12, flex: 1 }}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </View>
  );
}

export function Skeleton() {
  const backgroundColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(backgroundColor, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(backgroundColor, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    animate();
  }, [backgroundColor]);

  const interpolatedColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: [MyColors.btn_1, MyColors.btn_3], // Light color transition
  });

  return (
    <Animated.View
      style={{
        borderRadius: 12,
        backgroundColor: interpolatedColor,
        height: 100,
        borderWidth: 1,
        borderColor: MyColors.border_white_005,
      }}
    />
  );
}
