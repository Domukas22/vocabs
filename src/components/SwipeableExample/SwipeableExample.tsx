import { MyColors } from "@/src/constants/MyColors";
import { t } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, View } from "react-native";
import {
  RectButton,
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

const ACTION_WIDTH = 120;

export default function SwipeableExample({
  children,
  leftBtn_ACTION,
  rightBtn_ACTION,
}: {
  children: React.ReactNode;
  leftBtn_ACTION?: () => void;
  rightBtn_ACTION?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Swipeable
          renderLeftActions={(progress, dragX) => {
            if (leftBtn_ACTION)
              return RENDER_leftActions(progress, dragX, leftBtn_ACTION, t);
          }}
          renderRightActions={(progress, dragX) => {
            if (rightBtn_ACTION)
              return RENDER_rightActions(progress, dragX, rightBtn_ACTION, t);
          }}
        >
          {/* <View style={styles.swipeableContainer}>
            <Text style={styles.text}>Swipe me left or right!</Text>
            </View> */}
          {children && children}
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );
}

function RENDER_leftActions(progress, dragX, leftBtn_ACTION, t) {
  const trans = dragX.interpolate({
    inputRange: [0, ACTION_WIDTH], // Limit swipe to the action width
    outputRange: [-ACTION_WIDTH / 2, 0], // Smooth transition
    extrapolate: "clamp",
  });

  return (
    <RectButton
      style={[styles.leftAction, { width: ACTION_WIDTH }]} // Set the width of the left action
      onPress={leftBtn_ACTION}
    >
      <Animated.Text
        style={[
          styles.actionText,
          {
            transform: [{ translateX: trans }],
            color: MyColors.text_green,
            fontFamily: "Nunito-SemiBold",
            fontSize: 18,
          },
        ]}
      >
        {t("btn.renameList")}
      </Animated.Text>
    </RectButton>
  );
}

function RENDER_rightActions(progress, dragX, rightBtn_ACTION, t) {
  const trans = dragX.interpolate({
    inputRange: [-ACTION_WIDTH, 0], // Limit swipe to the action width
    outputRange: [0, ACTION_WIDTH / 2], // Smooth transition
    extrapolate: "clamp",
  });

  return (
    <RectButton
      style={[styles.rightAction, { width: ACTION_WIDTH }]} // Set the width of the right action
      onPress={rightBtn_ACTION}
    >
      <Animated.Text
        style={[
          styles.actionText,
          {
            transform: [{ translateX: trans }],
            color: MyColors.text_red,
            fontFamily: "Nunito-SemiBold",
            fontSize: 18,
          },
        ]}
      >
        {t("btn.delete")}
      </Animated.Text>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",

    // backgroundColor: "green",
  },
  swipeableContainer: {
    width: "100%",

    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
  },
  text: {
    fontSize: 18,
  },
  leftAction: {
    flex: 1,
    backgroundColor: MyColors.btn_green,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  rightAction: {
    flex: 1,
    backgroundColor: MyColors.btn_red,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  actionText: {
    color: "white",
    fontWeight: "600",
    padding: 20,
  },
});
