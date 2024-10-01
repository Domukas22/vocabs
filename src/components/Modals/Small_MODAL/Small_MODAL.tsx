import Btn from "../../Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import { Styled_TEXT } from "../../Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import {
  View,
  Modal,
  SafeAreaView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { BlurView } from "expo-blur";

interface SimpleModal_PROPS {
  children?: React.ReactNode;
  title?: string;
  open: boolean;
  toggle: () => void;
  btnLeft?: React.ReactNode;
  btnRight?: React.ReactNode;
  btnUpper?: React.ReactNode;
}

export default function Small_MODAL(props: SimpleModal_PROPS) {
  const {
    children,
    title = "Simple modal",
    open: SHOW_simpleModal,
    toggle: TOGGLE_simpleModal,
    btnLeft = <Btn text="Done" />,
    btnRight,
    btnUpper,
  } = props;

  return (
    <Modal animationType="fade" transparent={true} visible={SHOW_simpleModal}>
      <BlurView
        intensity={50}
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: MyColors.fill_bg_dark_seethrough },
        ]}
      >
        <SafeAreaView style={styles.safeAreaView}>
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
        </SafeAreaView>
      </BlurView>
    </Modal>
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
