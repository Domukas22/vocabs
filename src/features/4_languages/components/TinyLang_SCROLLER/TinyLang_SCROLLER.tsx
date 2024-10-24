//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import { tr_PROPS } from "@/src/db/props";

import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";

interface TinyLangScroller_PROPS {
  trs: tr_PROPS[];
  REMOVE_lang: (lang_id: string) => void;
  TOGGLE_langModal: () => void;
  bottomBorder?: boolean;
  bottom_EL?: React.ReactNode;
  last_BTN?: React.ReactNode;
}

export default function TinyLang_SCROLLER({
  trs,
  REMOVE_lang,
  TOGGLE_langModal,
  last_BTN,
  bottomBorder = false,
  bottom_EL,
}: TinyLangScroller_PROPS) {
  const { languages } = USE_langs();
  const langs = useMemo(() => GET_langsFromTranslations(trs, languages), [trs]);

  return (
    <View
      style={[
        bottomBorder && {
          borderBottomWidth: 1,
          borderBottomColor: MyColors.border_white_005,
        },
      ]}
    >
      <ScrollView
        style={[
          {
            flexDirection: "row",
            width: "100%",
            paddingLeft: 12,
            paddingVertical: 12,
          },
        ]}
        horizontal={true}
        keyboardShouldPersistTaps="always"
      >
        {langs?.map((lang) => (
          <Btn
            key={lang?.lang_id + "tiny selected lang buttons"}
            iconLeft={<ICON_flag lang={lang?.lang_id} />}
            text={lang?.lang_id?.toUpperCase()}
            iconRight={<ICON_X color="primary" rotate={true} />}
            onPress={() => REMOVE_lang(lang?.lang_id)}
            type="active"
            tiny={true}
            style={{ marginRight: 8 }}
          />
        ))}
        {last_BTN && last_BTN}
      </ScrollView>
      {bottom_EL && bottom_EL}
    </View>
  );
}
