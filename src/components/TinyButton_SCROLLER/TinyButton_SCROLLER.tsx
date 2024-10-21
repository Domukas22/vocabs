//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import { tr_PROPS } from "@/src/db/props";

import { t, use } from "i18next";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";

interface TinyButtonScroller_PROPS {
  children: React.ReactNode;
  last_BTN?: React.ReactNode;
}

export default function TinyButton_SCROLLER({
  children,
  last_BTN,
}: TinyButtonScroller_PROPS) {
  return (
    <View>
      <ScrollView
        style={[
          {
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 12,
            paddingVertical: 12,
          },
        ]}
        horizontal={true}
        keyboardShouldPersistTaps="always"
      >
        {children && children}
        {last_BTN && last_BTN}
      </ScrollView>
    </View>
  );
}
