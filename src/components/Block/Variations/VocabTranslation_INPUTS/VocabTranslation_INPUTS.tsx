//
//
//

import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import languages, { languagesArr_PROPS } from "@/src/constants/languages";
import Block from "../../Block";
import { ICON_flag } from "@/src/components/icons/icons";
import Btn from "@/src/components/Btn/Btn";
import StyledTextInput from "@/src/components/StyledTextInput/StyledTextInput";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { MyColors } from "@/src/constants/MyColors";
import RENDER_textWithHighlights from "@/src/components/RENDER_textWithHighlights/RENDER_textWithHighlights";
import Label from "@/src/components/Label/Label";
import USE_fetchLangs from "@/src/db/languages/FETCH_languages";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import { Styled_TEXT } from "@/src/components/StyledText/StyledText";

interface VocabTranslationInputs_PROPS {
  languages: Language_MODEL[];
  modal_TRs: TranslationCreation_PROPS[] | null;
  modal_DIFF: 1 | 2 | 3;
  SET_trInputLang: React.Dispatch<React.SetStateAction<string>>;
  TOGGLE_trTextModal: () => void;
  TOGGLE_trHighlightsModal: () => void;
}

export default function VocabTranslation_INPUTS({
  languages,
  modal_TRs,
  modal_DIFF,
  SET_trInputLang,
  TOGGLE_trTextModal,
  TOGGLE_trHighlightsModal,
}: VocabTranslationInputs_PROPS) {
  if (!modal_TRs) return <></>;

  return modal_TRs?.map((tr: TranslationCreation_PROPS, index) => {
    const lang: Language_MODEL = languages.find(
      (lang) => lang.id === tr.lang_id
    );

    if (!lang) return <></>;
    return (
      <Block
        key={lang?.id + "inputWrap" + index}
        labelIcon={<ICON_flag lang={tr?.lang_id} />}
        styles={{ padding: 20 }}
      >
        <Label
          icon={<ICON_flag lang={lang.id} />}
        >{`${lang?.lang_in_en} translation *`}</Label>
        <Pressable
          style={({ pressed }) => [s.textBtn, pressed && s.textBtnPress]}
          onPress={() => {
            SET_trInputLang(lang.id);
            TOGGLE_trTextModal();
          }}
        >
          {tr.text && (
            <RENDER_textWithHighlights
              text={tr.text}
              highlights={tr.highlights}
              modal_DIFF={modal_DIFF}
            />
          )}
          {!tr.text && (
            <Styled_TEXT
              type="text_18_light"
              style={{ color: MyColors.text_white_06 }}
            >
              Enter {lang?.lang_in_en} text...
            </Styled_TEXT>
          )}
          {/* <Styled_TEXT>{tr.text}</Styled_TEXT> */}
        </Pressable>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {/* <Btn text="Remove" type="seethrough" onPress={() => {}} /> */}
          {tr.text && (
            <Btn
              text="Edit highlights"
              type="seethrough"
              onPress={() => {
                SET_trInputLang(lang.id);
                TOGGLE_trHighlightsModal();
              }}
              style={{ flex: 1 }}
            />
          )}
        </View>
        {/* <Styled_TEXT>Highlights: {tr.highlights}</Styled_TEXT> */}
      </Block>
    );
  });
}

const s = StyleSheet.create({
  textBtn: {
    minHeight: 100,

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
