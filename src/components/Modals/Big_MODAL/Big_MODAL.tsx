//
//
//

import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { Modal, SafeAreaView } from "react-native";

interface bigModal_PROPS {
  children: React.ReactNode;
  open: boolean;
}

export default function Big_MODAL({ children, open }: bigModal_PROPS) {
  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <SafeAreaView
        style={{
          backgroundColor: MyColors.fill_bg,
          flex: 1,
        }}
      >
        {children}
      </SafeAreaView>
    </Modal>
  );
}
