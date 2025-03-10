//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import {
  ICON_flag,
  ICON_difficultyDot,
} from "@/src/components/1_grouped/icons/icons";
import Highlighted_TEXT from "@/src/components/1_grouped/texts/Highlighted_TEXT/Highlighted_TEXT";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { USE_getOneTargetLang } from "@/src/features_new/languages/hooks";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { z_USE_publicVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";
import { StyleSheet, View } from "react-native";

export function PublicVocabCard_DUMMY() {
  const { appearance } = z_USE_publicVocabsDisplaySettings();

  const { SHOW_description = false, frontTrLang_ID = "en" } = appearance;

  const { target_LANG } = USE_getOneTargetLang({
    targetLang_ID: frontTrLang_ID,
  });

  return (
    <Block styles={{ paddingBottom: 10 }}>
      <View>
        <Highlighted_TEXT
          text={target_LANG?.translation_example || "INSERT TRANSLATION"}
          highlights={target_LANG?.translation_example_highlights || []}
          diff={3}
        />

        <Styled_TEXT
          type="label_small"
          style={[!SHOW_description && { opacity: 0.1 }]}
        >
          {target_LANG?.description_example || "INSERT DESCRIPTION"}
        </Styled_TEXT>

        <View style={s.iconWrap}>
          <ICON_flag lang={frontTrLang_ID} big />
        </View>
      </View>
    </Block>
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
