//
//
//

import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { TRANSFORM_dateObject } from "../app/(main)/general/notifications";
import { MyColors } from "../constants/MyColors";
import Btn from "./Btn/Btn";
import { Styled_TEXT } from "./Styled_TEXT/Styled_TEXT";
import { StyleSheet } from "react-native";

export default function Expandable_BTN({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const [open, SET_open] = useState(false);

  return (
    <View style={[s.btn, open && s.btn_OPEN]}>
      <Pressable
        style={({ pressed }) => [
          s.btn_TOP,

          pressed && !open && s.btnTop_PRESSED,

          open && s.btnTop_OPEN,
        ]}
        onPress={() => {
          if (!open) SET_open(true);
        }}
      >
        <Styled_TEXT
          type="text_18_bold"
          style={{
            color: "white",
          }}
        >
          {title || "INSERT TITLE"}
        </Styled_TEXT>
        {subtitle && <Styled_TEXT type="label_small">{subtitle}</Styled_TEXT>}
      </Pressable>
      {open && (
        <>
          <View style={s.children_WRAP}>{children && children}</View>
          <View style={s.btn_WRAP}>
            <Btn
              text="Close"
              onPress={() => SET_open(false)}
              style={{ flex: 1 }}
            />
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  btn: {
    borderRadius: 16,
    borderColor: "transparent",
    borderWidth: 1,
  },
  btn_OPEN: {
    borderColor: MyColors.border_white_005,
  },
  btn_TOP: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: MyColors.btn_2,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
  },

  btnTop_PRESSED: {
    backgroundColor: MyColors.btn_3,
  },

  btnTop_OPEN: {
    backgroundColor: MyColors.btn_1,
    borderColor: "transparent",
  },
  children_WRAP: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: MyColors.border_white_005,
  },
  btn_WRAP: {
    borderTopWidth: 1,
    borderTopColor: MyColors.border_white_005,
    padding: 12,
    gap: 8,
    flexDirection: "row",
  },
});
