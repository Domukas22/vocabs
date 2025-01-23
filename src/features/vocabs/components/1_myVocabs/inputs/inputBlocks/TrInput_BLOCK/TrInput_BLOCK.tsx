//
//
//

import Language_MODEL from "@/src/db/models/Language_MODEL";
import Block from "@/src/components/1_grouped/blocks/Block/Block";
import { ICON_flag } from "@/src/components/1_grouped/icons/icons";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { MyColors } from "@/src/constants/MyColors";
import Highlighted_TEXT from "@/src/components/1_grouped/texts/Highlighted_TEXT/Highlighted_TEXT";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import StyledText_INPUT from "@/src/components/1_grouped/inputs/StyledText_INPUT/StyledText_INPUT";

import { FieldError } from "react-hook-form";
import { tr_PROPS } from "@/src/props";

interface VocabTranslationInputs_PROPS {
  tr: tr_PROPS;
  lang: Language_MODEL | undefined;
  diff: 0 | 1 | 2 | 3;
  OPEN_highlights: (tr: tr_PROPS) => void;
  error: FieldError | undefined;
  isSubmitted: boolean;
  onChange: (...event: any[]) => void;
}

export function TrInput_BLOCK({
  tr,
  lang,
  diff,
  error,
  isSubmitted,
  onChange,
  OPEN_highlights,
}: VocabTranslationInputs_PROPS) {
  const { t } = useTranslation();
  const inputREF = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const appLang = useMemo(() => i18next.language, []);

  return (
    <Block styles={{ padding: 12 }}>
      <Label icon={<ICON_flag lang={lang?.lang_id} big />}>{`${t(
        "word.translation"
      )} auf ${lang?.[`lang_in_${appLang || "en"}`]} *`}</Label>

      <View style={{ position: "relative" }}>
        {!isFocused && (
          <View
            style={[
              s.overlay,
              isSubmitted &&
                !error && {
                  paddingRight: 44,
                },
            ]}
            pointerEvents="none"
          >
            {tr.text && (
              <Highlighted_TEXT
                text={tr.text}
                highlights={tr.highlights}
                // light
                {...{ diff }}
              />
            )}
          </View>
        )}
        <StyledText_INPUT
          multiline
          value={tr.text}
          SET_value={onChange}
          style={{ fontFamily: "Nunito-Medium" }}
          // placeholder={t("placeholder.translation")}
          _ref={inputREF}
          {...{ error, isSubmitted, isFocused, setIsFocused }}
        />
      </View>
      {error && <Styled_TEXT type="text_error">{error.message}</Styled_TEXT>}

      <View style={{ flexDirection: "row", gap: 8 }}>
        {/* <Btn text="Remove" type="seethrough" onPress={() => {}} /> */}
        {tr.text && (
          <Btn
            text={t("btn.editHighlights")}
            type="seethrough"
            onPress={() => {
              OPEN_highlights(tr);
              setIsFocused(false);
              inputREF.current?.blur();
            }}
            style={{ flex: 1 }}
          />
        )}
      </View>
      {/* <Styled_TEXT>Highlights: {tr.highlights}</Styled_TEXT> */}
    </Block>
  );
}

const s = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    // justifyContent: "center",

    zIndex: 10,

    paddingHorizontal: 16,
    paddingVertical: 12,

    backgroundColor: MyColors.btn_2,
    borderRadius: 12,
    // borderWidth: 1,
    // borderColor: MyColors.border_white_005,
  },
  textBtnPress: {
    backgroundColor: MyColors.btn_3,
  },
});
