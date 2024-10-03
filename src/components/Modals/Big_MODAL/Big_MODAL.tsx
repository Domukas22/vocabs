//
//
//

import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import Notification_BOX from "../../Notification_BOX/Notification_BOX";
import My_TOAST from "../../My_TOAST/My_TOAST";

interface bigModal_PROPS {
  children: React.ReactNode;
  open: boolean;
}

export default function Big_MODAL({ children, open }: bigModal_PROPS) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      style={{ zIndex: 1 }}
    >
      <My_TOAST>
        <SafeAreaView
          style={{
            backgroundColor: MyColors.fill_bg,
            flex: 1,
          }}
        >
          {children}
        </SafeAreaView>
      </My_TOAST>
    </Modal>
  );
}
