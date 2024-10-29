//
//
//

import Block from "@/src/components/Block/Block";
import Highlighted_TEXT from "@/src/components/Highlighted_TEXT/Highlighted_TEXT";
import { ICON_difficultyDot, ICON_flag } from "@/src/components/icons/icons";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { Language_MODEL } from "@/src/db/watermelon_MODELS";
import FETCH_langs from "@/src/features/4_languages/hooks/FETCH_langs";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";

import i18next from "i18next";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { DisplaySettingsModalView_PROPS } from "../../Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";

interface VocabFront_PROPS {
  view: DisplaySettingsModalView_PROPS;
  z_vocabDisplay_SETTINGS: _DisplaySettings_PROPS | undefined;
  SHOW_difficultyDot?: boolean;
}

export default function Vocab_DUMMY({
  view = "preview",
  z_vocabDisplay_SETTINGS,
  SHOW_difficultyDot = true,
}: VocabFront_PROPS) {
  const { t } = useTranslation();
  const [lang, SET_alang] = useState<Language_MODEL | undefined>();

  useEffect(() => {
    (async () => {
      const langs = await FETCH_langs({
        lang_ids: [z_vocabDisplay_SETTINGS?.frontTrLang_ID || "en"],
      });

      if (langs?.[0]) {
        SET_alang(langs[0]);
      }
    })();
  }, [z_vocabDisplay_SETTINGS?.frontTrLang_ID]);

  return view === "preview" ? (
    <Block>
      <View>
        <View>
          <Highlighted_TEXT
            text={lang?.translation_example || "INSERT TRANSLATION"}
            highlights={lang?.translation_example_highlights || []}
            diff={3}
          />

          {z_vocabDisplay_SETTINGS?.SHOW_description && (
            <Styled_TEXT type="label_small">
              {lang?.description_example || "INSERT DESCRIPTION"}
            </Styled_TEXT>
          )}
          {(z_vocabDisplay_SETTINGS?.SHOW_flags ||
            z_vocabDisplay_SETTINGS?.SHOW_difficulty) && (
            <View style={s.iconWrap}>
              {z_vocabDisplay_SETTINGS?.SHOW_flags && (
                <ICON_flag lang={z_vocabDisplay_SETTINGS?.frontTrLang_ID} />
              )}
              {z_vocabDisplay_SETTINGS?.SHOW_difficulty &&
                SHOW_difficultyDot && <ICON_difficultyDot difficulty={3} />}
            </View>
          )}
        </View>
      </View>
    </Block>
  ) : null;
}

const s = StyleSheet.create({
  iconWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 12,
  },
});
