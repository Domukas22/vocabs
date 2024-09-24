//
//
//

import Btn from "../../Basic/Btn/Btn";
import { ICON_X } from "@/src/components/Basic/icons/icons";
import { Styled_TEXT } from "../../Basic/Styled_TEXT/Styled_TEXT";

import { MyColors } from "@/src/constants/MyColors";

import React from "react";
import { View, Modal, SafeAreaView, StyleSheet, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BlurView } from "expo-blur";

interface SimpleModal_PROPS {
  children?: React.ReactNode;
  title?: string;
  open: boolean;
  toggle: () => void;
  btnLeft?: React.ReactNode;
  btnRight?: React.ReactNode;
}

export default function Simple_MODAL(props: SimpleModal_PROPS) {
  const {
    children,
    title = "Simple modal",
    open: SHOW_simpleModal,
    toggle: TOGGLE_simpleModal,
    btnLeft = <Btn text="Done" style={{ flex: 1 }} />,
    btnRight,
  } = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={SHOW_simpleModal}
      style={{}}
    >
      <BlurView
        intensity={50}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: MyColors.fill_bg_dark_seethrough,
        }}
        tint="dark"
      >
        <SafeAreaView
          style={{
            backgroundColor: MyColors.fill_bg_dark_seethrough,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <KeyboardAwareScrollView
            style={{
              flex: 1,
              width: "100%",
            }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          >
            <View style={s.greyBox}>
              <View style={s.header}>
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
              {children && <View style={s.content}>{children}</View>}
              <View style={s.footer}>
                {!btnLeft && !btnRight && (
                  <Styled_TEXT type="label_small">
                    use "btnLeft" or "btnRight" properties to insert buttons
                  </Styled_TEXT>
                )}
                {btnLeft && btnLeft}
                {btnRight && btnRight}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </BlurView>
    </Modal>
  );
}

const s = StyleSheet.create({
  greyBox: {
    backgroundColor: MyColors.fill_bg,
    borderColor: MyColors.border_white_005,
    borderWidth: 1,
    borderRadius: 16,
    width: "90%",
    maxWidth: 500,
    alignSelf: "center",
    marginVertical: "auto",
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
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderTopColor: MyColors.border_white_005,
    borderTopWidth: 1,
  },
});
