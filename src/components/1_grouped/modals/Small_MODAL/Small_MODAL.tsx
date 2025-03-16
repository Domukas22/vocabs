//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { BlurView } from "expo-blur";

interface SimpleModal_PROPS {
  children?: React.ReactNode;
  title?: string;
  IS_open: boolean;
  TOGGLE_modal: () => void;
  btnLeft?: React.ReactNode;
  btnRight?: React.ReactNode;
  btnUpper?: React.ReactNode;
  z?: number;
}

export default function Small_MODAL(props: SimpleModal_PROPS) {
  const {
    children,
    title = "Simple modal",
    IS_open: SHOW_simpleModal,
    TOGGLE_modal: TOGGLE_simpleModal,
    btnLeft = <Btn text="Done" />,
    btnRight,
    btnUpper,
    z,
  } = props;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: z || 10,
        display: SHOW_simpleModal ? "flex" : "none",
      }}
    >
      {/* <Modal animationType="fade" transparent={true} visible={SHOW_simpleModal}> */}
      <BlurView
        intensity={50}
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: MyColors.fill_bg_dark_seethrough },
        ]}
      >
        {/* KeyboardAvoidingView helps adjust when keyboard is shown */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          // keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // Adjust offset for iOS
        >
          <View style={styles.greyBox}>
            <View style={styles.header}>
              <Styled_TEXT type="text_22_bold" style={{ flex: 1 }}>
                {title}
              </Styled_TEXT>
              <Btn
                type="seethrough"
                iconLeft={<ICON_X big={true} rotate={true} />}
                onPress={TOGGLE_simpleModal}
                style={{ borderRadius: 100 }}
              />
            </View>

            {/* Modal content */}
            {children && <View style={styles.content}>{children}</View>}

            <View style={styles.footer}>
              {!btnLeft && !btnRight && (
                <Styled_TEXT type="label_small">
                  use "btnLeft" or "btnRight" properties to insert buttons
                </Styled_TEXT>
              )}

              {btnUpper && btnUpper}
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                {btnLeft && btnLeft}
                {btnRight && btnRight}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
    justifyContent: "center", // Center content between keyboard and top
  },
  greyBox: {
    backgroundColor: MyColors.fill_bg,
    borderColor: MyColors.border_white_005,
    borderWidth: 1,
    borderRadius: 16,
    width: "90%",
    maxWidth: 500,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: MyColors.border_white_005,
    gap: 16,
    alignItems: "center",
  },
  content: {
    padding: 12,
    gap: 8,
  },
  footer: {
    gap: 8,
    padding: 12,
    borderTopColor: MyColors.border_white_005,
    borderTopWidth: 1,
  },
});
