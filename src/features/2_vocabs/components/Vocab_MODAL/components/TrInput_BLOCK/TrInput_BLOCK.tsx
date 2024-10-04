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
import { USE_langs } from "@/src/context/Langs_CONTEXT";

interface VocabTranslationInputs_PROPS {
  tr: TranslationCreation_PROPS;
  diff: 0 | 1 | 2 | 3;
  TOGGLE_modal: (whichModalToOpen: string) => void;
  HANDLE_trText: ({ lang_id, text }: { lang_id: string; text: string }) => void;
  SET_targetTr: React.Dispatch<
    React.SetStateAction<TranslationCreation_PROPS | undefined>
  >;
}

export default function TrInput_BLOCK({
  tr,
  diff,
  HANDLE_trText,
  TOGGLE_modal,
  SET_targetTr,
}: VocabTranslationInputs_PROPS) {
  const { t } = useTranslation();
  const appLang = useMemo(() => i18next.language, []);
  const { languages } = USE_langs();

  const lang = useMemo(
    () => languages?.find((lang: Language_MODEL) => lang.id === tr.lang_id),
    []
  );

  const inputREF = useRef(null);
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
                diff={diff}
                light
              />
            )}
          </View>
        )}

        <StyledText_INPUT
          multiline
          value={tr.text}
          SET_value={(val: string) => {
            HANDLE_trText({ lang_id: tr.lang_id, text: val });
          }}
          // placeholder={t("placeholder.translation")}
          _ref={inputREF}
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
              SET_targetTr(tr);
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
