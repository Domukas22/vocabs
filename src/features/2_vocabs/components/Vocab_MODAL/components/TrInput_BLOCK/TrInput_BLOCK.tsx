//
//
//

import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import Block from "@/src/components/Block/Block";
import { ICON_flag } from "@/src/components/icons/icons";
import Btn from "@/src/components/Btn/Btn";
import React, { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { MyColors } from "@/src/constants/MyColors";
import Highlighted_TEXT from "@/src/components/Highlighted_TEXT/Highlighted_TEXT";
import Label from "@/src/components/Label/Label";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import { USE_toggle } from "@/src/hooks/USE_toggle";

interface VocabTranslationInputs_PROPS {
  languages: Language_MODEL[] | undefined;
  tr: TranslationCreation_PROPS;
  modal_DIFF: 0 | 1 | 2 | 3;
  SET_targetLang: React.Dispatch<
    React.SetStateAction<Language_MODEL | undefined>
  >;
  TOGGLE_modal: (whichModalToOpen: string) => void;
}

export default function TrInput_BLOCK({
  tr,
  languages,
  modal_DIFF,
  SET_targetLang,
  TOGGLE_modal,
  target_LANG,
  SET_modalTRs,
}: VocabTranslationInputs_PROPS) {
  const { t } = useTranslation();
  const appLang = useMemo(() => i18next.language, []);
  const lang: Language_MODEL | undefined = languages?.find(
    (lang: Language_MODEL) => lang.id === tr.lang_id
  );

  const inputREF = useRef(null);
  const [SHOW_textInput, SET_showtextInput] = useState(false);

  const HANDLE_text = (newVal) => {
    SET_modalTRs((prev) =>
      prev.map((currTr) => {
        if (currTr.lang_id === tr.lang_id) {
          currTr.text = newVal;
        }
        return currTr;
      })
    );
  };

  const [isFocused, setIsFocused] = useState(false);
  return (
    <Block
      labelIcon={<ICON_flag lang={tr?.lang_id} />}
      styles={{ padding: 20 }}
    >
      <Label icon={<ICON_flag lang={lang?.id} />}>{`${t(
        "word.translation"
      )} auf ${lang?.[`lang_in_${appLang || "en"}`]}`}</Label>
      <View style={{ position: "relative" }}>
        {!isFocused && (
          <View style={s.overlay} pointerEvents="none">
            {tr.text && (
              <Highlighted_TEXT
                text={tr.text}
                highlights={tr.highlights}
                modal_DIFF={modal_DIFF}
                light
              />
            )}
            {/* {!tr.text && (
              <Styled_TEXT
                type="text_18_light"
                style={{
                  color: MyColors.text_white_06,
                }}
              >
                {t("placeholder.translation")}
              </Styled_TEXT>
            )} */}
            {/* <Styled_TEXT>{tr.text}</Styled_TEXT> */}
          </View>
        )}

        <StyledText_INPUT
          multiline
          value={tr.text}
          SET_value={HANDLE_text}
          // placeholder={t("placeholder.translation")}
          _ref={inputREF}
          onBlur={() => SET_showtextInput(false)}
          setIsFocused={setIsFocused}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        {/* <Btn text="Remove" type="seethrough" onPress={() => {}} /> */}
        {tr.text && (
          <Btn
            text={t("btn.editHighlights")}
            type="seethrough"
            onPress={() => {
              SET_targetLang(lang);
              TOGGLE_modal("trHighlights");
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
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 10,

    paddingHorizontal: 16,
    paddingVertical: 12,

    backgroundColor: MyColors.btn_2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
  },
  textBtnPress: {
    backgroundColor: MyColors.btn_3,
  },
});
