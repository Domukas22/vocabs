//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_flag,
  ICON_checkMark,
} from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import {
  USE_getAppLangId,
  USE_getTargetLangs,
} from "@/src/features_new/languages/hooks";

import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { z_USE_myVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";
import { t } from "i18next";
import { ScrollView, View } from "react-native";

export function MyVocabCardFrontLangToggle_BLOCK() {
  const { appearance, z_SET_frontLangId } = z_USE_myVocabsDisplaySettings();
  const { z_myVocabsCollectedLang_IDS = [] } = z_USE_myVocabs();
  const { appLang_ID } = USE_getAppLangId();

  const { frontTrLang_ID = "en" } = appearance;

  const { target_LANGS } = USE_getTargetLangs({
    targetLang_IDS: z_myVocabsCollectedLang_IDS,
  });

  return (
    <Block>
      <Label>{t("label.vocabFrontLang")}</Label>
      <ScrollView>
        {target_LANGS?.map((lang, index) => (
          <Btn
            key={"Select lang" + lang?.lang_id + lang.lang_in_en}
            iconLeft={
              <View style={{ marginRight: 4 }}>
                <ICON_flag lang={lang?.lang_id} big={true} />
              </View>
            }
            text={appLang_ID === "en" ? lang.lang_in_en : lang.lang_in_de}
            iconRight={
              frontTrLang_ID === lang?.lang_id && (
                <ICON_checkMark color="primary" />
              )
            }
            onPress={() => z_SET_frontLangId(lang?.lang_id)}
            type={frontTrLang_ID === lang?.lang_id ? "active" : "simple"}
            style={[
              { flex: 1, marginBottom: 8 },
              index === target_LANGS.length - 1 && { marginBottom: 24 },
            ]}
            text_STYLES={{ flex: 1 }}
          />
        ))}
      </ScrollView>
    </Block>
  );
}
