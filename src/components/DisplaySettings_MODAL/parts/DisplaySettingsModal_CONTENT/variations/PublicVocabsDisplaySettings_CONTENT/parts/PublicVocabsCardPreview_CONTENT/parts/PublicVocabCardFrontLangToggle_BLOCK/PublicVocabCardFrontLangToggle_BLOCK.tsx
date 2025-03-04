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
} from "@/src/features/languages/hooks";
import { z_USE_publicOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_publicOneList/z_USE_publicOneList";
import { z_USE_publicVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";
import { t } from "i18next";
import { ScrollView, View } from "react-native";

export function PublicVocabCardFrontLangToggle_BLOCK() {
  const { appearance, z_SET_frontLangId } = z_USE_publicVocabsDisplaySettings();
  const { z_publicOneList } = z_USE_publicOneList();
  const { appLang_ID } = USE_getAppLangId();

  const { frontTrLang_ID = "en" } = appearance;

  const { target_LANGS } = USE_getTargetLangs({
    targetLang_IDS: z_publicOneList?.collected_lang_ids || [],
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
