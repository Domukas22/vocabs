//
//
//

import Highlighted_TEXT from "@/src/components/Highlighted_TEXT/Highlighted_TEXT";
import { ICON_difficultyDot, ICON_flag } from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import {
  DisplaySettings_PROPS,
  Translation_PROPS,
  TranslationCreation_PROPS,
  Language_PROPS,
} from "@/src/db/props";
import USE_zustand from "@/src/zustand";
import i18next, { t } from "i18next";
import { useMemo } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface VocabFront_PROPS {
  trs: Translation_PROPS[] | undefined;
  difficulty: 0 | 1 | 2 | 3 | undefined;
  description: string | undefined;

  TOGGLE_open: () => void;
  highlighted?: boolean;
}

export default function Vocab_FRONT({
  trs,
  difficulty,
  description,

  TOGGLE_open,
  highlighted,
}: VocabFront_PROPS) {
  const { z_display_SETTINGS } = USE_zustand();
  const { SHOW_description, SHOW_flags, SHOW_difficulty, frontTrLang_ID } =
    z_display_SETTINGS;

  const front_TR = useMemo(() => {
    return trs && trs.length > 0
      ? trs?.find(
          (tr) =>
            tr.lang_id === frontTrLang_ID &&
            tr.text !== "" &&
            tr.text !== undefined &&
            tr.text !== null
        )
      : null;
  }, [trs, frontTrLang_ID]);

  const { languages } = USE_langs();
  const appLang = useMemo(() => i18next.language, [i18next.language]);
  const targetLang = useMemo(
    () => languages?.find((lang) => lang.id === frontTrLang_ID),
    [frontTrLang_ID]
  );

  return (
    <Pressable
      style={({ pressed }) => [
        s.parent,
        pressed && s.parentPressed,
        highlighted && s.parentHighlighted,
      ]}
      onPress={TOGGLE_open}
    >
      <View style={s.content}>
        {front_TR ? (
          <Highlighted_TEXT
            text={front_TR?.text || "EMPTY TRANSLATION"}
            highlights={front_TR?.highlights || []}
            diff={difficulty}
          />
        ) : (
          <Label>
            {t("label.missingTranslation") +
              targetLang?.[`lang_in_${appLang || "en"}`]}
          </Label>
        )}

        {SHOW_description && description && (
          <Styled_TEXT type="label_small">{description}</Styled_TEXT>
        )}

        {(SHOW_flags || SHOW_difficulty) && (
          <View style={s.iconWrap}>
            {SHOW_flags &&
              trs &&
              trs.length > 0 &&
              trs?.map((tr) => (
                <ICON_flag key={"FrontFlag" + tr.lang_id} lang={tr.lang_id} />
              ))}
            {SHOW_difficulty && !!difficulty && (
              <ICON_difficultyDot difficulty={difficulty} />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  parent: {
    backgroundColor: MyColors.btn_2,
  },
  parentPressed: {
    backgroundColor: MyColors.btn_3,
  },
  parentHighlighted: {
    backgroundColor: MyColors.btn_green,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 12,
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagText: {
    fontSize: 14,
    fontFamily: "Nunito-Light",
    color: MyColors.text_white_06,
  },
});
