//
//
//

import Highlighted_TEXT from "@/src/components/Highlighted_TEXT/Highlighted_TEXT";
import { ICON_difficultyDot, ICON_flag } from "@/src/components/icons/icons";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import {
  DisplaySettings_PROPS,
  TranslationCreation_PROPS,
  Vocab_MODEL,
  Language_MODEL,
  PublicVocabDisplaySettings_PROPS,
} from "@/src/db/props";
import USE_zustand from "@/src/zustand";
import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface VocabFront_PROPS {
  HAS_difficulty?: boolean;
}

export default function Vocab_DUMMY({
  HAS_difficulty = true,
}: VocabFront_PROPS) {
  const { z_display_SETTINGS, z_SET_displaySettings } = USE_zustand();
  const { SHOW_description, SHOW_flags, SHOW_difficulty, frontTrLang_ID } =
    z_display_SETTINGS;

  const { t } = useTranslation();

  const { languages } = USE_langs();
  const lang: Language_MODEL = useMemo(
    () => languages?.find((lang) => lang.id === frontTrLang_ID),
    [frontTrLang_ID]
  );

  return (
    <View>
      {/* {SHOW_image && (
        <Image
          source={require("@/src/assets/images/dummyImage.jpg")}
          style={{ height: 160, width: "100%" }}
        />
      )} */}

      <View>
        <Highlighted_TEXT
          text={lang?.translation_example || "INSERT TRANSLATION"}
          highlights={lang?.translation_example_highlights}
          diff={3}
        />

        {SHOW_description && (
          <Styled_TEXT type="label_small">
            {t("vocabDummy.description")}
          </Styled_TEXT>
        )}
        {(SHOW_flags || SHOW_difficulty) && (
          <View style={s.iconWrap}>
            {SHOW_flags && <ICON_flag lang={frontTrLang_ID} />}
            {SHOW_difficulty && HAS_difficulty && (
              <ICON_difficultyDot difficulty={3} />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  iconWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 12,
  },
});
