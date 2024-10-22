//
//
//

import React from "react";
import { StyleSheet, View } from "react-native";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";

interface _header {
  big?: boolean;
  title?: string;
  undertextGreen?: string;
  btnLeft?: React.ReactNode;
  btnRight?: React.ReactNode;
  IS_titleHighlighted?: boolean;
}

export default function Header({
  big = false,
  title = "A nice title",
  undertextGreen,
  btnLeft,
  btnRight,
  IS_titleHighlighted = false,
}: _header) {
  return (
    <View style={s.header}>
      {btnLeft && btnLeft}
      <View style={{ flex: 1 }}>
        <Styled_TEXT
          type={big ? "text_22_bold" : "text_18_semibold"}
          style={[
            !big && { textAlign: "center" },
            IS_titleHighlighted && { color: MyColors.text_green },
          ]}
        >
          {title}
        </Styled_TEXT>
        {undertextGreen && (
          <Styled_TEXT
            style={{
              textAlign: "center",
              fontSize: 15,
              color: MyColors.text_green,
            }}
          >
            {undertextGreen}
          </Styled_TEXT>
        )}
      </View>
      {btnRight && btnRight}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: MyColors.border_white_005,
    paddingHorizontal: 12,
    height: 60,
    alignItems: "center",
  },
});
