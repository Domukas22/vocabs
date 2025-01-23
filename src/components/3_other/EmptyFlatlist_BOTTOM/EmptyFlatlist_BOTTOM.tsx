//
//
//

//
//
//

import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Btn from "../../1_grouped/buttons/Btn/Btn";
import { ICON_X } from "../../1_grouped/icons/icons";
import { Styled_TEXT } from "../../1_grouped/texts/Styled_TEXT/Styled_TEXT";

export default function EmptyFlatlist_BOTTOM({
  emptyBox_TEXT = "INSERT EMPTY BOX TEXT",
  btn_TEXT,
  btn_ACTION,
  bottom_EL,
}: {
  emptyBox_TEXT: string;
  btn_TEXT?: string;
  btn_ACTION?: () => void;
  bottom_EL?: React.ReactNode;
}) {
  return (
    <View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 32,
          borderBottomWidth: 1,
          borderBottomColor: MyColors.border_white_005,
        }}
      >
        <Styled_TEXT style={{ color: MyColors.text_white_06 }}>
          {emptyBox_TEXT}
        </Styled_TEXT>
      </View>
      {btn_TEXT && btn_ACTION && (
        <View style={{ padding: 12, paddingTop: 16 }}>
          <Btn
            text={btn_TEXT}
            iconLeft={<ICON_X color="primary" />}
            type="seethrough_primary"
            onPress={btn_ACTION}
          />
        </View>
      )}
      {bottom_EL && bottom_EL}
    </View>
  );
}
