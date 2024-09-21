//
//
//

import { TranslationCreation_PROPS } from "@/src/db/models";
import languages, { languagesArr_PROPS } from "@/src/constants/languages";
import Block from "../../Block";
import { ICON_flag } from "@/src/components/icons/icons";
import Btn from "@/src/components/btn/btn";
import StyledTextInput from "@/src/components/StyledTextInput/StyledTextInput";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Styled_TEXT } from "@/src/components/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import RENDER_textWithHighlights from "@/src/components/RENDER_textWithHighlights/RENDER_textWithHighlights";

interface VocabTranslationInputs_PROPS {
  translations: TranslationCreation_PROPS[] | null;
  EDIT_tr: ({ lang_id, newText }: { lang_id: string; newText: string }) => void;
  HANLDE_trTextModal: ({
    open,
    lang_id,
  }: {
    open: boolean;
    lang_id: string;
  }) => void;
  HANLDE_trhighlightsModal: ({
    open,
    lang_id,
  }: {
    open: boolean;
    lang_id: string;
  }) => void;
  difficulty: 1 | 2 | 3;
}

export default function VocabTranslation_INPUTS({
  translations,
  HANLDE_trTextModal,
  HANLDE_trhighlightsModal,
  difficulty,
}: VocabTranslationInputs_PROPS) {
  if (!translations || !languages) return <></>;

  return translations?.map((tr: TranslationCreation_PROPS) => {
    const lang = languages[tr?.lang_id] ? languages[tr?.lang_id] : null;
    if (!lang) return <></>;

    return (
      <Block
        key={lang?.id + "inoutWrap"}
        labelIcon={<ICON_flag lang={tr?.lang_id} />}
        label={`${lang?.lang?.en} translation *`}
        styles={{ padding: 20 }}
      >
        <Pressable
          style={({ pressed }) => [s.textBtn, pressed && s.textBtnPress]}
          onPress={() => HANLDE_trTextModal({ open: true, lang_id: lang.id })}
        >
          <RENDER_textWithHighlights
            text={tr.text}
            highlights={tr.highlights}
            difficulty={difficulty}
          />
          {/* <Styled_TEXT>{tr.text}</Styled_TEXT> */}
        </Pressable>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Btn text="Remove" type="seethrough" onPress={() => {}} />
          <Btn
            text="Edit highlights"
            type="seethrough"
            onPress={() =>
              HANLDE_trhighlightsModal({ open: true, lang_id: lang.id })
            }
            style={{ flex: 1 }}
          />
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
