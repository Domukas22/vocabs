//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Highlighted_TEXT from "@/src/components/1_grouped/texts/Highlighted_TEXT/Highlighted_TEXT";
import {
  ICON_difficultyDot,
  ICON_flag,
} from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import Language_MODEL from "@/src/db/models/Language_MODEL";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { DisplaySettingsModalView_PROPS } from "../../modals/VocabDisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import { FETCH_langs } from "@/src/features/languages/functions/fetch/FETCH_langs/FETCH_langs";
import { z_listDisplaySettings_PROPS } from "@/src/hooks/USE_zustand/USE_zustand";

interface VocabFront_PROPS {
  view: DisplaySettingsModalView_PROPS;
  z_vocabDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
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

          <Styled_TEXT
            type="label_small"
            style={[
              !z_vocabDisplay_SETTINGS?.SHOW_description && { opacity: 0.1 },
            ]}
          >
            {lang?.description_example || "INSERT DESCRIPTION"}
          </Styled_TEXT>

          <View style={s.iconWrap}>
            <ICON_flag
              style={[!z_vocabDisplay_SETTINGS?.SHOW_flags && { opacity: 0.1 }]}
              lang={z_vocabDisplay_SETTINGS?.frontTrLang_ID}
              big
            />
            <ICON_difficultyDot
              style={[
                !z_vocabDisplay_SETTINGS?.SHOW_difficulty && { opacity: 0.1 },
              ]}
              difficulty={3}
              big
            />
          </View>
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
