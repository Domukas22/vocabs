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
import { VocabModal_ACTIONS } from "@/src/components/Modals/ManageVocab_MODAL/hooks/USE_modalToggles";

interface VocabTranslationInputs_PROPS {
  languages: Language_MODEL[] | undefined;
  modal_TRs: TranslationCreation_PROPS[] | undefined;
  modal_DIFF: 1 | 2 | 3;
  SET_targetLang: React.Dispatch<
    React.SetStateAction<Language_MODEL | undefined>
  >;
  TOGGLE_modal: (action: VocabModal_ACTIONS) => void;
}

export default function VocabTranslation_INPUTS({
  languages,
  modal_TRs,
  modal_DIFF,
  SET_targetLang,
  TOGGLE_modal,
}: VocabTranslationInputs_PROPS) {
  if (!modal_TRs) return <></>;

  return modal_TRs?.map((tr: TranslationCreation_PROPS, index) => {
    const lang: Language_MODEL | undefined = languages.find(
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
            SET_targetLang(lang);
            TOGGLE_modal("trText");
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
                SET_targetLang(lang);
                TOGGLE_modal("trHighlights");
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
